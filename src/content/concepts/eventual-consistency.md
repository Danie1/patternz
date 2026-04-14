---
id: concept_eventual_consistency
title: Eventual Consistency
summary: A consistency model where replicas converge to the same state over time, not immediately after each write.
definition: Eventual consistency means reads can temporarily return older data after a write, but replicas are expected to converge when no new updates occur.
why_it_matters:
  - Enables higher availability and lower latency in distributed systems.
  - Supports geo-distributed replicas where synchronous coordination is expensive.
  - Clarifies why stale reads may be acceptable in some user flows.
tradeoffs:
  - Better performance and resilience under partition or high latency.
  - Temporary read staleness can confuse users if flows need immediate correctness.
  - Requires careful UX and business rules for freshness-sensitive operations.
examples:
  - Social feeds where a new post appears to some users first.
  - Profile updates that propagate across regional replicas.
  - Product counters that settle after asynchronous updates.
related_concepts:
  - concept_strong_consistency
  - concept_causal_consistency
related_patterns:
  - pattern_replication
  - pattern_cache_aside
  - pattern_event_driven
tags:
  - consistency
  - distributed-systems
  - replication
estimated_read_time: 4
order: 1
---
Eventual consistency is about convergence over time, not immediate global agreement.