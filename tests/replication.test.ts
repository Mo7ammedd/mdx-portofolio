import assert from 'node:assert/strict'
import test from 'node:test'

import {
  COPY_STEPS,
  HEARTBEAT_TIMEOUT_STEPS,
  REPLICATION_CHUNKS,
  REPLICATION_NODES,
  REPLICA_TARGET,
  canAdvanceReplication,
  createReplicationState,
  liveHolders,
  replicationReducer,
  replicationStatus,
  type ReplicationAction,
  type ReplicationState,
  type StorageNodeId,
} from '../lib/replication'

function setOnline(
  state: ReplicationState,
  node: StorageNodeId,
  online: boolean,
) {
  return replicationReducer(state, { type: 'set-node-online', node, online })
}

function step(state: ReplicationState, count = 1): ReplicationState {
  for (let index = 0; index < count; index++) {
    state = replicationReducer(state, { type: 'step' })
  }
  return state
}

function playToStop(state: ReplicationState) {
  if (!state.playing) {
    state = replicationReducer(state, { type: 'toggle-playback' })
  }
  let ticks = 0
  while (state.playing) {
    assert.ok(ticks++ < 100, 'playback must stop without an endless timer')
    state = replicationReducer(state, {
      type: 'tick',
      revision: state.revision,
    })
  }
  return state
}

function counts(state: ReplicationState) {
  return REPLICATION_CHUNKS.map((chunk) => liveHolders(state, chunk).length)
}

function partialFirstCopy() {
  return step(setOnline(createReplicationState(), 'N1', false), 4)
}

test('a healthy cluster stays idle with three distinct live copies per chunk', () => {
  const state = createReplicationState()
  assert.deepEqual(counts(state), [3, 3, 3])
  assert.equal(canAdvanceReplication(state), false)
  assert.equal(replicationStatus(state).phase, 'healthy')
  assert.deepEqual(step(state), state)
  assert.equal(
    replicationReducer(state, { type: 'toggle-playback' }).playing,
    false,
  )
  assert.equal(
    replicationReducer(state, { type: 'tick', revision: state.revision }),
    state,
  )
})

test('node loss is detected before planning, and full copies restore the target', () => {
  const original = createReplicationState()
  let state = setOnline(original, 'N1', false)
  assert.deepEqual(counts(state), [2, 2, 2])
  assert.deepEqual(state.nodes[0].chunks, ['A', 'B', 'C'])
  assert.equal(state.nodes[0].missedHeartbeats, 0)
  assert.equal(replicationStatus(state).phase, 'detecting')

  state = step(state)
  assert.equal(state.nodes[0].missedHeartbeats, 1)
  assert.equal(state.transfer, null)
  state = step(state)
  assert.equal(state.nodes[0].missedHeartbeats, HEARTBEAT_TIMEOUT_STEPS)
  assert.equal(replicationStatus(state).phase, 'planning')
  assert.equal(state.transfer, null)

  state = step(state)
  assert.deepEqual(state.transfer, {
    chunk: 'A',
    source: 'N2',
    destination: 'N4',
    progress: 0,
  })
  state = step(state, COPY_STEPS - 1)
  assert.deepEqual(counts(state), [2, 2, 2])
  assert.equal(state.nodes[3].chunks.includes('A'), false)
  state = step(state)
  assert.deepEqual(counts(state), [3, 2, 2])
  assert.equal(state.transfer, null)
  assert.match(state.events.at(-1)!.message, /Node 4 reports Chunk A/)

  state = playToStop(state)
  assert.deepEqual(counts(state), [3, 3, 3])
  assert.equal(canAdvanceReplication(state), false)
  assert.equal(replicationStatus(state).phase, 'healthy')
  for (const node of state.nodes.filter((entry) => entry.online)) {
    assert.deepEqual(node.chunks, ['A', 'B', 'C'])
  }
  assert.deepEqual(original, createReplicationState())
})

test('two surviving nodes still repair missing copies before stopping below target', () => {
  let state = setOnline(createReplicationState(), 'N1', false)
  state = setOnline(state, 'N2', false)
  assert.deepEqual(counts(state), [1, 1, 2])
  state = playToStop(state)
  assert.deepEqual(counts(state), [2, 2, 2])
  assert.equal(replicationStatus(state).phase, 'blocked')
  assert.match(replicationStatus(state).description, /2 online nodes/)
  assert.equal(canAdvanceReplication(state), false)
  assert.equal(state.playing, false)

  state = playToStop(setOnline(state, 'N2', true))
  assert.deepEqual(counts(state), [3, 3, 3])
  assert.equal(replicationStatus(state).phase, 'healthy')
})

