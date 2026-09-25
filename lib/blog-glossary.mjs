/** @type {Record<string, {term: string, definition: string, example: string, href: string}>} */
export const blogGlossary = {
  'b-tree': {
    term: 'B-tree',
    definition:
      'A balanced search tree that keeps keys ordered and stores many keys in each node. Database indexes commonly use B-tree variants to find a starting point and scan a range efficiently.',
    example:
      'An index on created_at can seek to a timestamp, then read neighboring entries.',
    href: '/blog/difference-between-cluster-and-non-cluster-index#b-tree-architecture-how-indexes-work',
  },
  'covering-index': {
    term: 'Covering index',
    definition:
      'An index that contains all the columns a particular query needs. Whether it avoids visiting the base table also depends on the database and its visibility rules.',
    example:
      'In SQL Server, an index on Email that includes Name can cover a query selecting Name by Email.',
    href: '/blog/difference-between-cluster-and-non-cluster-index#key-lookups',
  },
  'composite-cursor': {
    term: 'Composite cursor',
    definition:
      'A pagination cursor containing multiple ordering values, including a unique tiebreaker, so the next query can resume after one unambiguous position.',
    example: 'Use both created_at and id when several posts share a timestamp.',
    href: '/blog/pagination-strategies-offset-vs-cursor#the-composite-cursor-problem',
  },
  mvcc: {
    term: 'MVCC',
    definition:
      'Multiversion concurrency control: a database keeps row versions and uses visibility rules to decide which versions a transaction can read. A pagination cursor alone does not preserve a database snapshot.',
    example:
      'Two page requests in separate transactions can observe different committed data.',
    href: '/blog/pagination-strategies-offset-vs-cursor#concurrency-and-snapshot-isolation',
  },
  boxing: {
    term: 'Boxing',
    definition:
      'Converting a value type into an object or interface reference by copying its value into a boxed object. Later changes to the original variable do not update that copy.',
    example:
      'After int n = 42; object box = n; n = 7;, the box still contains 42.',
    href: '/blog/boxing-and-unboxing-in-csharp#what-is-boxing',
  },
  middleware: {
    term: 'Middleware',
    definition:
      'A component in an HTTP request pipeline that can run work before and after the next component, or return a response without invoking it.',
    example:
      'Logging middleware can start a timer, await the next component, and then record the elapsed time.',
    href: '/blog/3-ways-to-build-custom-middleware-in-aspnet-core#understanding-middleware-basics',
  },
  'location-rule': {
    term: 'Location rule',
    definition:
      'An Nginx configuration block selected by matching a normalized request path against exact, prefix, or regular expression patterns. Query parameters do not participate in this match.',
    example:
      'location = /health also matches a request for /health?check=ready.',
    href: '/blog/nginx-deep-dive-architecture-configuration-production-patterns#how-nginx-matches-location-blocks',
  },
  'head-of-line-blocking': {
    term: 'Head-of-line blocking',
    definition:
      'Later work waits behind an earlier missing or unfinished item. In a reliable ordered stream, later data can arrive but cannot be delivered until the gap is filled.',
    example:
      'Packets 11 and 12 wait in the reorder buffer while packet 10 is retransmitted.',
    href: '/blog/aeroudp-networking-concepts#out-of-order-buffering',
  },
  'congestion-window': {
    term: 'Congestion window',
    definition:
      'A sender-controlled limit on data in flight, adjusted in response to network conditions. The receiver’s advertised window imposes a separate flow-control limit.',
    example:
      'With a congestion window of 8 packets and a receive window of 5, at most 5 packets may be in flight in the simplified model.',
    href: '/blog/aeroudp-networking-concepts#congestion-control-dont-overwhelm-the-network',
  },
  'time-quantum': {
    term: 'Time quantum',
    definition:
      'The maximum uninterrupted CPU time a runnable process gets in one turn under a scheduling policy such as Round Robin. A process can finish or block before using the entire quantum.',
    example:
      'A process needing 2 ms finishes after 2 ms even when the quantum is 4 ms.',
    href: '/blog/simukernel-operating-system-concepts#scheduling-algorithms',
  },
}
