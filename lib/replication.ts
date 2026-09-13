export const REPLICA_TARGET = 3
export const HEARTBEAT_TIMEOUT_STEPS = 2
export const COPY_STEPS = 3
export const REPLICATION_CHUNKS = ['A', 'B', 'C'] as const
export const REPLICATION_NODES = ['N1', 'N2', 'N3', 'N4'] as const

export type ChunkId = (typeof REPLICATION_CHUNKS)[number]
export type StorageNodeId = (typeof REPLICATION_NODES)[number]

export type StorageNode = {
  readonly id: StorageNodeId
  readonly online: boolean
  readonly missedHeartbeats: number
  readonly chunks: readonly ChunkId[]
}

export type ReplicaTransfer = {
  readonly chunk: ChunkId
  readonly source: StorageNodeId
  readonly destination: StorageNodeId
  readonly progress: number
}

export type ReplicationEvent = {
  readonly id: number
  readonly step: number
  readonly message: string
}

export type ReplicationState = {
  readonly nodes: readonly StorageNode[]
  readonly transfer: ReplicaTransfer | null
  readonly events: readonly ReplicationEvent[]
  readonly step: number
  readonly playing: boolean
  // Monotonic even across resets: queued timers cannot advance a newer run.
  readonly revision: number
}

export type ReplicationAction =
  | { type: 'set-node-online'; node: StorageNodeId; online: boolean }
  | { type: 'toggle-playback' }
  | { type: 'step' }
  | { type: 'tick'; revision: number }
  | { type: 'reset' }

type ReplicationPhase =
  | 'healthy'
  | 'detecting'
  | 'planning'
  | 'copying'
  | 'blocked'

export function nodeLabel(id: StorageNodeId) {
  return `Node ${id.slice(1)}`
}

export function createReplicationState(): ReplicationState {
  return {
    nodes: [
      { id: 'N1', online: true, missedHeartbeats: 0, chunks: ['A', 'B', 'C'] },
      { id: 'N2', online: true, missedHeartbeats: 0, chunks: ['A', 'B'] },
      { id: 'N3', online: true, missedHeartbeats: 0, chunks: ['A', 'C'] },
      { id: 'N4', online: true, missedHeartbeats: 0, chunks: ['B', 'C'] },
    ],
    transfer: null,
    events: [
      {
        id: 0,
        step: 0,
        message:
          'All three chunks have three live copies. Take Node 1 offline to begin.',
      },
    ],
    step: 0,
    playing: false,
    revision: 0,
  }
}

export function liveHolders(state: ReplicationState, chunk: ChunkId) {
  return state.nodes.filter(
    (node) => node.online && node.chunks.includes(chunk),
  )
}

function pendingHeartbeats(state: ReplicationState) {
  return state.nodes.filter(
    (node) => !node.online && node.missedHeartbeats < HEARTBEAT_TIMEOUT_STEPS,
  )
}

// Like the Java planner, useful repairs can continue with fewer live nodes
// than the configured target. Equal-size chunks approximate free capacity;
// fixed node/chunk ordering makes the demonstration reproducible.
function planTransfer(state: ReplicationState): ReplicaTransfer | null {
  for (const chunk of REPLICATION_CHUNKS) {
    const sources = liveHolders(state, chunk)
    if (!sources.length || sources.length >= REPLICA_TARGET) continue

    const destination = state.nodes
      .filter((node) => node.online && !node.chunks.includes(chunk))
      .sort(
        (a, b) => a.chunks.length - b.chunks.length || a.id.localeCompare(b.id),
      )[0]

    if (destination) {
      return {
        chunk,
        source: sources[0].id,
        destination: destination.id,
        progress: 0,
      }
    }
  }
  return null
}

function transferIsValid(state: ReplicationState, transfer: ReplicaTransfer) {
  const source = state.nodes.find((node) => node.id === transfer.source)
  const destination = state.nodes.find(
    (node) => node.id === transfer.destination,
  )
  return Boolean(
    source?.online &&
      source.chunks.includes(transfer.chunk) &&
      destination?.online &&
      !destination.chunks.includes(transfer.chunk) &&
      liveHolders(state, transfer.chunk).length < REPLICA_TARGET,
  )
}

export function canAdvanceReplication(state: ReplicationState) {
  return Boolean(
    pendingHeartbeats(state).length || state.transfer || planTransfer(state),
  )
}

export function replicationStatus(state: ReplicationState): {
  phase: ReplicationPhase
  label: string
  description: string
} {
  const pending = pendingHeartbeats(state)
  if (pending.length) {
    return {
      phase: 'detecting',
      label: 'Waiting for the heartbeat timeout',
      description:
        'These copies are unavailable. The master needs two missed heartbeats before planning their repair.',
    }
  }

  if (state.transfer) {
    return {
      phase: state.transfer.progress === 0 ? 'planning' : 'copying',
      label:
        state.transfer.progress === 0
          ? 'The master has planned a repair'
          : 'A surviving holder is copying a chunk',
      description:
        'Chunk bytes move directly between storage nodes. A completed copy is added when its destination reports it.',
    }
  }

  if (planTransfer(state)) {
    return {
      phase: 'planning',
      label: 'Ready to plan the next repair',
      description:
        'The master can choose a surviving holder and a live node that does not have this chunk.',
    }
  }

  const missing = REPLICATION_CHUNKS.filter(
    (chunk) => liveHolders(state, chunk).length === 0,
  )
  if (missing.length) {
    return {
      phase: 'blocked',
      label: 'Recovery needs a live source',
      description: `No live copy of ${missing.map((chunk) => `Chunk ${chunk}`).join(', ')} remains. Bring a node holding those chunks online to continue.`,
    }
  }

  if (
    REPLICATION_CHUNKS.some(
      (chunk) => liveHolders(state, chunk).length < REPLICA_TARGET,
    )
  ) {
    const online = state.nodes.filter((node) => node.online).length
    return {
      phase: 'blocked',
      label: 'More live nodes are needed',
      description: `The ${online} online nodes hold every available chunk. Bring another node online to reach the target of three live copies.`,
    }
  }

  return {
    phase: 'healthy',
    label: 'Every chunk meets the replica target',
    description:
      'Each chunk has at least three live copies. Take a node offline to explore another failure.',
  }
}

