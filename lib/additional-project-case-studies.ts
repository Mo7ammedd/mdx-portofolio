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
      'I built Disk-Mesh with a metadata master that tracks file locations and storage nodes that hold replicated chunks. The client checks the bytes it downloads, tries another replica when a read fails, and verifies the assembled file.',
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
          'I keep file transfers between clients and storage nodes so the master only handles names and placement. The master is still a single point of failure. It saves periodic snapshots, but has no metadata write-ahead log; a crash can lose changes since the last snapshot.',
      },
      {
        title: 'Chain replicas before acknowledging a chunk',
        description:
          'I send each chunk to the first storage node and let the nodes forward it down a chain. The acknowledgement waits for downstream writes, so a slow node slows the upload. If there are fewer live nodes than the target replication factor, an upload can succeed with fewer copies.',
      },
      {
        title: 'Repair from observed replica reports',
        description:
          'Each heartbeat reports the chunks a node holds. When a node times out, the master removes its replicas and asks surviving nodes to make new copies, favoring destinations with free space. This needs a healthy source and somewhere to copy to. A slow node can also time out even when it is still running.',
      },
    ],
    validation: [
      'The repository has nine integration scenarios covering byte-for-byte round trips, concurrent transfers, corrupt replicas, node loss, and garbage collection. The links below point to those scenarios; I have not included a fresh run here.',
      'The recovery test starts four storage nodes with three replicas per chunk, stops one node, and waits for three live replicas again. It then downloads the file and compares its bytes with the original. The cluster runs in one process, and this test does not cover a master crash.',
      'Chunk data and checksum files are written separately without an explicit disk sync. Copies and checksums alone cannot guarantee survival after power loss. Master crashes and interrupted writes still need testing.',
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
      'In this project, I split a food-ordering flow across .NET services: the cart fetches products and discounts, the order service handles Stripe checkout, and a separate consumer records rewards. The difficult part is handling the gaps where one service saves its work and the next step fails.',
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
          'I gave the services separate EF Core contexts. Most use PostgreSQL; orders and rewards use SQL Server. The cart fetches products and coupons over HTTP rather than joining their tables, so those services have to be available for the cart request to succeed.',
      },
      {
        title: 'Move follow-up work onto a message bus',
        description:
          'I use HTTP for cart details and Service Bus queues or topics for email requests and rewards. Payment validation saves the approved order, then publishes its reward message. There is no transactional outbox, so a failure between those operations can leave an approved order without a reward message.',
      },
      {
        title: 'Keep the reward contract small',
        description:
          'I pass the order ID, user ID, and reward activity in the message, and the consumer saves its own reward record. The handler does not check whether an order has already earned rewards, so repeated validation or message delivery can create duplicates.',
      },
    ],
    validation: [
      'The linked version implements the cart, Stripe status checks, reward publication, and reward handling. It has no automated test project or reproducible benchmark, so I do not have latency or end-to-end reliability measurements to share.',
      'The reward consumer has a registration bug: it requests IRewardService, but startup only registers RewardService. That needs fixing before running the consumer. Local setup also needs database, Stripe, and Service Bus credentials, with different configuration keys used by the producer and consumers.',
      'There are other unfinished parts: the reward handler swallows database errors, allowing the consumer to complete a failed message, and EmailAPI logs the generated email without sending it. Failed writes, duplicate delivery, and a crash between saving an order and publishing its message still need tests.',
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
      'I built LLMProxy to put provider credentials, routing, quotas, and usage accounting behind one API. Clients send a gateway key and a public model alias. The gateway chooses a compatible provider, checks the limits, and records each attempt.',
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
          'I put provider protocols behind adapters and expose public model aliases to clients. The router checks the requested features before choosing by priority, round-robin, cost, or latency. Tools, media inputs, and response formats still depend on what the chosen adapter and model support.',
      },
      {
        title: 'Stop fallback once streaming output begins',
        description:
          'Provider accounts can rotate keys, cool down rejected credentials, and fall back after eligible failures. I stop fallback after the first streaming event reaches the client: a later failure ends the stream rather than replaying it. Attempts before that boundary can still incur separate provider charges.',
      },
      {
        title: 'Reserve allowances before dispatch',
        description:
          'I reserve tokens and spending with a conditional database update before dispatch. Completion settles usage and the reservation in one transaction, and repeating finalization does not charge the request twice. Interrupted requests or missing usage need conservative estimates; provider invoice records can later correct spending.',
      },
    ],
    validation: [
      'The tests cover provider fallback, key-pool failover, and stream failures on either side of the first event. API checks verify that failover records both credential fingerprints but settles one gateway request, and that an error after streaming starts never retries another key.',
      'Persistence scenarios submit 40 concurrent reservations against an allowance that admits 17, then check both the counters and stored reservations. Separate SQLite and PostgreSQL scenarios check that duplicate finalizers commit usage once.',
      'Provider calls in these tests use deterministic fakes or mock endpoints. PostgreSQL and Redis tests need configured services; they skip when the environment variables are missing. The links below show the test cases, not a fresh run against live providers.',
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
