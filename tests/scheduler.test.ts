import assert from 'node:assert/strict'
import test from 'node:test'

import { simulateSchedule, type SchedulingAlgorithm } from '../lib/scheduler'

const workload = [
  { id: 'P1', arrival: 0, burst: 8 },
  { id: 'P2', arrival: 1, burst: 4 },
  { id: 'P3', arrival: 2, burst: 2 },
  { id: 'P4', arrival: 3, burst: 1 },
]

test('FCFS produces the known waiting and turnaround times', () => {
  const result = simulateSchedule(workload, 'fcfs')
  assert.deepEqual(
    result.processes.map(({ completion }) => completion),
    [8, 12, 14, 15],
  )
  assert.deepEqual(
    result.processes.map(({ waiting }) => waiting),
    [0, 7, 10, 11],
  )
  assert.equal(result.averageWaiting, 7)
  assert.equal(result.averageTurnaround, 10.75)
  assert.equal(result.averageResponse, 7)
})

test('SJF waits for the running job and then chooses the shortest ready burst', () => {
  const result = simulateSchedule(workload, 'sjf')
  assert.deepEqual(
    result.segments.map(({ processId }) => processId),
    ['P1', 'P4', 'P3', 'P2'],
  )
  assert.deepEqual(
    result.processes.map(({ completion }) => completion),
    [8, 15, 11, 9],
  )
  assert.equal(result.averageWaiting, 5.5)
  assert.equal(result.averageTurnaround, 9.25)
})

test('Round Robin interleaves arrivals and produces distinct response times', () => {
  const result = simulateSchedule(workload, 'round-robin', 2)
  assert.deepEqual(
    result.segments.map(({ processId }) => processId),
    ['P1', 'P2', 'P3', 'P1', 'P4', 'P2', 'P1', 'P1'],
  )
  assert.deepEqual(
    result.processes.map(({ completion }) => completion),
    [15, 11, 6, 9],
  )
  assert.equal(result.averageWaiting, 5)
  assert.equal(result.averageTurnaround, 8.75)
  assert.equal(result.averageResponse, 2)
})

test('Round Robin queues an arrival at the slice boundary before the preempted job', () => {
  const result = simulateSchedule(
    [
      { id: 'P1', arrival: 0, burst: 4 },
      { id: 'P2', arrival: 2, burst: 1 },
    ],
    'round-robin',
    2,
  )
  assert.deepEqual(result.segments, [
    { processId: 'P1', start: 0, end: 2 },
    { processId: 'P2', start: 2, end: 3 },
    { processId: 'P1', start: 3, end: 5 },
  ])
})

test('all policies explicitly represent initial idle time and gaps between jobs', () => {
  for (const algorithm of ['fcfs', 'sjf', 'round-robin'] as const) {
    const result = simulateSchedule(
      [
        { id: 'P1', arrival: 2, burst: 2 },
        { id: 'P2', arrival: 8, burst: 1 },
      ],
      algorithm,
    )
    assert.deepEqual(result.segments, [
      { processId: null, start: 0, end: 2 },
      { processId: 'P1', start: 2, end: 4 },
      { processId: null, start: 4, end: 8 },
      { processId: 'P2', start: 8, end: 9 },
    ])
    assert.equal(result.averageWaiting, 0)
  }
})

test('ties preserve input order while earlier arrivals still run first', () => {
  const result = simulateSchedule(
    [
      { id: 'later', arrival: 5, burst: 1 },
      { id: 'first', arrival: 0, burst: 1 },
      { id: 'second', arrival: 0, burst: 1 },
    ],
    'sjf',
  )
  assert.deepEqual(
    result.segments
      .filter(({ processId }) => processId)
      .map(({ processId }) => processId),
    ['first', 'second', 'later'],
  )
  assert.deepEqual(
    result.processes.map(({ id }) => id),
    ['later', 'first', 'second'],
  )
})

test('a partial final quantum consumes only the remaining CPU burst', () => {
  const result = simulateSchedule(
    [{ id: 'P1', arrival: 0, burst: 5 }],
    'round-robin',
    2,
  )
  assert.deepEqual(
    result.segments.map(({ start, end }) => end - start),
    [2, 2, 1],
  )
  assert.equal(result.totalTime, 5)
  assert.equal(result.averageWaiting, 0)
})

test('a sufficiently large Round Robin quantum behaves like FCFS', () => {
  assert.deepEqual(
    simulateSchedule(workload, 'round-robin', 10),
    simulateSchedule(workload, 'fcfs'),
  )
})

test('empty, duplicate, fractional, negative, and unbounded workloads are rejected', () => {
  assert.throws(() => simulateSchedule([], 'fcfs'), RangeError)
  assert.throws(
    () => simulateSchedule([workload[0], workload[0]], 'fcfs'),
    RangeError,
  )
  for (const [field, value] of [
    ['arrival', -1],
    ['arrival', 31],
    ['arrival', NaN],
    ['burst', 0],
    ['burst', 1.5],
    ['burst', Infinity],
    ['burst', 21],
  ] as const) {
    assert.throws(
      () => simulateSchedule([{ ...workload[0], [field]: value }], 'sjf'),
      RangeError,
    )
  }
  assert.throws(
    () =>
      simulateSchedule(
        Array.from({ length: 9 }, (_, index) => ({
          id: `P${index}`,
          arrival: 0,
          burst: 1,
        })),
        'fcfs',
      ),
    RangeError,
  )
  assert.throws(
    () => simulateSchedule([{ ...workload[0], id: ' ' }], 'fcfs'),
    RangeError,
  )
  assert.throws(
    () => simulateSchedule(workload, 'unsupported' as SchedulingAlgorithm),
    RangeError,
  )
  for (const quantum of [0, -1, 1.5, 11, NaN]) {
    assert.throws(
      () => simulateSchedule(workload, 'round-robin', quantum),
      RangeError,
    )
  }
})

test('generated workloads preserve CPU time, arrival constraints, and input data', () => {
  let seed = 12345
  const random = (max: number) => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed % max
  }
  for (let sample = 0; sample < 80; sample++) {
    const processes = Array.from({ length: random(8) + 1 }, (_, index) => ({
      id: `P${index + 1}`,
      arrival: random(31),
      burst: random(20) + 1,
    }))
    const original = structuredClone(processes)
    for (const algorithm of ['fcfs', 'sjf', 'round-robin'] as const) {
      const quantum = random(10) + 1
      const result = simulateSchedule(processes, algorithm, quantum)
      let end = 0
      for (const segment of result.segments) {
        assert.equal(segment.start, end)
        assert.ok(segment.end > segment.start)
        end = segment.end
      }
      assert.equal(end, result.totalTime)
      for (const process of result.processes) {
        const turns = result.segments.filter(
          ({ processId }) => processId === process.id,
        )
        assert.equal(
          turns.reduce(
            (sum, { start, end: finish }) => sum + finish - start,
            0,
          ),
          process.burst,
        )
        assert.ok(turns.every(({ start }) => start >= process.arrival))
        assert.equal(turns[0].start, process.start)
        assert.equal(turns.at(-1)!.end, process.completion)
        assert.equal(process.turnaround, process.waiting + process.burst)
        assert.ok(process.waiting >= process.response && process.response >= 0)
        if (algorithm === 'round-robin')
          assert.ok(
            turns.every(({ start, end: finish }) => finish - start <= quantum),
          )
        else assert.equal(turns.length, 1)
      }
    }
    assert.deepEqual(processes, original)
  }
})
