export type SchedulingAlgorithm = 'fcfs' | 'sjf' | 'round-robin'

export type ProcessInput = {
  id: string
  arrival: number
  burst: number
}

export type ScheduleSegment = {
  processId: string | null
  start: number
  end: number
}

export type ProcessResult = ProcessInput & {
  start: number
  completion: number
  waiting: number
  turnaround: number
  response: number
}

export const SCHEDULER_LIMITS = {
  processes: 8,
  arrival: 30,
  burst: 20,
  quantum: 10,
}

export function simulateSchedule(
  processes: readonly ProcessInput[],
  algorithm: SchedulingAlgorithm,
  quantum = 2,
) {
  if (!['fcfs', 'sjf', 'round-robin'].includes(algorithm)) {
    throw new RangeError('Choose a supported scheduling algorithm.')
  }
  if (processes.length < 1 || processes.length > SCHEDULER_LIMITS.processes) {
    throw new RangeError('Use between 1 and 8 processes.')
  }
  if (new Set(processes.map(({ id }) => id)).size !== processes.length) {
    throw new RangeError('Process names must be unique.')
  }
  for (const process of processes) {
    if (
      !process.id.trim() ||
      !Number.isInteger(process.arrival) ||
      process.arrival < 0 ||
      process.arrival > SCHEDULER_LIMITS.arrival ||
      !Number.isInteger(process.burst) ||
      process.burst < 1 ||
      process.burst > SCHEDULER_LIMITS.burst
    ) {
      throw new RangeError(
        'Use whole numbers: arrival 0–30 and CPU burst 1–20.',
      )
    }
  }
  if (
    algorithm === 'round-robin' &&
    (!Number.isInteger(quantum) ||
      quantum < 1 ||
      quantum > SCHEDULER_LIMITS.quantum)
  ) {
    throw new RangeError('Use a whole-number time quantum between 1 and 10.')
  }

  const pending = processes
    .map((process, order) => ({
      ...process,
      order,
      remaining: process.burst,
      start: -1,
      completion: 0,
    }))
    .sort((a, b) => a.arrival - b.arrival || a.order - b.order)
  const ready: typeof pending = []
  const segments: ScheduleSegment[] = []
  let time = 0
  let next = 0

  const enqueueArrivals = () => {
    while (next < pending.length && pending[next].arrival <= time) {
      ready.push(pending[next++])
    }
  }

  while (next < pending.length || ready.length > 0) {
    enqueueArrivals()

    if (ready.length === 0) {
      const arrival = pending[next].arrival
      segments.push({ processId: null, start: time, end: arrival })
      time = arrival
      enqueueArrivals()
    }

    // SJF is non-preemptive and only considers processes that have arrived.
    if (algorithm === 'sjf') {
      ready.sort(
        (a, b) =>
          a.burst - b.burst || a.arrival - b.arrival || a.order - b.order,
      )
    }

    const process = ready.shift()!
    if (process.start === -1) process.start = time
    const duration =
      algorithm === 'round-robin'
        ? Math.min(quantum, process.remaining)
        : process.remaining

    segments.push({ processId: process.id, start: time, end: time + duration })
    time += duration
    process.remaining -= duration

    // Arrivals at the quantum boundary enter before the running job is requeued.
    enqueueArrivals()
    if (process.remaining > 0) ready.push(process)
    else process.completion = time
  }

  const results: ProcessResult[] = pending
    .sort((a, b) => a.order - b.order)
    .map(({ id, arrival, burst, start, completion }) => ({
      id,
      arrival,
      burst,
      start,
      completion,
      waiting: completion - arrival - burst,
      turnaround: completion - arrival,
      response: start - arrival,
    }))
  const average = (field: 'waiting' | 'turnaround' | 'response') =>
    results.reduce((sum, process) => sum + process[field], 0) / results.length

  return {
    segments,
    processes: results,
    totalTime: time,
    averageWaiting: average('waiting'),
    averageTurnaround: average('turnaround'),
    averageResponse: average('response'),
  }
}
