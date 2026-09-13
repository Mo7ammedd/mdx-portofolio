'use client'

import { useEffect, useReducer } from 'react'
import {
  ArrowRight,
  HardDrive,
  Network,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
} from 'lucide-react'

import {
  COPY_STEPS,
  HEARTBEAT_TIMEOUT_STEPS,
  REPLICATION_CHUNKS,
  REPLICA_TARGET,
  canAdvanceReplication,
  createReplicationState,
  liveHolders,
  nodeLabel,
  replicationReducer,
  replicationStatus,
  type ChunkId,
} from '@/lib/replication'

const buttonClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/15 px-3 text-xs text-zinc-300 motion-safe:transition-colors hover:border-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40'

const chunkColors: Record<ChunkId, string> = {
  A: 'border-sky-400/25 bg-sky-400/10 text-sky-200',
  B: 'border-violet-400/25 bg-violet-400/10 text-violet-200',
  C: 'border-amber-400/25 bg-amber-400/10 text-amber-200',
}

const phases = [
  { id: 'detecting', label: 'Detect' },
  { id: 'planning', label: 'Plan' },
  { id: 'copying', label: 'Copy' },
] as const

export function ReplicationDemo() {
  const [state, dispatch] = useReducer(
    replicationReducer,
    undefined,
    createReplicationState,
  )
  const status = replicationStatus(state)
  const canAdvance = canAdvanceReplication(state)
  const transfer = state.transfer
  const progress = transfer
    ? Math.round((transfer.progress / COPY_STEPS) * 100)
    : 0
  const latestEvent = state.events.at(-1)!
  const onlineCount = state.nodes.filter((node) => node.online).length

  useEffect(() => {
    if (!state.playing || !canAdvance) return
    const timer = window.setTimeout(() => {
      dispatch({ type: 'tick', revision: state.revision })
    }, 1100)
    return () => window.clearTimeout(timer)
  }, [state.playing, state.revision, canAdvance])

  return (
    <section
      id="replication"
      aria-labelledby="replication-title"
      className="scroll-mt-8 border-y border-white/10 py-8"
    >
      <p className="section-heading">Interactive demo</p>
      <h2
        id="replication-title"
        className="mt-3 text-xl font-medium tracking-tight text-zinc-100"
      >
        Watch replicas recover
      </h2>
      <p className="mt-3 text-sm leading-7 text-zinc-400">
        Take a node offline, then press Play or Step to follow missed
        heartbeats, a repair decision, and a copy between storage nodes.
      </p>
      <p className="mt-2 font-mono text-[11px] leading-5 text-zinc-400">
        Browser simulation · 4 nodes · target: 3 replicas per chunk
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={`${buttonClass} border-zinc-500 text-zinc-100`}
          disabled={!canAdvance && !state.playing}
          aria-label={state.playing ? 'Pause recovery' : 'Play recovery'}
          onClick={() => dispatch({ type: 'toggle-playback' })}
        >
          {state.playing ? (
            <Pause aria-hidden="true" className="size-3.5" />
          ) : (
            <Play aria-hidden="true" className="size-3.5" />
          )}
          {state.playing ? 'Pause' : 'Play'}
        </button>
        <button
          type="button"
          className={buttonClass}
          disabled={!canAdvance}
          aria-label="Step through recovery"
          onClick={() => dispatch({ type: 'step' })}
        >
          <SkipForward aria-hidden="true" className="size-3.5" />
          Step
        </button>
        <button
          type="button"
          className={buttonClass}
          aria-label="Reset recovery simulation"
          onClick={() => dispatch({ type: 'reset' })}
        >
          <RotateCcw aria-hidden="true" className="size-3.5" />
          Reset
        </button>
        <p className="w-full pt-1 font-mono text-[11px] text-zinc-400 sm:ml-auto sm:w-auto sm:pt-0">
          Step {state.step} ·{' '}
          {state.playing ? 'Playing' : canAdvance ? 'Paused' : 'Idle'}
        </p>
      </div>

      <div className="mt-5 rounded-lg border border-white/10 bg-zinc-950/60 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-xs font-medium text-zinc-200">
            <Network aria-hidden="true" className="size-4 text-zinc-400" />
            Metadata master
          </p>
          <p className="font-mono text-[11px] text-zinc-400">
            {onlineCount} / 4 nodes online
          </p>
        </div>
        <ol
          aria-label="Recovery stages"
          className="mt-4 grid grid-cols-3 gap-2"
        >
          {phases.map((phase, index) => (
            <li
              key={phase.id}
              aria-current={status.phase === phase.id ? 'step' : undefined}
              className={`rounded-md border px-2 py-2 text-center text-[11px] ${
                status.phase === phase.id
                  ? 'border-sky-300/40 bg-sky-300/5 text-sky-200'
                  : 'border-white/10 text-zinc-400'
              }`}
            >
              <span className="mr-1.5 font-mono">0{index + 1}</span>
              {phase.label}
            </li>
          ))}
        </ol>

        <div className="mt-4 min-h-24">
          <p
            className={`text-sm leading-6 font-medium ${status.phase === 'blocked' ? 'text-amber-200' : status.phase === 'healthy' ? 'text-emerald-200' : 'text-zinc-200'}`}
          >
            {status.label}
          </p>
          <p className="mt-1 text-xs leading-6 text-zinc-400">
            {status.description}
          </p>
        </div>

        <div
          className="mt-3 rounded-md border border-white/10 bg-black/40 p-3"
          role="group"
          aria-label="Direct chunk transfer"
        >
          {transfer ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <p className="font-mono text-zinc-300">
                  {nodeLabel(transfer.source)}
                  <ArrowRight
                    aria-hidden="true"
                    className="mx-2 inline size-3.5 text-sky-300"
                  />
                  {nodeLabel(transfer.destination)}
                </p>
                <span
                  className={`rounded border px-2 py-1 font-mono text-[11px] ${chunkColors[transfer.chunk]}`}
                >
                  Chunk {transfer.chunk}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div
                  role="progressbar"
                  aria-label={`Copy Chunk ${transfer.chunk} from ${nodeLabel(transfer.source)} to ${nodeLabel(transfer.destination)}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                  className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-zinc-800"
                >
                  <div
                    className="h-full rounded-full bg-sky-300/80 motion-safe:transition-[width] motion-safe:duration-500 motion-reduce:transition-none"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-[11px] text-zinc-300">
                  {progress}%
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-5 text-zinc-400">
                {transfer.progress === 0
                  ? 'Repair command sent. The next step starts the copy.'
                  : 'The new replica counts after the whole chunk arrives.'}
              </p>
            </>
          ) : (
            <div className="flex min-h-20 flex-col justify-center gap-1">
              <p className="text-xs text-zinc-300">No copy in flight</p>
              <p className="text-[11px] leading-5 text-zinc-400">
                {status.phase === 'detecting'
                  ? 'Waiting for the master to detect the missing node.'
                  : status.phase === 'planning'
                    ? 'The next step chooses a source and a destination.'
                    : status.phase === 'blocked'
                      ? 'Bring a storage node online to make progress.'
                      : 'Take a storage node offline to start a recovery.'}
              </p>
            </div>
          )}
        </div>
      </div>

      <ul
        aria-label="Storage nodes"
        className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {state.nodes.map((node) => {
          const detecting =
            !node.online && node.missedHeartbeats < HEARTBEAT_TIMEOUT_STEPS
          const isSource = transfer?.source === node.id
          const isDestination = transfer?.destination === node.id
          const nodeStatus = node.online
            ? 'Online'
            : detecting
              ? `Missed ${node.missedHeartbeats}/${HEARTBEAT_TIMEOUT_STEPS}`
              : 'Offline'

          return (
            <li
              key={node.id}
              className={`min-w-0 rounded-lg border p-3 ${
                !node.online
                  ? 'border-rose-400/25 bg-rose-400/5'
                  : isSource || isDestination
                    ? 'border-sky-300/40 bg-sky-300/5'
                    : 'border-white/10 bg-zinc-950/60'
              }`}
            >
              <h3 className="flex items-center gap-1.5 text-xs font-medium text-zinc-200">
                <HardDrive aria-hidden="true" className="size-3.5 shrink-0" />
                {nodeLabel(node.id)}
              </h3>
              <p
                id={`replication-${node.id}-status`}
                className={`mt-2 text-[11px] ${node.online ? 'text-emerald-200' : detecting ? 'text-amber-200' : 'text-rose-200'}`}
              >
                {nodeStatus}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {REPLICATION_CHUNKS.map((chunk) => {
                  const stored = node.chunks.includes(chunk)
                  const incoming = isDestination && transfer?.chunk === chunk
                  return (
                    <span
                      key={chunk}
                      className={`flex size-6 items-center justify-center rounded border font-mono text-[11px] ${
                        stored
                          ? node.online
                            ? chunkColors[chunk]
                            : 'border-white/15 text-zinc-400 line-through'
                          : incoming
                            ? 'border-dashed border-sky-300/50 text-sky-200'
                            : 'border-white/10 text-zinc-400'
                      }`}
                    >
                      <span aria-hidden="true">
                        {stored || incoming ? chunk : '—'}
                      </span>
                      <span className="sr-only">
                        {`Chunk ${chunk}: ${stored ? (node.online ? 'live copy' : 'stored, unavailable') : incoming ? 'copy in progress' : 'no copy'}`}
                      </span>
                    </span>
                  )
                })}
              </div>
              <p className="mt-2 min-h-5 text-[11px] leading-5 text-zinc-400">
                {isSource
                  ? `Sending ${transfer.chunk}`
                  : isDestination
                    ? `Receiving ${transfer.chunk}`
                    : `${node.chunks.length} stored chunks`}
              </p>
              <button
                type="button"
                className={`${buttonClass} mt-3 w-full px-1.5`}
                aria-label={`${node.online ? 'Take offline' : 'Bring online'}: ${nodeLabel(node.id)}`}
                aria-describedby={`replication-${node.id}-status`}
                onClick={() =>
                  dispatch({
                    type: 'set-node-online',
                    node: node.id,
                    online: !node.online,
                  })
                }
              >
                {node.online ? 'Take offline' : 'Bring online'}
              </button>
            </li>
          )
        })}
      </ul>
      <p className="mt-2 text-[11px] leading-5 text-zinc-400">
        A, B, and C are chunks of one file. Offline copies stay on disk and
        become available when the node returns.
      </p>

      <table className="mt-6 w-full text-left text-xs">
        <caption className="mb-3 text-left text-xs font-medium text-zinc-300">
          Live copies · target: {REPLICA_TARGET} per chunk
        </caption>
        <thead className="text-[11px] text-zinc-400">
          <tr className="border-b border-white/10">
            <th scope="col" className="pb-2 font-normal">
              Chunk
            </th>
            <th scope="col" className="pb-2 font-normal">
              Copies
            </th>
            <th scope="col" className="pb-2 font-normal">
              Live holders
            </th>
          </tr>
        </thead>
        <tbody>
          {REPLICATION_CHUNKS.map((chunk) => {
            const holders = liveHolders(state, chunk)
            return (
              <tr key={chunk} className="border-b border-white/10">
                <th scope="row" className="py-3 font-medium text-zinc-300">
                  Chunk {chunk}
                </th>
                <td
                  className={`py-3 font-mono ${holders.length >= REPLICA_TARGET ? 'text-emerald-200' : holders.length ? 'text-amber-200' : 'text-rose-200'}`}
                >
                  {holders.length} / {REPLICA_TARGET}
                </td>
                <td className="py-3 font-mono text-[11px] text-zinc-400">
                  {holders.map((node) => node.id).join(', ') || 'None'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="mt-4 min-h-16 rounded-md border border-white/10 px-3 py-2.5"
      >
        <p className="font-mono text-[10px] leading-5 text-zinc-400">
          Step {state.step} ·{' '}
          {state.playing
            ? 'Playing'
            : canAdvance
              ? 'Paused'
              : status.phase === 'blocked'
                ? 'Waiting for a node'
                : 'At target'}
        </p>
        <p className="mt-1 text-xs leading-6 text-zinc-300">
          {latestEvent.message}
        </p>
        {status.phase === 'blocked' && (
          <p className="mt-1 text-xs leading-6 text-amber-200">
            {status.description}
          </p>
        )}
      </div>

      <details className="mt-3 text-xs">
        <summary className="min-h-11 cursor-pointer content-center text-zinc-300">
          Recent events
        </summary>
        <ol aria-label="Recent recovery events" className="space-y-2 pb-3">
          {state.events.map((event) => (
            <li key={event.id} className="flex gap-3 text-[11px] leading-6">
              <span className="shrink-0 font-mono text-zinc-400">
                {String(event.step).padStart(2, '0')}
              </span>
              <span className="text-zinc-400">{event.message}</span>
            </li>
          ))}
        </ol>
      </details>
      <p className="mt-2 text-[11px] leading-6 text-zinc-400">
        This illustrative model runs in your browser: three equal-size chunks, a
        two-step heartbeat timeout, and one repair at a time. Each completed
        copy includes the next replica report. Returning nodes keep extra
        copies; steps represent event order, with no network or disk I/O.
      </p>
    </section>
  )
}
