export type ProjectCaseStudy = {
  slug: string
  title: string
  subtitle: string
  description: string
  technologies: string[]
  source: string
  problem: string
  architecture: { title: string; description: string }[]
  architectureNote: string
  decisions: { title: string; description: string }[]
  validation: string[]
  experiment?: { title: string; description: string; command: string }
}

export const PROJECT_CASE_STUDIES: ProjectCaseStudy[] = [
  {
    slug: 'lsmsharp',
    title: 'LSMSharp',
    subtitle: 'Inside an embedded storage engine',
    description:
      'A C# key-value storage engine built around a write-ahead log, sorted memory buffers, and immutable disk tables.',
    technologies: ['C#', '.NET 8', 'LSM-tree', 'Storage'],
    source: 'https://github.com/Mo7ammedd/LSMSharp',
    problem:
      'A storage engine has to accept new writes while keeping old data readable and recoverable. LSMSharp makes those competing jobs explicit: collect writes in memory, preserve a recovery log, then reorganize sorted files in the background.',
    architecture: [
      {
        title: 'Write-ahead log',
        description: 'Queue an append-only record for recovery.',
      },
      {
        title: 'Memtable',
        description: 'Keep recent keys sorted in a concurrent skip list.',
      },
      {
        title: 'SSTables',
        description: 'Flush an immutable table into level zero.',
      },
      {
        title: 'Compaction',
        description: 'Merge tables and reconcile versions across levels.',
      },
    ],
    architectureNote:
      'Reads check the active and flushing memtables first, then search disk tables. Bloom filters reject definite misses before a block is read and decompressed.',
    decisions: [
      {
        title: 'Batch persistence work',
        description:
          'The WAL groups writes around a 100-entry threshold and a 100 ms timer. This reduces per-write I/O, but a completed SetAsync call can precede persistence. Flush coordinates WAL synchronization and table creation; batching is a throughput–durability tradeoff.',
      },
      {
        title: 'Separate ingestion from reorganization',
        description:
          'A memtable becomes read-only during a flush while a new one accepts writes. Readers can still inspect the flushing table. Background compaction keeps the disk layout manageable, at the cost of additional reads and writes.',
      },
      {
        title: 'Spend memory to avoid disk work',
        description:
          'Bloom filters, block caching, and cached SSTable handles reduce unnecessary I/O. A Bloom-filter match still needs a real lookup: the filter can return false positives, so it is an optimization rather than the source of truth.',
      },
    ],
    validation: [
      'The repository includes functional checks for CRUD operations, repeated updates, deletes, binary values, and concurrent access, alongside performance and recovery workloads.',
      'The published sequential-write example reports 5,000 operations in 207 ms, or about 24,155 operations per second. It is a repository-reported sample: the timer covers write submission and excludes the final flush. Hardware details were not recorded, so this is not a durable-commit benchmark or a cross-machine comparison.',
      'For a meaningful rerun, record the runtime, hardware, value sizes, cache state, and flush policy; verify retrieved values as well as throughput. Multi-operation transactions and snapshot isolation remain separate design work.',
    ],
    experiment: {
      title: 'Reproduce the workload',
      description:
        'From a checkout of the repository, run the functional suite before comparing performance. The performance runner uses a fixed random seed and 5,000-operation workloads.',
      command:
        'cd Tests\ndotnet run -c Release -- functional\ndotnet run -c Release -- performance',
    },
  },
  {
    slug: 'aeroudp',
    title: 'AeroUDP',
    subtitle: 'Reliable delivery over an unreliable network',
    description:
      'An experimental transport protocol in async Rust that adds ordering, retransmission, flow control, and congestion control to UDP.',
    technologies: ['Rust', 'Tokio', 'UDP', 'Networking'],
    source: 'https://github.com/Mo7ammedd/AeroUDP',
    problem:
      'UDP delivers independent datagrams without promising that they arrive, arrive once, or arrive in order. AeroUDP explores the machinery needed to expose reliable, ordered delivery while adapting to a slow receiver and a congested network.',
    architecture: [
      {
        title: 'Application data',
        description: 'Add sequence information and a checksum.',
      },
      {
        title: 'Send window',
        description: 'Respect receiver capacity and congestion limits.',
      },
      {
        title: 'UDP transport',
        description: 'Send packets and retain unacknowledged data.',
      },
      {
        title: 'Receive & ACK',
        description: 'Reorder packets and feed acknowledgements back.',
      },
    ],
    architectureNote:
      'Each datagram has a 28-byte header and a payload limit of 1,200 bytes. Acknowledgements drive retransmission, round-trip-time estimates, and the next send-window decision.',
    decisions: [
      {
        title: 'Use two independent limits',
        description:
          'The sender uses the smaller of the congestion window and the advertised receive window. One protects the network; the other protects the receiving application. Treating them separately makes backpressure easier to reason about.',
      },
      {
        title: 'Keep the feedback loop observable',
        description:
          'NewReno-style congestion control combines slow start, additive growth, and loss recovery. RTT-based retransmission timers adapt to latency, while packet counters and tracing expose the state changes that explain a stalled or recovering connection.',
      },
      {
        title: 'Keep the protocol small enough to inspect',
        description:
          'Cumulative ACKs simplify bookkeeping but cannot identify every packet received beyond a gap. Selective acknowledgements are omitted. CRC32 detects accidental corruption; it does not provide authentication or encryption.',
      },
    ],
    validation: [
      'The project includes a network-simulation proxy for deliberate packet loss, reordering, latency, and jitter. These controls make failure scenarios repeatable instead of relying on occasional real-network failures.',
      'The documented example injects 5% loss and 3% reordering, with 20–60 ms latency and 10 ms jitter. Those are test inputs, not a measured throughput or reliability claim.',
      'Useful observations include delivered-data correctness, duplicate delivery, retransmissions, smoothed RTT, timeout backoff, and congestion-window recovery. The detailed walkthrough connects each metric to the mechanism it explains.',
    ],
    experiment: {
      title: 'Make the network misbehave',
      description:
        'With the analyzer installed from the repository, point the client at port 9500 and run the server on port 9000. The proxy applies the configured failure workload between them.',
      command:
        'aeroudp-analyzer proxy \\\n  --listen 127.0.0.1:9500 \\\n  --upstream 127.0.0.1:9000 \\\n  --loss 0.05 --reorder 0.03 \\\n  --min-latency-ms 20 --max-latency-ms 60 \\\n  --jitter-ms 10',
    },
  },
  {
    slug: 'simukernel',
    title: 'SimuKernel',
    subtitle: 'Make operating-system decisions visible',
    description:
      'An operating-system simulator for exploring CPU scheduling, memory management, and process control, with a browser scheduling playground.',
    technologies: ['Operating systems', 'Scheduling', 'Simulation'],
    source: 'https://github.com/Mo7ammedd/SimuKernel',
    problem:
      'A scheduling policy can be simple to describe and still produce surprising waiting times. SimuKernel explores how operating-system policies affect individual processes. The companion playground below makes the scheduling tradeoffs visible on a small, editable workload.',
    architecture: [
      {
        title: 'Arrivals',
        description: 'Processes become ready at their arrival time.',
      },
      {
        title: 'Ready queue',
        description: 'The selected policy chooses the next process.',
      },
      {
        title: 'CPU',
        description: 'Run to completion or to the end of a time slice.',
      },
      {
        title: 'Feedback',
        description: 'Complete the process or return it to the queue.',
      },
    ],
    architectureNote:
      'The browser model uses one CPU, known CPU-burst lengths, no I/O, and zero context-switch cost. Times are simulation units rather than measurements of your device.',
    decisions: [
      {
        title: 'First come, first served',
        description:
          'Run processes in arrival order without interruption. The rule is predictable, but a long process at the front delays every short process behind it.',
      },
      {
        title: 'Shortest job first',
        description:
          'Choose the shortest burst among processes that have arrived, then run it to completion. This often reduces average waiting in a fixed workload, but requires knowing burst lengths and can delay longer jobs.',
      },
      {
        title: 'Round Robin',
        description:
          'Give each ready process a bounded turn. A smaller quantum usually improves first response by sharing the CPU sooner; a real scheduler also pays context-switch overhead, which this model leaves out.',
      },
    ],
    validation: [
      'The playground computes waiting time as completion minus arrival minus burst, turnaround as completion minus arrival, and response as first start minus arrival. It shows both the timeline and per-process results.',
      'The scheduling engine is checked against known examples, idle periods, simultaneous arrivals, arrivals on a quantum boundary, and invalid workloads. No process can run before it arrives, and every process must receive its requested CPU time.',
    ],
  },
]

export function getProjectCaseStudy(slug: string) {
  return PROJECT_CASE_STUDIES.find((project) => project.slug === slug)
}
