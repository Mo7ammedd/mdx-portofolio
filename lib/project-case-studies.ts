import { ADDITIONAL_PROJECT_CASE_STUDIES } from './additional-project-case-studies'

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
  references: { title: string; href: string }[]
  experiment?: { title: string; description: string; command: string }
}

export const PROJECT_CASE_STUDIES: ProjectCaseStudy[] = [
  {
    slug: 'lsmsharp',
    title: 'LSMSharp',
    subtitle: 'Inside an embedded storage engine',
    description:
      'An experimental C# key-value engine with write-ahead logging, skip-list memtables, immutable SSTables, and leveled compaction.',
    technologies: ['C#', '.NET 8', 'LSM-tree', 'Storage'],
    source: 'https://github.com/Mo7ammedd/LSMSharp',
    problem:
      'I built LSMSharp to work through storage-engine internals: recording writes, keeping recent keys sorted, writing immutable tables, and merging versions across levels. The implementation also explores concurrent reads, block caching, and replaying a recovery log.',
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
      'Reads check the active and flushing memtables first, then search disk tables. Bloom filters reject definite misses; prefix-encoded keys, GZip blocks, and an LRU block cache reduce storage and repeated reads.',
    decisions: [
      {
        title: 'Batch persistence work',
        description:
          'I batch WAL writes using a 100-entry threshold and a 100 ms timer to reduce per-write I/O. That means SetAsync can finish before the data is persisted. Flush coordinates WAL synchronization and table creation, so callers need to account for that gap when they need durable writes.',
      },
      {
        title: 'Coordinate concurrent reads and writes',
        description:
          'Concurrent SSTable reads use explicit file offsets and fill each block before decoding it. This fixes a shared-cursor race that produced incorrect compressed data. Skip-list search and mutation share a write lock so another writer cannot invalidate insertion positions; readers still share read locks.',
      },
      {
        title: 'Spend memory to avoid disk work',
        description:
          'I use Bloom filters to skip tables that cannot contain a key, and cache blocks and SSTable handles to avoid repeated disk work. A positive Bloom-filter result still needs a lookup because false positives are possible.',
      },
    ],
    validation: [
      'The 11 November 2026 checks verified all 200 records after compaction and passed all eight functional edge cases. Four strict regression scenarios cover uncached concurrent block reads, invalid block handles, compaction and clean reopen, and concurrent skip-list writes.',
      'The read regression exercises 4,096 lookups across 32 readers while enumerating the same table. The skip-list check preserves 4,096 unique sorted keys across concurrent inserts and phased updates. Five additional storage runs passed. The published fix is linked below.',
      'These are bounded correctness checks, not throughput benchmarks. Small writes can return before WAL fsync; crash-safe manifest publication, cache eviction during active reads, and arbitrary concurrent flush/compaction still need work. Multi-operation transactions and snapshot isolation are not implemented.',
    ],
    references: [
      {
        title: 'Concurrency and storage regressions',
        href: 'https://github.com/Mo7ammedd/LSMSharp/blob/e70fe08fcd3cbbd16f7a83d7640a987f7c8d309f/Tests/StorageRegressionTests.cs',
      },
      {
        title: 'Functional integrity checks',
        href: 'https://github.com/Mo7ammedd/LSMSharp/blob/e70fe08fcd3cbbd16f7a83d7640a987f7c8d309f/Tests/FunctionalTests.cs',
      },
      {
        title: 'Explicit-offset SSTable reads',
        href: 'https://github.com/Mo7ammedd/LSMSharp/blob/e70fe08fcd3cbbd16f7a83d7640a987f7c8d309f/SSTable/SSTable.cs',
      },
      {
        title: 'Skip-list synchronization',
        href: 'https://github.com/Mo7ammedd/LSMSharp/blob/e70fe08fcd3cbbd16f7a83d7640a987f7c8d309f/SkipList/ConcurrentSkipList.cs',
      },
      {
        title: 'WAL batching and replay',
        href: 'https://github.com/Mo7ammedd/LSMSharp/blob/e70fe08fcd3cbbd16f7a83d7640a987f7c8d309f/WAL/WriteAheadLog.cs',
      },
    ],
    experiment: {
      title: 'Run the correctness checks',
      description:
        'From a repository checkout with .NET 8 installed, build the engine and run the functional suite. The suite includes the storage regressions. Use the storage argument for just the focused concurrency, compaction, and reopen checks.',
      command:
        'dotnet build LSMTree.csproj\ndotnet run --project Tests/Tests.csproj -- functional\ndotnet run --project Tests/Tests.csproj -- storage',
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
      'In AeroUDP, I built ordering, retransmission, and flow control on top of UDP. The sender tracks unacknowledged packets and adjusts its sending rate to both the receiver’s buffer space and network congestion. It is an experimental implementation.',
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
          'I limit sending by both the congestion window and the peer’s advertised receive window. One tracks network capacity; the other tracks receiver capacity. The engine currently clamps a zero receive window to one packet, so it cannot fully pause sending when the receiver is full.',
      },
      {
        title: 'Keep the feedback loop observable',
        description:
          'I use NewReno-style slow start, additive growth, and loss recovery, with retransmission timers based on measured RTT. Packet counters and tracing make it possible to follow window changes and timeouts when a connection stalls.',
      },
      {
        title: 'Keep the protocol small enough to inspect',
        description:
          'I use cumulative ACKs and leave out selective acknowledgements. This keeps the ACK state small, but the sender cannot identify every packet received beyond a gap. CRC32 catches accidental corruption; the protocol has no authentication or encryption.',
      },
    ],
    validation: [
      'The 11 November 2026 workspace run passed 26 Rust tests: 17 unit, three handshake, four reliability, and two stress cases. They cover codec properties, duplicate/reordered receive buffers, handshakes, and loopback transfers; this is not a WAN performance result.',
      'The CLI proxy can inject loss, duplication, latency, and jitter using seeded random choices. The seed controls those choices, but execution still affects end-to-end timing.',
      'The example configures 5% loss, 3% reordering, 20–60 ms latency, and 10 ms jitter. Those are fault settings, not measured outcomes. The proxy forwards serially, so the reordering flag alone does not demonstrate out-of-order delivery.',
      'When trying the proxy, check that the received bytes match the sent bytes, then follow retransmissions, smoothed RTT, timeout backoff, and congestion-window recovery. The walkthrough explains how these measurements relate to the protocol.',
    ],
    references: [
      {
        title: 'Protocol specification',
        href: 'https://github.com/Mo7ammedd/AeroUDP/blob/fd747a4c3ed5d26065b87af517b38875aaff6fd9/docs/PROTOCOL.md',
      },
      {
        title: 'Network proxy',
        href: 'https://github.com/Mo7ammedd/AeroUDP/blob/fd747a4c3ed5d26065b87af517b38875aaff6fd9/crates/aeroudp-cli/src/analyzer.rs',
      },
      {
        title: 'Receive-buffer tests',
        href: 'https://github.com/Mo7ammedd/AeroUDP/blob/fd747a4c3ed5d26065b87af517b38875aaff6fd9/crates/aeroudp/src/transport/receive.rs#L125-L144',
      },
      {
        title: 'Codec tests',
        href: 'https://github.com/Mo7ammedd/AeroUDP/blob/fd747a4c3ed5d26065b87af517b38875aaff6fd9/crates/aeroudp/tests/reliability.rs',
      },
    ],
    experiment: {
      title: 'Make the network misbehave',
      description:
        'From a repository checkout with Rust installed, run the proxy below. Run the server on port 9000 and point the client at port 9500 to send traffic through it.',
      command:
        'cargo run --release -p aeroudp-cli --bin aeroudp-analyzer -- proxy \\\n  --listen 127.0.0.1:9500 \\\n  --upstream 127.0.0.1:9000 \\\n  --loss 0.05 --reorder 0.03 \\\n  --min-latency-ms 20 --max-latency-ms 60 \\\n  --jitter-ms 10',
    },
  },
  {
    slug: 'simukernel',
    title: 'SimuKernel',
    subtitle: 'Make operating-system decisions visible',
    description:
      'A C#/.NET 8 console simulator for CPU scheduling, page replacement, and process management, with a companion browser scheduling playground.',
    technologies: ['C#', '.NET 8', 'Operating systems', 'Scheduling'],
    source: 'https://github.com/Mo7ammedd/SimuKernel',
    problem:
      'I built SimuKernel to simulate scheduling and page replacement in C#. The console app includes Round Robin, priority scheduling, multilevel feedback queues with aging, and FIFO, LRU, and optimal page replacement. I also added the browser playground below, where you can edit a workload and compare FCFS, non-preemptive SJF, and Round Robin.',
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
      'The playground shows a timeline and per-process results. Waiting time is completion minus arrival minus burst; turnaround is completion minus arrival; response is first start minus arrival.',
      'The browser tests cover known examples, idle periods, simultaneous arrivals, arrivals on a quantum boundary, and invalid input. They also generate 80 workloads for each policy and check that every process gets its requested CPU time without running before arrival. These tests cover the browser engine. The linked C# version has no automated test suite.',
    ],
    references: [
      {
        title: 'Browser scheduler tests',
        href: 'https://github.com/Mo7ammedd/mdx-portofolio/blob/7877aa6571356fc9986785a48cbbd702d5417e6d/tests/scheduler.test.ts',
      },
      {
        title: 'Repository guide',
        href: 'https://github.com/Mo7ammedd/SimuKernel/blob/1e0df8b5e0a2e92a72f0935e304f64cdf6ae558b/README.md',
      },
      {
        title: 'Scheduling & paging menus',
        href: 'https://github.com/Mo7ammedd/SimuKernel/blob/1e0df8b5e0a2e92a72f0935e304f64cdf6ae558b/CLI/MenuSystem.cs',
      },
      {
        title: 'Process management',
        href: 'https://github.com/Mo7ammedd/SimuKernel/blob/1e0df8b5e0a2e92a72f0935e304f64cdf6ae558b/KernelSim/MiniKernel.cs',
      },
    ],
    experiment: {
      title: 'Run the console simulator',
      description:
        'With the .NET 8 SDK installed, run this command from a repository checkout to open the scheduling and page-replacement menu.',
      command: 'dotnet run --project SimuKernel.csproj',
    },
  },
  ...ADDITIONAL_PROJECT_CASE_STUDIES,
]

export function getProjectCaseStudy(slug: string) {
  return PROJECT_CASE_STUDIES.find((project) => project.slug === slug)
}
