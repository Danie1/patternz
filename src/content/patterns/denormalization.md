---
id: pattern_denormalization
title: Denormalization
summary: Deliberately store redundant copies of data to eliminate expensive joins and accelerate read performance.
category: Data Platform
level: intermediate
problem: Normalized relational schemas minimize redundancy but require multi-table joins for common queries. Under high read load, those joins become the primary bottleneck.
why_it_exists: Denormalization duplicates data across tables or documents so that common reads retrieve everything they need in a single query, trading write complexity for read speed.
when_to_use:
  - Read-heavy workloads where the same joined result is queried far more often than the underlying data changes.
  - Search and analytics systems where query latency matters more than storage efficiency.
  - Document stores (MongoDB, DynamoDB) where cross-collection joins are unavailable or expensive.
when_not_to_use:
  - Write-heavy systems where keeping copies in sync becomes the dominant cost.
  - Data with strict consistency requirements—every write must update all copies or reads will diverge.
  - Systems where storage cost is a hard constraint.
tradeoffs:
  - Read queries become dramatically simpler and faster—often a single primary key lookup instead of a multi-table join.
  - Write paths become more complex as multiple copies must be updated together or asynchronously reconciled.
  - Data divergence is possible if a write process fails after updating one copy but before updating another.
examples:
  - Embedding a user's display name into every post document so the feed render needs no join.
  - A materialized view that pre-computes aggregated sales totals per product, updated by a nightly ETL.
  - A search index that stores a flattened document representation for fast full-text retrieval.
related_concepts:
  - concept_eventual_consistency
  - concept_strong_consistency
  - concept_durability
related_patterns:
  - pattern_cache_aside
  - pattern_replication
  - pattern_sharding
related_scenarios: []
tags:
  - databases
  - performance
  - data
diagram_reference: denorm_reads
quiz_ids:
  - quiz_tradeoff_judgment
order: 15
importance: 3
estimated_read_time: 5
complexity: medium
best_for: Read-heavy systems querying the same joined data repeatedly.
avoid_when: Data changes frequently and all copies must stay perfectly in sync.
main_tradeoff: Read speed versus write complexity and risk of data divergence.
common_mistakes:
  - Denormalizing before profiling—applying it speculatively adds complexity without measured benefit.
  - Not having a clear update strategy for all copies when source data changes.
  - Treating denormalized copies as the source of truth—the authoritative record must remain in the normalized form.
---
Denormalization is an optimization, not a design philosophy. It should be applied to specific query paths that have been measured as bottlenecks, not as a blanket approach. The moment you have two copies of data, you have the problem of keeping them consistent—make sure you have a plan.

## Diagram

```mermaid
flowchart LR
  W[Write Path] --> N[(Normalized Store)]
  N --> D[(Denormalized Read Model)]
  R[Read Path] --> D
```
