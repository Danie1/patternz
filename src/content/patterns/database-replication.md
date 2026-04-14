---
id: pattern_replication
title: Database Replication
summary: Maintain read replicas to scale reads and increase data availability.
category: Data Platform
level: intermediate
problem: Primary database cannot sustain read demand and downtime tolerance goals.
why_it_exists: Replicas distribute reads and provide failover options.
when_to_use:
  - Read-heavy workloads
  - Availability-sensitive systems
when_not_to_use:
  - Tiny datasets with low read traffic
  - Strong write-after-read consistency requirements
tradeoffs:
  - Better read scalability with replication lag
  - Failover management increases operational burden
examples:
  - Analytics reads from replicas
  - User feed reads from regional replicas
related_concepts:
  - concept_eventual_consistency
  - concept_strong_consistency
  - concept_durability
  - concept_availability
related_patterns:
  - pattern_cache_aside
  - pattern_sharding
related_scenarios:
  - scenario_chat_app
tags:
  - data
  - scalability
  - consistency
diagram_reference: primary_replica
quiz_ids:
  - quiz_tradeoff_judgment
order: 5
importance: 4
estimated_read_time: 8
complexity: high
best_for: Systems where read scale dominates write complexity.
avoid_when: Every read must reflect latest write.
main_tradeoff: Read scale versus consistency lag.
common_mistakes:
  - Routing critical reads to lagging replicas
  - Not monitoring replication delay
---
Replication is often combined with caching, but each solves a different bottleneck.

## Diagram

```mermaid
flowchart LR
  A[App] --> P[(Primary)]
  P --> R1[(Replica 1)]
  P --> R2[(Replica 2)]
```
