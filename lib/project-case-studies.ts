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
      'A C# key-value storage engine built around a write-ahead log, sorted memory buffers, and immutable disk tables.',
    technologies: ['C#', '.NET 8', 'LSM-tree', 'Storage'],
    source: 'https://github.com/Mo7ammedd/LSMSharp',
    problem:
      'I built LSMSharp around a write path that collects changes in memory and appends them to a recovery log. Sorted files hold older data on disk, and background compaction merges them as more writes come in.',
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
          'I batch WAL writes using a 100-entry threshold and a 100 ms timer to reduce per-write I/O. That means SetAsync can finish before the data is persisted. Flush coordinates WAL synchronization and table creation, so callers need to account for that gap when they need durable writes.',
      },
      {
        title: 'Separate ingestion from reorganization',
        description:
          'During a flush, I make the old memtable read-only and send new writes to a fresh one. Reads still check both. Compaction runs in the background to merge disk tables, though it adds its own read and write load.',
      },
      {
        title: 'Spend memory to avoid disk work',
        description:
          'I use Bloom filters to skip tables that cannot contain a key, and cache blocks and SSTable handles to avoid repeated disk work. A positive Bloom-filter result still needs a lookup because false positives are possible.',
      },
    ],
    validation: [
      'The functional suite covers CRUD, repeated updates, deletes, binary values, and concurrent access. There are also performance and reopen workloads. A saved test run contains an integrity failure after compaction; that needs fixing and a fresh correctness run before the performance numbers are useful.',
      'The README sample submits 5,000 sequential writes in 207 ms, about 24,155 operations per second. It excludes the final flush and has no recorded hardware details, so it measures submission throughput rather than durable commits.',
      'A benchmark rerun needs the runtime, hardware, value sizes, cache state, and flush policy recorded, plus checks that the values read back correctly. Multi-operation transactions and snapshot isolation are not implemented.',
    ],
    references: [
      {
        title: 'Functional checks',
        href: 'https://github.com/Mo7ammedd/LSMSharp/blob/a8686cf696add5988008d9a88d65a41a514df77b/Tests/FunctionalTests.cs',
      },
      {
        title: 'Published benchmark',
        href: 'https://github.com/Mo7ammedd/LSMSharp/blob/a8686cf696add5988008d9a88d65a41a514df77b/README.md#L263-L275',
      },
      {
        title: 'WAL implementation',
        href: 'https://github.com/Mo7ammedd/LSMSharp/blob/a8686cf696add5988008d9a88d65a41a514df77b/WAL/WriteAheadLog.cs#L22-L100',
      },
      {
        title: 'Recorded test run',
        href: 'https://github.com/Mo7ammedd/LSMSharp/blob/a8686cf696add5988008d9a88d65a41a514df77b/Tests/full_test_results.txt#L95-L125',
      },
    ],
    experiment: {
      title: 'Reproduce the workload',
      description:
        'From a checkout of the repository, run the functional suite before comparing performance. The read/write samples use 5,000 operations and fixed random-key seeds; the sequential-write sample uses 256-byte values.',
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
      'Receive-buffer tests cover out-of-order packets and duplicate detection. Codec property tests check payload round-trips and rejection of corrupted data.',
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
