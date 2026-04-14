---
id: pattern_cache_aside
title: Cache-Aside
summary: Read-heavy systems load from cache first and fall back to the database on misses.
category: Data Access
level: beginner
problem: Databases become expensive under repeated reads.
why_it_exists: It cuts response time and database load by serving hot reads from memory.
when_to_use:
  - Read-heavy traffic with repeat lookups
  - Data can be briefly stale
when_not_to_use:
  - Strictly consistent reads are required
  - Data changes every request
tradeoffs:
  - Faster reads but stale data risk
  - Simpler than write-through but requires cache invalidation strategy
examples:
  - Product catalog lookup
  - User profile read path
related_concepts:
  - concept_eventual_consistency
  - concept_availability
  - concept_strong_consistency
related_patterns:
  - pattern_cdn
  - pattern_replication
related_scenarios:
  - scenario_url_shortener
  - scenario_chat_app
tags:
  - caching
  - latency
  - scalability
diagram_reference: cache_aside_flow
quiz_ids:
  - quiz_pattern_fundamentals
order: 1
importance: 5
estimated_read_time: 6
complexity: low
best_for: High read traffic with tolerant freshness.
avoid_when: Business rules require absolute read-after-write consistency.
main_tradeoff: Speed versus freshness.
common_mistakes:
  - No TTL strategy for hot keys
  - Invalidating cache too aggressively
---
Cache-aside lets your application control when values are loaded and refreshed. It is usually the first caching pattern juniors should learn.

## Diagram

```mermaid
flowchart LR
  A[Client] --> B{Cache hit?}
  B -->|Yes| C[Return cached value]
  B -->|No| D[Query DB]
  D --> E[Store in cache]
  E --> C
```
