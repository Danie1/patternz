export const diagramMap: Record<string, string> = {
  cache_aside_flow: `flowchart LR\nA[Client] --> B{Cache hit?}\nB -->|Yes| C[Return cached value]\nB -->|No| D[Query DB]\nD --> E[Store in cache]\nE --> C`,
  load_balancer_basic: `flowchart LR\nU[Users] --> LB[Load Balancer]\nLB --> S1[Service A]\nLB --> S2[Service B]\nLB --> S3[Service C]`,
  token_bucket_flow: `flowchart LR\nR[Request] --> T{Tokens available?}\nT -->|Yes| P[Process]\nT -->|No| L[429 Limit]`,
  queue_worker: `flowchart LR\nP[Producer] --> Q[(Queue)] --> W1[Worker]\nQ --> W2[Worker]\nW1 --> DB[(Store)]`,
  primary_replica: `flowchart LR\nA[App] --> P[(Primary)]\nP --> R1[(Replica 1)]\nP --> R2[(Replica 2)]`,
  shard_router: `flowchart LR\nA[App] --> R[Shard Router]\nR --> S1[(Shard 1)]\nR --> S2[(Shard 2)]\nR --> S3[(Shard 3)]`,
  circuit_states: `stateDiagram-v2\n[*] --> Closed\nClosed --> Open: failures threshold\nOpen --> HalfOpen: cooldown\nHalfOpen --> Closed: success\nHalfOpen --> Open: failure`,
  edge_cache: `flowchart LR\nU[Global users] --> E[Edge nodes]\nE --> O[Origin]`,
  pub_sub: `flowchart LR\nP[Publisher] --> B[(Event Bus)]\nB --> C1[Consumer 1]\nB --> C2[Consumer 2]`,
  gateway_routing: `flowchart LR\nC[Clients] --> G[API Gateway]\nG --> A[Auth Service]\nG --> S[Core Service]\nG --> N[Notification Service]`,
  reverse_proxy_flow: `flowchart LR\nC[Client] --> RP[Reverse Proxy]\nRP --> A[App Server 1]\nRP --> B[App Server 2]\nRP --> S[(Static Cache)]`,
  write_through_flow: `flowchart LR\nA[App] -->|write| C[(Cache)]\nC -->|write-through| D[(Database)]\nA -->|read| C`,
  write_behind_flow: `flowchart LR\nA[App] -->|write| C[(Cache)]\nC -.->|async flush| D[(Database)]\nA -->|read| C`,
  federation_split: `flowchart LR\nA[App] --> U[(Users DB)]\nA --> O[(Orders DB)]\nA --> P[(Products DB)]`,
  denorm_reads: `flowchart LR\nW[Write Path] --> N[(Normalized Store)]\nN --> D[(Denormalized Read Model)]\nR[Read Path] --> D`,
  failover_active_passive: `stateDiagram-v2\n[*] --> Active\nActive --> Failed: fault\nFailed --> Promoting: health check timeout\nPromoting --> Active: standby promoted`
};
