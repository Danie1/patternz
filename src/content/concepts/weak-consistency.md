---
id: concept_weak_consistency
title: Weak Consistency
summary: After a write, subsequent reads may or may not see it—the system makes no guarantee about when the update will propagate.
definition: Weak consistency is the most permissive consistency model. Once a write is committed, the system does not guarantee that any future read will reflect it. Subsequent operations may see the new value, the old value, or nothing at all. This model is typically only appropriate when the cost of coordination exceeds the value of correctness.
why_it_matters:
  - Provides the lowest possible read latency since no synchronization is required.
  - Appropriate for workloads where losing occasional data points or seeing stale reads is acceptable.
  - Helps contrast with eventual consistency—which also allows staleness, but does guarantee convergence.
tradeoffs:
  - Zero coordination overhead yields very low latency and high availability.
  - Data loss is possible—a write acknowledged to the application may never propagate.
  - Not suitable for any data that has correctness requirements; must be paired with client-side tolerance for gaps.
examples:
  - Memcached at scale—after eviction, a cache miss returns no value with no guarantee the data was preserved.
  - VoIP and real-time video—dropped packets are discarded rather than retransmitted.
  - Real-time multiplayer game state—a slightly stale position is acceptable; waiting for consistency is not.
related_concepts:
  - concept_eventual_consistency
  - concept_strong_consistency
  - concept_causal_consistency
related_patterns:
  - pattern_cache_aside
  - pattern_cdn
tags:
  - consistency
  - distributed-systems
  - performance
estimated_read_time: 3
order: 17
---
Weak consistency is rarely the right default, but it is the correct choice for latency-critical streams where losing a value is less harmful than delaying the entire pipeline. If you are tempted to use it, verify that the system's correctness does not depend on any particular write being visible.
