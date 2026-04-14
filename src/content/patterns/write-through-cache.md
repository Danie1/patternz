---
id: pattern_write_through_cache
title: Write-Through Cache
summary: Synchronously update the cache and the database together on every write, keeping them always in sync.
category: Caching
level: intermediate
problem: Cache-aside only populates the cache on read misses, so writes go directly to the database. Until the next read repopulates it, the cache holds stale data.
why_it_exists: Write-through updates the cache on every write, ensuring that subsequent reads always find a fresh value without a database round-trip.
when_to_use:
  - Read-heavy workloads where serving stale data is unacceptable (user profiles, configuration).
  - Systems where the same data is read many more times than it is written.
  - When the cache hit rate would be low with cache-aside because data is rarely re-read after a write.
when_not_to_use:
  - Write-heavy workloads where every write paying both the cache and database penalty reduces throughput.
  - Data that is written frequently but rarely read—the cache fills with cold entries.
  - When cache and database failures must be handled independently.
tradeoffs:
  - Every read after a write returns the latest value from cache, eliminating a class of stale-read bugs.
  - Every write is slower because it must update both the cache and the database synchronously.
  - Cache starts cold on restart—there is no warm-up gap, but there is no initial data either until the first writes arrive.
examples:
  - Updating a user's display name writes the new value to Redis and the database atomically before returning success.
  - A session store that persists every mutation through to a backing database for durability.
  - A configuration service where every config change is immediately available in the cache layer.
related_concepts:
  - concept_strong_consistency
  - concept_durability
  - concept_latency_throughput
related_patterns:
  - pattern_cache_aside
  - pattern_write_behind_cache
related_scenarios: []
tags:
  - caching
  - consistency
  - data
diagram_reference: write_through_flow
quiz_ids:
  - quiz_tradeoff_judgment
order: 12
importance: 3
estimated_read_time: 5
complexity: medium
best_for: Read-heavy workloads where stale cache data causes correctness problems.
avoid_when: Write rate is high and the per-write latency penalty is unacceptable.
main_tradeoff: Data freshness versus write latency.
common_mistakes:
  - Not handling partial failure—if the cache write succeeds but the database write fails, the cache has data the database does not.
  - Writing through to the cache for data that is never read, wasting memory and write time.
  - Confusing write-through with write-back (write-behind)—write-through is synchronous; write-back is asynchronous.
---
Write-through is the right choice when your system's reads care about freshness and writes are infrequent enough that the extra latency is acceptable. It shifts the consistency burden from the read path to the write path.

## Diagram

```mermaid
flowchart LR
  A[App] -->|write| C[(Cache)]
  C -->|write-through| D[(Database)]
  A -->|read| C
```
