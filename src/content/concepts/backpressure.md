---
id: concept_backpressure
title: Backpressure
summary: Flow-control behavior that prevents producers from overwhelming downstream capacity.
definition: Backpressure is the practice of slowing intake or shedding load when consumers cannot keep up, protecting system stability.
why_it_matters:
  - Prevents queue explosion and cascading latency.
  - Keeps systems stable during traffic spikes.
  - Makes overload behavior explicit and testable.
tradeoffs:
  - Improves resilience and predictable degradation.
  - Can increase rejection rates or delayed completion.
  - Needs clear retry and client feedback policies.
examples:
  - Bounded queues with producer throttling.
  - API rate limiting under elevated traffic.
  - Stream processors signaling upstream slowdowns.
related_concepts:
  - concept_availability
  - concept_retry_semantics
related_patterns:
  - pattern_rate_limiter
  - pattern_queue
  - pattern_circuit_breaker
tags:
  - throughput
  - overload
  - resilience
estimated_read_time: 4
order: 8
---
Backpressure is a control mechanism for overload, not an optimization trick.