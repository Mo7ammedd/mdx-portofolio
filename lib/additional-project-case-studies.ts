import type { ProjectCaseStudy } from './project-case-studies'

export const ADDITIONAL_PROJECT_CASE_STUDIES: ProjectCaseStudy[] = [
  {
    slug: 'disk-mesh',
    title: 'Disk-Mesh',
    subtitle: 'Follow a file across a storage cluster',
    description:
      'A Java distributed file-system prototype that splits files into checksummed chunks, pipelines replicas, and coordinates repair through heartbeats.',
    technologies: ['Java', 'TCP', 'SHA-256', 'Distributed storage'],
    source: 'https://github.com/Mo7ammedd/Disk-Mesh',
    problem:
      'Copying a file to several machines is only the beginning. A client also needs to locate its chunks, detect damaged bytes, and keep reading when a storage node disappears. Disk-Mesh makes these responsibilities visible through a metadata master, storage nodes, and a client that verifies the data it receives.',
    architecture: [
      {
        title: 'Allocate',
        description: 'The master assigns chunk IDs and a replica pipeline.',
      },
      {
        title: 'Replicate',
        description:
          'The client sends each checksummed chunk through the chosen nodes.',
      },
      {
        title: 'Commit',
        description:
          'Publish file metadata after the write pipeline acknowledges.',
      },
      {
        title: 'Reconcile',
        description:
          'Heartbeats report replicas and carry commands to make more copies.',
      },
    ],
    architectureNote:
      'File bytes travel directly between clients and storage nodes. Downloads use the master’s locations, try another replica when a read fails, and verify both chunk checksums and the assembled file’s SHA-256 digest.',
    decisions: [
      {
        title: 'Keep metadata separate from file bytes',
        description:
          'One master owns the namespace and placement decisions while storage nodes handle the data. This keeps bulk transfers off the master, but makes its availability a shared dependency. Periodic snapshots support restart; there is no metadata write-ahead log, so an abrupt failure can lose changes made since the last snapshot.',
      },
      {
        title: 'Chain replicas before acknowledging a chunk',
        description:
          'The client sends one copy to the first node, which stores it and forwards it down the chain. Acknowledgements return after downstream writes finish, making the slowest link part of upload latency. Allocation caps the replication factor at the number of live nodes, so a successful upload can have fewer copies than the configured target.',
      },
      {
        title: 'Repair from observed replica reports',
        description:
          'Heartbeats include each node’s chunk list. After a timeout removes a node from replica sets, the master asks surviving holders to copy chunks to other nodes, favoring free capacity. Repair needs a healthy source and an available destination; a timeout can also mistake a slow node for a failed one.',
      },
    ],
    validation: [
      'The repository defines nine integration scenarios, including byte-for-byte round trips, concurrent transfers, corrupt-replica handling, node loss, and garbage collection. These are inspected test definitions; no fresh execution results are claimed here.',
      'The recovery scenario starts four storage nodes with a replication factor of three, stops one node, waits for every chunk to have three live replicas again, and compares a downloaded file with its original bytes. This checks storage-node recovery within an in-process cluster; it does not exercise abrupt master failure.',
      'Chunk data and checksum sidecars are written separately without an explicit disk synchronization call. Replication and checksum validation therefore do not establish power-loss durability. Master-crash and interrupted-write scenarios are useful next checks before making stronger persistence claims.',
    ],
    references: [
      {
        title: 'Four-node recovery scenario',
        href: 'https://github.com/Mo7ammedd/Disk-Mesh/blob/8f960a3cfd5bb6685f6caf9c338a1ea49d242331/src/dfs/tests/IntegrationTests.java#L215-L239',
      },
      {
        title: 'Chained replication',
        href: 'https://github.com/Mo7ammedd/Disk-Mesh/blob/8f960a3cfd5bb6685f6caf9c338a1ea49d242331/src/dfs/storagenode/StorageNode.java#L109-L131',
      },
      {
        title: 'Metadata and repair planning',
        href: 'https://github.com/Mo7ammedd/Disk-Mesh/blob/8f960a3cfd5bb6685f6caf9c338a1ea49d242331/src/dfs/metadata/MetadataStore.java',
      },
      {
        title: 'Download verification',
        href: 'https://github.com/Mo7ammedd/Disk-Mesh/blob/8f960a3cfd5bb6685f6caf9c338a1ea49d242331/src/dfs/client/DfsClient.java#L106-L170',
      },
      {
        title: 'Snapshot lifecycle',
        href: 'https://github.com/Mo7ammedd/Disk-Mesh/blob/8f960a3cfd5bb6685f6caf9c338a1ea49d242331/src/dfs/master/MasterNode.java#L57-L89',
      },
      {
        title: 'Chunk persistence',
        href: 'https://github.com/Mo7ammedd/Disk-Mesh/blob/8f960a3cfd5bb6685f6caf9c338a1ea49d242331/src/dfs/storage/ChunkStore.java#L34-L67',
      },
    ],
    experiment: {
      title: 'Run the cluster scenarios',
      description:
        'With Java 22 or newer installed, run this command from a repository checkout. The supplied runner starts an in-process master and storage nodes and exercises the nine integration scenarios.',
      command: 'bash scripts/test.sh',
    },
  },
  {
    slug: 'hungerstation-microservices',
    title: 'HungerStation Microservices',
    subtitle: 'Trace a checkout across service boundaries',
    description:
      'A .NET 8 food-ordering project that separates authentication, catalog, carts, orders, and background consumers using HTTP APIs and Azure Service Bus.',
    technologies: ['C#', '.NET 8', 'EF Core', 'Azure Service Bus', 'Stripe'],
    source: 'https://github.com/Mo7ammedd/HungerStation_Microservices',
    problem:
      'A checkout combines product prices, discounts, payment state, and work that can happen afterward. Splitting these responsibilities into services makes the boundaries explicit, but also creates places where one step can succeed while another fails. This project follows those boundaries from a cart request to an order and its reward message.',
    architecture: [
      {
        title: 'Cart',
        description:
          'Fetch products and coupons over HTTP to calculate the total.',
      },
      {
        title: 'Order',
        description: 'Save a pending order with its line items and prices.',
      },
      {
        title: 'Payment',
        description: 'Create a Stripe session and query its payment status.',
      },
      {
        title: 'Rewards',
        description: 'Publish reward data to a topic for a separate consumer.',
      },
    ],
    architectureNote:
      'Seven service projects sit behind an ASP.NET Core MVC frontend. AuthAPI uses ASP.NET Core Identity and signed JWTs. A separate Service Bus queue carries cart-email requests to EmailAPI, whose current implementation renders and stores the message body.',
    decisions: [
      {
        title: 'Give each service its own data model',
        description:
          'Services define separate EF Core contexts; most use PostgreSQL, while orders and rewards use SQL Server. The cart composes product and coupon data through HTTP instead of joining their tables. This makes ownership explicit, but the cart request also depends on those services being available.',
      },
      {
        title: 'Move follow-up work onto a message bus',
        description:
          'Cart details need immediate HTTP responses, while email requests and rewards use queues or topics. The payment-validation endpoint saves an approved order before publishing its reward message. Those are separate operations with no transactional outbox, leaving a failure window between database persistence and publication.',
      },
      {
        title: 'Keep the reward contract small',
        description:
          'The reward message carries an order ID, user ID, and reward activity. Its consumer writes a separate reward record, keeping it independent of the order schema. Repeated payment validation or message delivery can still create duplicate records because the handler has no check that an order has already earned rewards.',
      },
    ],
    validation: [
      'The linked source traces cart composition, Stripe status validation, message publication, and reward handling. The inspected revision contains no automated test project or reproducible benchmark workload, so this case study makes no measured latency or end-to-end reliability claim.',
      'The reward consumer requests IRewardService, but startup registers only the concrete RewardService. That registration needs correction before exercising the consumer. A local run also needs database, Stripe, and Service Bus configuration; the producer and consumers read different configuration keys.',
      'The reward handler catches database failures without rethrowing, after which the consumer can complete the message. Useful next checks are a failed database write, duplicate delivery, and interruption between order persistence and publication. EmailAPI currently logs generated content without calling a mail transport.',
    ],
    references: [
      {
        title: 'Cart composition',
        href: 'https://github.com/Mo7ammedd/HungerStation_Microservices/blob/390fff389727d1eb9c41eb132eecb33e0b2837f0/HungerStation.Services.ShoppingCartAPI/Controllers/CartAPIController.cs#L37-L110',
      },
      {
        title: 'Payment validation and publication',
        href: 'https://github.com/Mo7ammedd/HungerStation_Microservices/blob/390fff389727d1eb9c41eb132eecb33e0b2837f0/HungerStation.Services.OrderAPI/Controllers/OrderController.cs#L167-L208',
      },
      {
        title: 'Service Bus publisher',
        href: 'https://github.com/Mo7ammedd/HungerStation_Microservices/blob/390fff389727d1eb9c41eb132eecb33e0b2837f0/HungerStation.MessageBus/MessageBus.cs',
      },
      {
        title: 'Reward consumer',
        href: 'https://github.com/Mo7ammedd/HungerStation_Microservices/blob/390fff389727d1eb9c41eb132eecb33e0b2837f0/HungerStation.Services.RewardAPI/Messaging/AzureServiceBusConsumer.cs',
      },
      {
        title: 'Reward persistence',
        href: 'https://github.com/Mo7ammedd/HungerStation_Microservices/blob/390fff389727d1eb9c41eb132eecb33e0b2837f0/HungerStation.Services.RewardAPI/Services/RewardService.cs#L15-L34',
      },
      {
        title: 'Reward startup wiring',
        href: 'https://github.com/Mo7ammedd/HungerStation_Microservices/blob/390fff389727d1eb9c41eb132eecb33e0b2837f0/HungerStation.Services.RewardAPI/Program.cs#L10-L19',
      },
      {
        title: 'Email content logging',
        href: 'https://github.com/Mo7ammedd/HungerStation_Microservices/blob/390fff389727d1eb9c41eb132eecb33e0b2837f0/HungerStation.Services.EmailAPI/Services/EmailService.cs#L19-L53',
      },
    ],
  },
  {
    slug: 'llmproxy',
    title: 'LLMProxy',
    subtitle: 'Route model requests and account for every attempt',
    description:
      'A self-hosted LLM gateway in C# and .NET 10, exposing OpenAI-compatible APIs across ten provider adapters with key pools, quotas, usage accounting, and an embedded admin console.',
    technologies: ['C#', '.NET 10', 'PostgreSQL', 'Redis'],
    source: 'https://github.com/Mo7ammedd/LLMProxy',
    problem:
      'Applications that call several model providers have to manage different credentials, protocols, rate limits, and billing rules. LLMProxy puts those responsibilities behind one API: clients use gateway keys and public model aliases while the server chooses a compatible upstream, enforces allowances, and records the work performed.',
    architecture: [
      {
        title: 'Authenticate',
        description:
          'Validate the gateway key, permitted model alias, and request limits.',
      },
      {
        title: 'Plan the route',
        description:
          'Filter targets by capabilities and order the eligible providers.',
      },
      {
        title: 'Reserve capacity',
        description:
          'Acquire concurrency slots and reserve token and spending allowances.',
      },
      {
        title: 'Invoke and settle',
        description:
          'Translate the provider response, record attempts, and settle usage.',
      },
    ],
    architectureNote:
      'Provider adapters handle wire protocols while the application layer owns routing and accounting. PostgreSQL and Redis support multiple gateway replicas; standalone deployments use SQLite and local admission controls. The embedded admin console manages keys, policies, and usage.',
    decisions: [
      {
        title: 'Keep provider differences behind adapters',
        description:
          'Clients select public model aliases instead of provider-specific model IDs. The router checks capabilities and feature combinations before dispatch, then applies a strategy such as priority, round-robin, cost, or latency. A common API simplifies client integration, while supported tools, media inputs, and response formats still depend on the chosen adapter and model.',
      },
      {
        title: 'Stop fallback once streaming output begins',
        description:
          'Named provider accounts can rotate through multiple keys, cool down rejected credentials, and fall back to another provider after eligible failures. Streaming fallback is allowed before the first event. After output reaches the client, a later failure ends the stream without replaying the request. Retrying upstream requests can still incur additional provider charges.',
      },
      {
        title: 'Reserve allowances before dispatch',
        description:
          'A conditional database update reserves tokens and spending before a request starts. Completion settles the reservation and usage record in one transaction, with duplicate finalization handled idempotently. Missing usage or interrupted requests require conservative estimates; invoice reconciliation can later adjust spending from provider records.',
      },
    ],
    validation: [
      'The repository includes tests for provider fallback, pooled-key failover, and streaming failures before and after the first event. API tests check that failover records both credential fingerprints while settling one gateway request, and that a stream error after output never retries another key.',
      'Persistence scenarios submit 40 concurrent reservations against an allowance that admits 17, then check both the counters and stored reservations. Separate SQLite and PostgreSQL scenarios check that duplicate finalizers commit usage once.',
      'These references document the inspected test definitions. Provider calls use deterministic fakes or mock endpoints. PostgreSQL and Redis checks require configured test services and are skipped when their environment variables are absent.',
    ],
    references: [
      {
        title: 'Architecture and request lifecycle',
        href: 'https://github.com/Mo7ammedd/LLMProxy/blob/8ae9311b096b9983b187cd6c2d42aefca072d825/docs/architecture.md',
      },
      {
        title: 'Fallback and streaming tests',
        href: 'https://github.com/Mo7ammedd/LLMProxy/blob/8ae9311b096b9983b187cd6c2d42aefca072d825/tests/LLMProxy.UnitTests/FallbackTests.cs',
      },
      {
        title: 'Provider key-pool API tests',
        href: 'https://github.com/Mo7ammedd/LLMProxy/blob/8ae9311b096b9983b187cd6c2d42aefca072d825/tests/LLMProxy.IntegrationTests/ProviderKeyPoolApiTests.cs',
      },
      {
        title: 'Concurrent quota and persistence tests',
        href: 'https://github.com/Mo7ammedd/LLMProxy/blob/8ae9311b096b9983b187cd6c2d42aefca072d825/tests/LLMProxy.IntegrationTests/PersistenceTests.cs',
      },
    ],
    experiment: {
      title: 'Exercise routing and accounting',
      description:
        'With the .NET 10 SDK installed, run these commands from a repository checkout for unit, provider, and SQLite integration checks. Set LLMPROXY_TEST_POSTGRES and LLMPROXY_TEST_REDIS to include the PostgreSQL and Redis scenarios.',
      command:
        'dotnet restore --locked-mode\ndotnet build --configuration Release --no-restore -m:1\ndotnet test --configuration Release --no-build --no-restore',
    },
  },
]
