---
id: pattern_write_behind_cache
title: Write-Behind Cache
summary: Acknowledge writes immediately to the cache and flush them to the database asynchronously, maximizing write throughput at the cost of durability.
category: Caching
level: intermediate
problem: Synchronous writes to both cache and database limit throughput on write-heavy paths. Every write must wait for a slow database round-trip before the client receives a response.
why_it_exists: Write-behind (also called write-back) acknowledges writes to the cache immediately and flushes them to the database in the background, absorbing bursts and decoupling write latency from database speed.
when_to_use:
  - Write-heavy workloads where write throughput matters more than immediate database durability.
  - Activity counters, analytics events, and aggregated metrics that can tolerate a short consistency window.
  - Systems with predictable write bursts that would otherwise overwhelm the database.
when_not_to_use:
  - Financial transactions, order records, or any data where a crash between the cache write and the database flush is unacceptable.
  - Systems without a reliable mechanism to recover unflushed writes after a cache failure.
  - Highly regulated domains that require immediate, auditable persistence of every change.
tradeoffs:
  - Dramatically higher write throughput because clients do not wait for the database.
  - A window of data loss exists—writes acknowledged to the client may not yet be in the database if the cache node fails.
  - Recovery logic (replay queue, write-ahead log) adds significant operational complexity.
examples:
  - A game leaderboard that buffers score increments in Redis and flushes aggregated totals to the database every few seconds.
  - An analytics pipeline that accumulates page view counts in cache and writes them in batches to a data warehouse.
  - A like/reaction counter that tolerates slight inaccuracy and prioritizes low-latency acknowledgment.
related_concepts:
  - concept_durability
  - concept_delivery_guarantees
  - concept_eventual_consistency
related_patterns:
  - pattern_write_through_cache
  - pattern_cache_aside
  - pattern_queue
related_scenarios: []
tags:
  - caching
  - performance
  - data
diagram_reference: write_behind_flow
quiz_ids:
  - quiz_tradeoff_judgment
order: 13
importance: 3
estimated_read_time: 5
complexity: high
best_for: Write-heavy workloads where throughput is the primary constraint and small data loss windows are acceptable.
avoid_when: Data loss on cache failure is unacceptable.
main_tradeoff: Write throughput versus durability.
common_mistakes:
  - No crash recovery path—when the cache restarts, unflushed writes are silently lost.
  - No queue depth monitoring—an unbounded backlog can cause delayed database flushes to lag by minutes or hours.
  - Mixing write-behind for durable data (orders, payments) where the loss window is never acceptable.
---
Write-behind trades safety for speed. It is the appropriate choice when writes arrive in bursts, the data has natural tolerance for small loss, and you have the operational maturity to monitor flush lag and handle recovery. Without those guardrails, it silently destroys data.

## Diagram

```mermaid
flowchart LR
  A[App] -->|write| C[(Cache)]
  C -.->|async flush| D[(Database)]
  A -->|read| C
```
