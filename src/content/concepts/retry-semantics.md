---
id: concept_retry_semantics
title: Retry Semantics
summary: Rules that define when, how, and how often operations should be retried after failure.
definition: Retry semantics describe structured retry behavior, including what errors are retryable, delay strategy, and termination conditions.
why_it_matters:
  - Converts transient failures into successful outcomes.
  - Prevents naive retries from amplifying outages.
  - Clarifies correctness behavior when operation outcome is uncertain.
tradeoffs:
  - Increases success rate for transient faults.
  - Can worsen load if retry storms are uncontrolled.
  - Requires coordination with idempotency and timeout design.
examples:
  - Exponential backoff with jitter for external API calls.
  - Dead-letter routing after retry budget is exhausted.
  - Client SDK retry policies differentiated by error class.
related_concepts:
  - concept_idempotency
  - concept_backpressure
related_patterns:
  - pattern_circuit_breaker
  - pattern_queue
  - pattern_rate_limiter
tags:
  - resilience
  - retries
  - error-handling
estimated_read_time: 4
order: 9
---
Retry semantics are policy choices about failure handling, not just adding loops.