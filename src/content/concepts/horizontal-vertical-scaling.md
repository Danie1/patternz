---
id: concept_horizontal_vertical_scaling
title: Horizontal vs Vertical Scaling
summary: Vertical scaling adds resources to a single machine; horizontal scaling adds more machines to spread the load.
definition: Vertical scaling (scaling up) means increasing the CPU, RAM, or disk of an existing server. Horizontal scaling (scaling out) means adding more instances of a service behind a load balancer or router. Both increase system capacity, but they have different cost curves, failure characteristics, and architectural requirements.
why_it_matters:
  - The choice between scaling strategies drives infrastructure costs, complexity, and architectural constraints like statefulness.
  - Vertical scaling is simple but has a hard ceiling; horizontal scaling requires stateless or externalized state.
  - Understanding the distinction helps predict when a monolithic scaled-up server will fail to meet future demands.
tradeoffs:
  - Vertical scaling is faster to implement and requires no code changes but hits hardware limits and remains a single point of failure.
  - Horizontal scaling is essentially unbounded in capacity but requires stateless services, load balancers, and distributed-aware data access.
  - Cloud environments make horizontal scaling economical—pay-per-instance pricing avoids over-provisioning.
examples:
  - Upgrading a database server from 16 to 64 CPU cores to handle more concurrent queries (vertical).
  - Adding application server instances behind a load balancer to handle more HTTP traffic (horizontal).
  - Sharding a database across multiple servers when a single large server can no longer fit the data (forced horizontal).
related_concepts:
  - concept_availability
  - concept_statelessness
related_patterns:
  - pattern_load_balancer
  - pattern_sharding
  - pattern_replication
tags:
  - scalability
  - infrastructure
  - fundamentals
estimated_read_time: 4
order: 16
---
The practical limit of vertical scaling is that it reaches diminishing returns—doubling hardware rarely doubles performance. Horizontal scaling demands architectural discipline: services must avoid storing request-local state in memory, and data layers must be designed to distribute reads and writes. Most large-scale systems combine both strategies, vertically scaling databases while horizontally scaling stateless application tiers.
