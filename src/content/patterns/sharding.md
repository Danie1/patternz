---
id: pattern_sharding
title: Sharding
summary: Split a large dataset across multiple database partitions to scale writes and storage.
category: Data Platform
level: advanced
problem: Single database node cannot handle write volume or data size.
why_it_exists: Partitioning distributes load and enables horizontal growth.
when_to_use:
  - Very high write throughput
  - Massive datasets
when_not_to_use:
  - Early-stage products
  - Teams lacking data operations maturity
tradeoffs:
  - Major scaling gains with increased data access complexity
  - Cross-shard queries and rebalancing are costly
examples:
  - User ID based shard map
  - Tenant-based partitioning
related_concepts:
  - concept_coupling_and_cohesion
  - concept_availability
  - concept_partition_tolerance
  - concept_strong_consistency
related_patterns:
  - pattern_replication
  - pattern_api_gateway
related_scenarios:
  - scenario_chat_app
tags:
  - partitioning
  - scale
  - data
diagram_reference: shard_router
quiz_ids:
  - quiz_tradeoff_judgment
order: 6
importance: 4
estimated_read_time: 9
complexity: high
best_for: Mature systems hitting single-node limits.
avoid_when: Team cannot own routing and data movement complexity.
main_tradeoff: Write scale versus architectural complexity.
common_mistakes:
  - Choosing weak shard key
  - Ignoring cross-shard query paths
---
Sharding is rarely first choice; it is usually a last-mile scaling move.

## Diagram

```mermaid
flowchart LR
  A[App] --> R[Shard Router]
  R --> S1[(Shard 1)]
  R --> S2[(Shard 2)]
  R --> S3[(Shard 3)]
```
