/**
 * @typedef {{title: string, question: string, code?: string, options: {id: string, text: string, explanation: string}[], answer: string, explanation: string, review: string}} BlogExercise
 * @type {Record<string, BlogExercise>}
 */
export const blogExercises = {
  'pagination-delete': {
    title: 'Predict the next page',
    question:
      'IDs are ordered ascending: 1, 2, 3, 4, 5, 6. Page one returns 1, 2, 3. ID 2 is then deleted. With a page size of 3, what does the next OFFSET page return?',
    code: 'SELECT id FROM posts ORDER BY id ASC LIMIT 3 OFFSET 3;',
    options: [
      {
        id: 'same',
        text: '4, 5, 6',
        explanation:
          'That is the expected continuation, but OFFSET counts the current rows rather than remembering the last ID.',
      },
      {
        id: 'skip',
        text: '5, 6',
        explanation:
          'The remaining rows are 1, 3, 4, 5, 6. Skipping three rows discards 4, even though the reader has not seen it.',
      },
      {
        id: 'repeat',
        text: '3, 4, 5',
        explanation:
          'A deletion before the boundary shifts rows left; this case skips an unseen row instead of repeating ID 3.',
      },
    ],
    answer: 'skip',
    explanation:
      'A cursor query using WHERE id > 3 ORDER BY id ASC LIMIT 3 returns 4, 5, 6 for this example. The ID order is unique and unchanged.',
    review: '#the-data-consistency-problem',
  },
  'nginx-regex-order': {
    title: 'Which location wins?',
    question:
      'These are flat locations in the same server. Which one handles /api/users.css?',
    code: 'location /api/ { ... }\nlocation ~* \\.(css|js)$ { ... }\nlocation / { ... }',
    options: [
      {
        id: 'prefix',
        text: 'The /api/ prefix',
        explanation:
          'It is the longest prefix, but it has no ^~ modifier. Nginx still checks the regex locations.',
      },
      {
        id: 'regex',
        text: 'The CSS/JS regex',
        explanation:
          'The regex matches .css and overrides the remembered ordinary prefix.',
      },
      {
        id: 'root',
        text: 'The / fallback',
        explanation:
          'The /api/ prefix is longer than /, and a regex matches as well.',
      },
    ],
    answer: 'regex',
    explanation:
      'Changing /api/ to ^~ /api/ skips regex matching when it is the longest matching prefix. Regex rules using ~ and ~* otherwise share declaration order.',
    review: '#matching-algorithm',
  },
  'boxing-copy': {
    title: 'What does the box contain?',
    question: 'Predict the value printed by this C# code.',
    code: 'int number = 42;\nobject boxed = number;\nnumber = 7;\nConsole.WriteLine((int)boxed);',
    options: [
      {
        id: 'original',
        text: '42',
        explanation: 'Boxing copied the original value into a separate object.',
      },
      {
        id: 'changed',
        text: '7',
        explanation:
          'The boxed object does not hold a live reference to the number variable.',
      },
      {
        id: 'throws',
        text: 'It throws InvalidCastException',
        explanation:
          'The box contains an int, and the code unboxes it as an int, so the types match.',
      },
    ],
    answer: 'original',
    explanation:
      'Changing number only changes that variable. Unboxing the original boxed int still produces 42.',
    review: '#what-is-boxing',
  },
  'middleware-order': {
    title: 'Trace the response path',
    question:
      'Middleware A is registered before B. Both log before and after awaiting next. The endpoint logs E and completes normally. What is the log order?',
    options: [
      {
        id: 'unwind',
        text: 'A before → B before → E → B after → A after',
        explanation:
          'Requests enter in registration order; completion returns through the awaiting middleware in reverse order.',
      },
      {
        id: 'forward',
        text: 'A before → B before → E → A after → B after',
        explanation:
          'A is still awaiting B. Its after-next work cannot run until B finishes.',
      },
      {
        id: 'serial',
        text: 'A before → A after → B before → B after → E',
        explanation:
          'Calling next enters the rest of the pipeline before the caller resumes.',
      },
    ],
    answer: 'unwind',
    explanation:
      'This assumes both components invoke and await next, with no exceptions or early responses. A component that does not call next ends that branch of the pipeline.',
    review: '#conceptual-pipeline-flow',
  },
  'index-coverage': {
    title: 'Can the index answer the query?',
    question:
      'In SQL Server, a table has a clustered primary key on Id and a nonclustered index on Email. A query filters by Email and selects Name, which is absent from that index. What can an index-seek plan need next?',
    options: [
      {
        id: 'lookup',
        text: 'A key lookup to fetch Name',
        explanation:
          'The index can locate matching rows, but it must retrieve the missing Name value from the clustered index.',
      },
      {
        id: 'covered',
        text: 'Nothing; every index contains all columns',
        explanation:
          'A nonclustered index does not automatically contain every column in the table.',
      },
      {
        id: 'invalid',
        text: 'The query is invalid',
        explanation:
          'An index affects the access plan, not whether selecting a table column is valid.',
      },
    ],
    answer: 'lookup',
    explanation:
      'Including Name in the nonclustered index can cover this query. The optimizer still chooses a plan based on cost; a seek is not guaranteed.',
    review: '#key-lookups',
  },
  'udp-ordering': {
    title: 'Deliver now or wait?',
    question:
      'A reliable ordered stream expects packet 10, but packets 11 and 12 arrive first. What should the receiver do with 11 and 12?',
    options: [
      {
        id: 'deliver',
        text: 'Deliver them immediately to the application',
        explanation:
          'That would break the promised in-order delivery for this stream.',
      },
      {
        id: 'buffer',
        text: 'Buffer them until packet 10 arrives',
        explanation:
          'The receiver can keep the later packets, then deliver the contiguous sequence once the gap is filled.',
      },
      {
        id: 'discard',
        text: 'Always discard them permanently',
        explanation:
          'A reorder buffer preserves useful arrivals and avoids unnecessary retransmissions of those packets.',
      },
    ],
    answer: 'buffer',
    explanation:
      'This wait is head-of-line blocking within the ordered stream. Sending over UDP does not remove it when the transport layer adds ordered delivery.',
    review: '#out-of-order-buffering',
  },
  'round-robin': {
    title: 'Follow one Round Robin cycle',
    question:
      'P1 needs 5 ms and P2 needs 2 ms. Both arrive at time 0, P1 is first, the quantum is 3 ms, and context switches cost nothing. Which schedule is correct?',
    options: [
      {
        id: 'rr',
        text: 'P1 0–3 → P2 3–5 → P1 5–7',
        explanation:
          'P1 uses one quantum, P2 finishes before a full quantum, then P1 runs its remaining 2 ms.',
      },
      {
        id: 'fcfs',
        text: 'P1 0–5 → P2 5–7',
        explanation:
          'That is first-come, first-served behavior. Round Robin preempts P1 when its 3 ms quantum expires.',
      },
      {
        id: 'padded',
        text: 'P1 0–3 → P2 3–6 → P1 6–8',
        explanation:
          'A process that finishes early does not occupy the CPU for the unused part of its quantum.',
      },
    ],
    answer: 'rr',
    explanation:
      'The two bursts require 7 ms of CPU time in total. With no idle time or context-switch overhead, the schedule must finish at time 7.',
    review: '#scheduling-algorithms',
  },
}