test('a chunk without a live source cannot be invented; returning a holder enables repair', () => {
  let state = createReplicationState()
  for (const id of ['N1', 'N2', 'N3'] as const) {
    state = setOnline(state, id, false)
  }
  state = playToStop(state)
  assert.deepEqual(counts(state), [0, 1, 1])
  assert.match(replicationStatus(state).description, /No live copy of Chunk A/)
  assert.equal(state.nodes[3].chunks.includes('A'), false)
  assert.equal(canAdvanceReplication(state), false)
  assert.equal(state.step, HEARTBEAT_TIMEOUT_STEPS)

  state = playToStop(setOnline(state, 'N3', true))
  assert.deepEqual(counts(state), [2, 2, 2])
  assert.equal(state.nodes[3].chunks.includes('A'), true)
  assert.match(replicationStatus(state).description, /2 online nodes/)
})

test('losing a source cancels a partial copy and another surviving holder can retry', () => {
  let state = partialFirstCopy()
  assert.equal(state.transfer?.progress, 1)
  assert.equal(state.transfer?.source, 'N2')
  state = setOnline(state, 'N2', false)
  assert.equal(state.transfer, null)
  assert.equal(state.nodes[3].chunks.includes('A'), false)
  assert.match(
    state.events.at(-1)!.message,
    /unfinished copy of Chunk A was cancelled/,
  )

  state = step(state, HEARTBEAT_TIMEOUT_STEPS + 1)
  assert.equal(state.transfer?.source, 'N3')
  assert.equal(state.transfer?.destination, 'N4')
  state = playToStop(state)
  assert.deepEqual(counts(state), [2, 2, 2])
  assert.equal(state.nodes[3].chunks.includes('A'), true)
})

test('losing the destination never stores a partial replica, even after other repairs', () => {
  let state = setOnline(partialFirstCopy(), 'N4', false)
  assert.equal(state.transfer, null)
  assert.equal(state.nodes[3].chunks.includes('A'), false)
  state = playToStop(state)
  assert.deepEqual(counts(state), [2, 2, 2])
  assert.equal(state.nodes[3].chunks.includes('A'), false)

  state = playToStop(setOnline(state, 'N4', true))
  assert.deepEqual(counts(state), [3, 3, 3])
  assert.equal(state.nodes[3].chunks.includes('A'), true)
})

test('a returning holder cancels unnecessary work and completed extra copies are retained', () => {
  let state = setOnline(partialFirstCopy(), 'N1', true)
  assert.equal(state.transfer, null)
  assert.deepEqual(counts(state), [3, 3, 3])
  assert.equal(state.nodes[3].chunks.includes('A'), false)
  assert.equal(canAdvanceReplication(state), false)

  state = playToStop(setOnline(createReplicationState(), 'N1', false))
  state = setOnline(state, 'N1', true)
  assert.deepEqual(counts(state), [4, 4, 4])
  assert.equal(replicationStatus(state).phase, 'healthy')
  assert.equal(canAdvanceReplication(state), false)
  for (const node of state.nodes) assert.equal(new Set(node.chunks).size, 3)
})

test('play, pause, step and reset control playback and reject stale ticks', () => {
  let state = setOnline(createReplicationState(), 'N1', false)
  state = replicationReducer(state, { type: 'toggle-playback' })
  assert.equal(state.playing, true)
  const firstTimer = { type: 'tick', revision: state.revision } as const
  state = replicationReducer(state, firstTimer)
  assert.equal(state.step, 1)
  assert.equal(replicationReducer(state, firstTimer), state)

  const beforePause = state
  const secondTimer = { type: 'tick', revision: state.revision } as const
  state = replicationReducer(state, { type: 'toggle-playback' })
  assert.equal(state.playing, false)
  assert.equal(state.step, beforePause.step)
  assert.deepEqual(state.nodes, beforePause.nodes)
  assert.equal(replicationReducer(state, secondTimer), state)

  state = replicationReducer(state, { type: 'toggle-playback' })
  state = step(state)
  assert.equal(state.playing, false)
  assert.equal(state.step, 2)
  state = replicationReducer(state, { type: 'toggle-playback' })
  const beforeNodeChange = { type: 'tick', revision: state.revision } as const
  state = setOnline(state, 'N2', false)
  assert.equal(replicationReducer(state, beforeNodeChange), state)

  const beforeReset = { type: 'tick', revision: state.revision } as const
  state = replicationReducer(state, { type: 'reset' })
  const initial = createReplicationState()
  assert.deepEqual({ ...state, revision: 0 }, initial)
  assert.ok(state.revision > beforeReset.revision)
  state = setOnline(state, 'N1', false)
  state = replicationReducer(state, { type: 'toggle-playback' })
  assert.equal(replicationReducer(state, beforeReset), state)
  assert.equal(state.step, 0)
})

