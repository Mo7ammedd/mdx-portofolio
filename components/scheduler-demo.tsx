'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pause, Play, Plus, RotateCcw, SkipForward, X } from 'lucide-react'

import { trackEvent } from '@/components/analytics'
import {
  SCHEDULER_LIMITS,
  simulateSchedule,
  type SchedulingAlgorithm,
} from '@/lib/scheduler'

type EditableProcess = { id: string; arrival: string; burst: string }

const PRESETS: Record<string, { label: string; processes: EditableProcess[] }> =
  {
    staggered: {
      label: 'Staggered arrivals',
      processes: [
        { id: 'P1', arrival: '0', burst: '8' },
        { id: 'P2', arrival: '1', burst: '4' },
        { id: 'P3', arrival: '2', burst: '2' },
        { id: 'P4', arrival: '3', burst: '1' },
      ],
    },
    together: {
      label: 'Long job arrives first',
      processes: [
        { id: 'P1', arrival: '0', burst: '8' },
        { id: 'P2', arrival: '0', burst: '4' },
        { id: 'P3', arrival: '0', burst: '2' },
        { id: 'P4', arrival: '0', burst: '1' },
      ],
    },
    idle: {
      label: 'Gaps between arrivals',
      processes: [
        { id: 'P1', arrival: '2', burst: '3' },
        { id: 'P2', arrival: '8', burst: '2' },
        { id: 'P3', arrival: '12', burst: '4' },
      ],
    },
  }

const POLICIES: {
  id: SchedulingAlgorithm
  label: string
  description: string
}[] = [
  {
    id: 'fcfs',
    label: 'FCFS',
    description:
      'First come, first served. Each process runs to completion in arrival order.',
  },
  {
    id: 'sjf',
    label: 'SJF',
    description:
      'Non-preemptive shortest job first. Choose the shortest burst among ready processes.',
  },
  {
    id: 'round-robin',
    label: 'Round Robin',
    description:
      'Share the CPU in time slices. Unfinished processes return to the end of the ready queue.',
  },
]

const PROCESS_COLORS = [
  'border-sky-400/25 bg-sky-400/20 text-sky-200',
  'border-emerald-400/25 bg-emerald-400/20 text-emerald-200',
  'border-amber-400/25 bg-amber-400/20 text-amber-200',
  'border-violet-400/25 bg-violet-400/20 text-violet-200',
  'border-rose-400/25 bg-rose-400/20 text-rose-200',
  'border-cyan-400/25 bg-cyan-400/20 text-cyan-200',
  'border-orange-400/25 bg-orange-400/20 text-orange-200',
  'border-lime-400/25 bg-lime-400/20 text-lime-200',
]

function processColor(id: string) {
  return PROCESS_COLORS[Number(id.slice(1)) - 1]
}

function invalidNumber(value: string, min: number, max: number) {
  const number = Number(value)
  return (
    value.trim() === '' ||
    !Number.isInteger(number) ||
    number < min ||
    number > max
  )
}

const buttonClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/15 px-3 text-xs text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40'
const inputClass =
  'h-10 w-full rounded-md border border-white/15 bg-zinc-950 px-3 font-mono text-xs text-zinc-200 aria-invalid:border-red-400'