function addEvent(state: ReplicationState, message: string): ReplicationState {
  return {
    ...state,
    events: [
      ...state.events.slice(-5),
      {
        id: (state.events.at(-1)?.id ?? -1) + 1,
        step: state.step,
        message,
      },
    ],
  }
}

function settle(state: ReplicationState): ReplicationState {
  return {
    ...state,
    playing: state.playing && canAdvanceReplication(state),
    revision: state.revision + 1,
  }
}

function advance(state: ReplicationState): ReplicationState {
  if (!canAdvanceReplication(state)) return state

  let next: ReplicationState = { ...state, step: state.step + 1 }
  const pending = pendingHeartbeats(next)
  if (pending.length) {
    next = {
      ...next,
      nodes: next.nodes.map((node) =>
        pending.some((entry) => entry.id === node.id)
          ? { ...node, missedHeartbeats: node.missedHeartbeats + 1 }
          : node,
      ),
    }
    const timedOut = pending.filter(
      (node) => node.missedHeartbeats + 1 === HEARTBEAT_TIMEOUT_STEPS,
    )
    const message = timedOut.length
      ? `The master timed out ${timedOut.map((node) => nodeLabel(node.id)).join(', ')} and removed their replicas from placement records.`
      : `Heartbeat missed: ${pending.map((node) => `${nodeLabel(node.id)} (${node.missedHeartbeats + 1}/${HEARTBEAT_TIMEOUT_STEPS})`).join(', ')}.`
    return settle(addEvent(next, message))
  }

  const transfer = next.transfer
  if (transfer) {
    // Also validate at commit time: a stale/invalid transfer must never create
    // a replica after its source or destination becomes unavailable.
    if (!transferIsValid(next, transfer)) {
      return settle(
        addEvent(
          { ...next, transfer: null },
          `The copy of Chunk ${transfer.chunk} was cancelled. The master will reassess the available replicas.`,
        ),
      )
    }

    const progress = transfer.progress + 1
    if (progress < COPY_STEPS) {
      return settle(
        addEvent(
          { ...next, transfer: { ...transfer, progress } },
          `Copying Chunk ${transfer.chunk}: ${nodeLabel(transfer.source)} → ${nodeLabel(transfer.destination)}, ${Math.round((progress / COPY_STEPS) * 100)}%.`,
        ),
      )
    }

    // Collapse the successful write and following replica report into one
    // event. Partial transfers never count as stored or readable copies.
    next = {
      ...next,
      transfer: null,
      nodes: next.nodes.map((node) =>
        node.id === transfer.destination
          ? { ...node, chunks: [...node.chunks, transfer.chunk].sort() }
          : node,
      ),
    }
    return settle(
      addEvent(
        next,
        `${nodeLabel(transfer.destination)} reports Chunk ${transfer.chunk}. That chunk now has ${liveHolders(next, transfer.chunk).length} live copies.`,
      ),
    )
  }

  const planned = planTransfer(next)
  if (planned) {
    return settle(
      addEvent(
        { ...next, transfer: planned },
        `The master asks ${nodeLabel(planned.source)} to copy Chunk ${planned.chunk} directly to ${nodeLabel(planned.destination)}.`,
      ),
    )
  }
  return settle(next)
}

export function replicationReducer(
  state: ReplicationState,
  action: ReplicationAction,
): ReplicationState {
  switch (action.type) {
    case 'reset':
      return { ...createReplicationState(), revision: state.revision + 1 }

    case 'toggle-playback':
      if (!state.playing && !canAdvanceReplication(state)) return state
      return {
        ...state,
        playing: !state.playing,
        revision: state.revision + 1,
      }

    case 'tick':
      if (!state.playing || action.revision !== state.revision) return state
      return advance(state)

    case 'step':
      return advance({ ...state, playing: false })

    case 'set-node-online': {
      const node = state.nodes.find((entry) => entry.id === action.node)
      if (!node || node.online === action.online) return state

      let next: ReplicationState = {
        ...state,
        nodes: state.nodes.map((entry) =>
          entry.id === action.node
            ? { ...entry, online: action.online, missedHeartbeats: 0 }
            : entry,
        ),
      }
      let message = action.online
        ? `${nodeLabel(action.node)} returned and reported its stored chunks. Existing replicas are kept.`
        : `${nodeLabel(action.node)} stopped sending heartbeats. Its stored chunks are now unavailable.`

      if (next.transfer && !transferIsValid(next, next.transfer)) {
        message += ` The unfinished copy of Chunk ${next.transfer.chunk} was cancelled.`
        next = { ...next, transfer: null }
      }

      return settle(addEvent(next, message))
    }
  }
}