test('all nodes can go offline and return without losing their stored chunks', () => {
  let state = createReplicationState()
  for (const id of REPLICATION_NODES) state = setOnline(state, id, false)
  state = playToStop(state)
  assert.deepEqual(counts(state), [0, 0, 0])
  assert.equal(replicationStatus(state).phase, 'blocked')
  assert.equal(state.transfer, null)
  for (const id of REPLICATION_NODES) state = setOnline(state, id, true)
  assert.deepEqual(counts(state), [3, 3, 3])
  assert.equal(replicationStatus(state).phase, 'healthy')
})

function freezeState(state: ReplicationState) {
  for (const node of state.nodes) {
    Object.freeze(node.chunks)
    Object.freeze(node)
  }
  for (const event of state.events) Object.freeze(event)
  Object.freeze(state.nodes)
  Object.freeze(state.events)
  if (state.transfer) Object.freeze(state.transfer)
  return Object.freeze(state)
}

test('mixed failures and playback actions are deterministic, immutable, and never duplicate replicas', () => {
  let state = createReplicationState()
  let seed = 1789
  const random = (max: number) => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return (seed >>> 12) % max
  }

  for (let sample = 0; sample < 800; sample++) {
    state = freezeState(state)
    const previous = structuredClone(state)
    const choice = random(12)
    const id = REPLICATION_NODES[random(REPLICATION_NODES.length)]
    const action: ReplicationAction =
      choice < 7
        ? { type: 'step' }
        : choice === 7
          ? { type: 'tick', revision: state.revision }
          : choice === 8
            ? { type: 'toggle-playback' }
            : choice === 9
              ? { type: 'reset' }
              : {
                  type: 'set-node-online',
                  node: id,
                  online: !state.nodes.find((node) => node.id === id)!.online,
                }
    const next = replicationReducer(state, action)
    assert.deepEqual(state, previous)
    assert.deepEqual(next, replicationReducer(state, action))
    assert.deepEqual(
      next.nodes.map((node) => node.id),
      REPLICATION_NODES,
    )
    assert.ok(next.revision >= state.revision)
    assert.ok(!next.playing || canAdvanceReplication(next))

    for (const node of next.nodes) {
      assert.equal(new Set(node.chunks).size, node.chunks.length)
      assert.ok(
        node.chunks.every((chunk) => REPLICATION_CHUNKS.includes(chunk)),
      )
      assert.ok(node.missedHeartbeats <= HEARTBEAT_TIMEOUT_STEPS)
      if (node.online) assert.equal(node.missedHeartbeats, 0)

      if (action.type === 'reset') continue
      const old = state.nodes.find((entry) => entry.id === node.id)!
      assert.ok(old.chunks.every((chunk) => node.chunks.includes(chunk)))
      for (const added of node.chunks.filter(
        (chunk) => !old.chunks.includes(chunk),
      )) {
        assert.ok(action.type === 'tick' || action.type === 'step')
        assert.equal(state.transfer?.chunk, added)
        assert.equal(state.transfer?.destination, node.id)
        assert.equal(state.transfer?.progress, COPY_STEPS - 1)
        assert.equal(node.online, true)
      }
    }

    if (next.transfer) {
      const { chunk, source, destination, progress } = next.transfer
      const from = next.nodes.find((node) => node.id === source)!
      const to = next.nodes.find((node) => node.id === destination)!
      assert.ok(from.online && to.online)
      assert.ok(from.chunks.includes(chunk))
      assert.ok(!to.chunks.includes(chunk))
      assert.notEqual(source, destination)
      assert.ok(liveHolders(next, chunk).length < REPLICA_TARGET)
      assert.ok(progress >= 0 && progress < COPY_STEPS)
    }
    state = next
  }
})