export function SchedulerDemo() {
  const [algorithm, setAlgorithm] = useState<SchedulingAlgorithm>('fcfs')
  const [preset, setPreset] = useState('staggered')
  const [processes, setProcesses] = useState(PRESETS.staggered.processes)
  const [quantum, setQuantum] = useState('2')
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const { result, error } = useMemo(() => {
    try {
      return {
        result: simulateSchedule(
          processes.map((process) => ({
            id: process.id,
            arrival:
              process.arrival.trim() === '' ? NaN : Number(process.arrival),
            burst: process.burst.trim() === '' ? NaN : Number(process.burst),
          })),
          algorithm,
          quantum.trim() === '' ? NaN : Number(quantum),
        ),
        error: null,
      }
    } catch (error) {
      return {
        result: null,
        error:
          error instanceof Error ? error.message : 'Check the process values.',
      }
    }
  }, [processes, algorithm, quantum])

  const totalTime = result?.totalTime ?? 0

  useEffect(() => {
    if (!isPlaying || currentTime >= totalTime) return
    const timer = window.setTimeout(() => {
      const nextTime = currentTime + 1
      setCurrentTime(nextTime)
      if (nextTime >= totalTime) setIsPlaying(false)
    }, 600)
    return () => window.clearTimeout(timer)
  }, [isPlaying, currentTime, totalTime])

  const resetPlayback = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const updateProcess = (
    id: string,
    field: 'arrival' | 'burst',
    value: string,
  ) => {
    setProcesses((previous) =>
      previous.map((process) =>
        process.id === id ? { ...process, [field]: value } : process,
      ),
    )
    setPreset('custom')
    resetPlayback()
  }

  const loadPreset = (name: string) => {
    setProcesses(PRESETS[name].processes)
    setPreset(name)
    resetPlayback()
  }

  const active = result?.segments.find(
    (segment) => segment.start <= currentTime && segment.end > currentTime,
  )
  const waiting = result?.processes.filter(
    (process) =>
      process.arrival <= currentTime &&
      process.completion > currentTime &&
      process.id !== active?.processId,
  )

  return (
    <section
      id="scheduler"
      aria-labelledby="scheduler-title"
      className="scroll-mt-8 border-y border-white/10 py-8"
    >
      <p className="section-heading">Interactive demo</p>
      <h2
        id="scheduler-title"
        className="mt-3 text-xl font-medium tracking-tight text-zinc-100"
      >
        Scheduling playground
      </h2>
      <p className="mt-3 text-sm leading-7 text-zinc-400">
        Change the workload, choose a policy, and follow each process through
        the CPU.
      </p>
      <p className="mt-2 font-mono text-[11px] leading-5 text-zinc-400">
        One CPU · no I/O · zero switch cost · simulation time units
      </p>

      <fieldset className="mt-6">
        <legend className="mb-3 text-xs font-medium text-zinc-300">
          Scheduling policy
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {POLICIES.map((policy) => (
            <label key={policy.id} className="cursor-pointer">
              <input
                type="radio"
                name="scheduling-policy"
                value={policy.id}
                checked={algorithm === policy.id}
                className="peer sr-only"
                onChange={() => {
                  setAlgorithm(policy.id)
                  resetPlayback()
                }}
              />
              <span className="flex min-h-11 items-center justify-center rounded-md border border-white/15 px-2 text-xs text-zinc-400 transition-colors peer-checked:border-zinc-300 peer-checked:bg-white/5 peer-checked:text-zinc-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-zinc-400">
                {policy.label}
              </span>
            </label>
          ))}
        </div>
        <p className="mt-3 min-h-12 text-xs leading-6 text-zinc-400">
          {POLICIES.find((policy) => policy.id === algorithm)?.description}
        </p>
      </fieldset>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <label className="min-w-0 flex-1 text-xs text-zinc-300">
          Example workload
          <select
            value={preset}
            onChange={(event) => loadPreset(event.target.value)}
            className={`${inputClass} mt-2 min-w-0`}
          >
            {Object.entries(PRESETS).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
            <option value="custom" disabled>
              Custom workload
            </option>
          </select>
        </label>
        {algorithm === 'round-robin' && (
          <label className="w-28 text-xs text-zinc-300">
            Time quantum
            <input
              type="number"
              min={1}
              max={SCHEDULER_LIMITS.quantum}
              step={1}
              value={quantum}
              aria-invalid={invalidNumber(quantum, 1, SCHEDULER_LIMITS.quantum)}
              aria-describedby="scheduler-input-help"
              onChange={(event) => {
                setQuantum(event.target.value)
                resetPlayback()
              }}
              className={`${inputClass} mt-2`}
            />
          </label>
        )}
      </div>

      <table className="mt-5 w-full table-fixed text-left text-xs">
        <caption className="sr-only">
          Editable process arrival times and CPU bursts
        </caption>
        <thead className="text-zinc-400">
          <tr>
            <th scope="col" className="w-14 pb-3 font-normal sm:w-20">
              Process
            </th>
            <th scope="col" className="px-2 pb-3 font-normal">
              Arrival
            </th>
            <th scope="col" className="px-2 pb-3 font-normal">
              CPU burst
            </th>
            <th scope="col" className="w-11">
              <span className="sr-only">Remove</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process) => (
            <tr key={process.id}>
              <th scope="row" className="py-1.5 font-normal">
                <span
                  className={`inline-flex rounded border px-2 py-1 font-mono text-[11px] ${processColor(process.id)}`}
                >
                  {process.id}
                </span>
              </th>
              <td className="px-2 py-1.5">
                <input
                  type="number"
                  min={0}
                  max={SCHEDULER_LIMITS.arrival}
                  step={1}
                  value={process.arrival}
                  aria-label={`${process.id} arrival time`}
                  aria-invalid={invalidNumber(
                    process.arrival,
                    0,
                    SCHEDULER_LIMITS.arrival,
                  )}
                  aria-describedby="scheduler-input-help"
                  onChange={(event) =>
                    updateProcess(process.id, 'arrival', event.target.value)
                  }
                  className={inputClass}
                />
              </td>
              <td className="px-2 py-1.5">
                <input
                  type="number"
                  min={1}
                  max={SCHEDULER_LIMITS.burst}
                  step={1}
                  value={process.burst}
                  aria-label={`${process.id} CPU burst`}
                  aria-invalid={invalidNumber(
                    process.burst,
                    1,
                    SCHEDULER_LIMITS.burst,
                  )}
                  aria-describedby="scheduler-input-help"
                  onChange={(event) =>
                    updateProcess(process.id, 'burst', event.target.value)
                  }
                  className={inputClass}
                />
              </td>
              <td>
                <button
                  type="button"
                  disabled={processes.length === 1}
                  aria-label={`Remove ${process.id}`}
                  onClick={() => {
                    setProcesses((previous) =>
                      previous.filter((entry) => entry.id !== process.id),
                    )
                    setPreset('custom')
                    resetPlayback()
                  }}
                  className="flex size-11 items-center justify-center rounded-md text-zinc-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <X aria-hidden="true" className="size-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className={buttonClass}
          disabled={processes.length >= SCHEDULER_LIMITS.processes}
          onClick={() => {
            const id = Array.from(
              { length: SCHEDULER_LIMITS.processes },
              (_, index) => `P${index + 1}`,
            ).find(
              (candidate) =>
                !processes.some((process) => process.id === candidate),
            )!
            setProcesses((previous) => [
              ...previous,
              { id, arrival: '0', burst: '3' },
            ])
            setPreset('custom')
            resetPlayback()
          }}
        >
          <Plus aria-hidden="true" className="size-3.5" />
          Add process
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            loadPreset('staggered')
            setQuantum('2')
          }}
        >
          <RotateCcw aria-hidden="true" className="size-3.5" />
          Reset workload
        </button>
      </div>
      <p
        id="scheduler-input-help"
        className="mt-3 text-[11px] leading-5 text-zinc-400"
      >
        Use whole numbers: arrival 0–30, CPU burst 1–20, quantum 1–10. Up to 8
        processes.
      </p>

      {error && (
        <p role="alert" className="mt-4 text-sm leading-6 text-red-300">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-7 space-y-5">
          <figure>
            <figcaption className="mb-3 text-xs font-medium text-zinc-300">
              CPU timeline
            </figcaption>
            <div
              role="region"
              aria-label="Scrollable CPU timeline"
              tabIndex={0}
              className="overflow-x-auto rounded-md pb-2"
            >
              <div
                className="relative pb-6"
                style={{ width: Math.max(480, totalTime * 22) }}
              >
                <div className="flex h-11" aria-hidden="true">
                  {result.segments.map((segment) => (
                    <div
                      key={segment.start}
                      title={`${segment.processId ?? 'Idle'}: ${segment.start}–${segment.end}`}
                      className={`flex shrink-0 items-center justify-center border-r border-black font-mono text-[11px] ${segment.processId ? processColor(segment.processId) : 'bg-zinc-900 text-zinc-400'}`}
                      style={{
                        width: `${((segment.end - segment.start) / totalTime) * 100}%`,
                      }}
                    >
                      {segment.processId ?? '—'}
                    </div>
                  ))}
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 h-11 border-l-2 border-zinc-100"
                  style={{
                    left: `${(currentTime / totalTime) * 100}%`,
                    transform:
                      currentTime === totalTime
                        ? 'translateX(-2px)'
                        : undefined,
                  }}
                />
                <span className="absolute bottom-0 left-0 font-mono text-[10px] text-zinc-400">
                  0
                </span>
                {result.segments.map((segment) => (
                  <span
                    key={segment.end}
                    className="absolute bottom-0 font-mono text-[10px] text-zinc-400"
                    style={{
                      left: `${(segment.end / totalTime) * 100}%`,
                      transform:
                        segment.end === totalTime
                          ? 'translateX(-100%)'
                          : 'translateX(-50%)',
                    }}
                  >
                    {segment.end}
                  </span>
                ))}
              </div>
            </div>
            <p className="sr-only">
              {result.segments
                .map(
                  (segment) =>
                    `${segment.processId ?? 'CPU idle'} from ${segment.start} to ${segment.end}`,
                )
                .join('. ')}
              .
            </p>
          </figure>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`${buttonClass} border-zinc-500 text-zinc-100`}
              onClick={() => {
                if (!isPlaying) {
                  if (currentTime >= totalTime) setCurrentTime(0)
                  trackEvent('scheduler_play', {
                    algorithm,
                    process_count: processes.length,
                    quantum: algorithm === 'round-robin' ? Number(quantum) : 0,
                  })
                }
                setIsPlaying((previous) => !previous)
              }}
            >
              {isPlaying ? (
                <Pause aria-hidden="true" className="size-3.5" />
              ) : (
                <Play aria-hidden="true" className="size-3.5" />
              )}
              {isPlaying
                ? 'Pause'
                : currentTime >= totalTime
                  ? 'Replay'
                  : 'Play'}
            </button>
            <button
              type="button"
              className={buttonClass}
              disabled={currentTime >= totalTime}
              onClick={() => {
                setIsPlaying(false)
                setCurrentTime((time) => Math.min(time + 1, totalTime))
              }}
            >
              <SkipForward aria-hidden="true" className="size-3.5" />
              Step
            </button>
            <button
              type="button"
              className={buttonClass}
              onClick={resetPlayback}
            >
              <RotateCcw aria-hidden="true" className="size-3.5" />
              Restart
            </button>
          </div>
          <label className="block text-xs text-zinc-400">
            Playback position · {currentTime} / {totalTime}
            <input
              type="range"
              min={0}
              max={totalTime}
              step={1}
              value={currentTime}
              aria-label="Playback position"
              aria-valuetext={`Time ${currentTime} of ${totalTime}`}
              onChange={(event) => {
                setIsPlaying(false)
                setCurrentTime(Number(event.target.value))
              }}
              className="mt-2 block h-8 w-full cursor-pointer accent-zinc-200"
            />
          </label>
          <p
            role="status"
            aria-live={isPlaying ? 'off' : 'polite'}
            className="min-h-10 font-mono text-[11px] leading-5 text-zinc-400"
          >
            {currentTime === totalTime
              ? 'All processes finished.'
              : `${active?.processId ? `${active.processId} running` : 'CPU idle'}${waiting?.length ? ` · Waiting: ${waiting.map((process) => process.id).join(', ')}` : ''}`}
          </p>

          <div>
            <h3 className="text-xs font-medium text-zinc-300">
              Results for the complete schedule
            </h3>
            <dl className="mt-3 grid grid-cols-3 gap-2">
              {[
                ['Avg. waiting', result.averageWaiting],
                ['Avg. turnaround', result.averageTurnaround],
                ['Avg. response', result.averageResponse],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-md border border-white/10 p-3"
                >
                  <dt className="text-[10px] leading-5 text-zinc-400 sm:text-[11px]">
                    {label}
                  </dt>
                  <dd
                    className="mt-2 font-mono text-xl text-zinc-200"
                    data-metric={label}
                  >
                    {Number(value).toFixed(1)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div
            role="region"
            aria-label="Per-process scheduling results"
            tabIndex={0}
            className="overflow-x-auto"
          >
            <table className="w-full min-w-96 text-left font-mono text-[11px] leading-6">
              <caption className="sr-only">
                Per-process results in simulation time units
              </caption>
              <thead className="text-zinc-400">
                <tr>
                  {[
                    'Process',
                    'First run',
                    'Finish',
                    'Waiting',
                    'Turnaround',
                  ].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="border-b border-white/10 py-2 pr-3 font-normal"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.processes.map((process) => (
                  <tr
                    key={process.id}
                    className="border-b border-white/5 text-zinc-300"
                  >
                    <th scope="row" className="py-2 pr-3 font-normal">
                      {process.id}
                    </th>
                    <td>{process.start}</td>
                    <td>{process.completion}</td>
                    <td>{process.waiting}</td>
                    <td>{process.turnaround}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] leading-5 text-zinc-400">
            Waiting = finish − arrival − burst. Turnaround = finish − arrival.
            Response = first run − arrival.
          </p>
        </div>
      )}
    </section>
  )
}
