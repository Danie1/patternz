---
id: concept_delivery_guarantees
title: Exactly-Once vs At-Least-Once Delivery
summary: Messaging guarantees that describe whether duplicates may happen and what systems must do in response.
definition: Delivery guarantees define whether messages are delivered one or more times and what correctness assumptions consumers can safely make.
why_it_matters:
  - Shapes consumer logic and data correctness strategy.
  - Prevents incorrect assumptions about duplicate-free processing.
  - Guides architecture choices around deduplication and state handling.
tradeoffs:
  - At-least-once is usually simpler and more fault-tolerant.
  - Exactly-once semantics often add complexity and coordination cost.
  - Stronger guarantees may lower throughput or increase latency.
examples:
  - Event consumers using dedupe keys for at-least-once streams.
  - Payment workflows requiring strict duplicate suppression.
  - Batch processing pipelines with checkpoint-based replay.
related_concepts:
  - concept_idempotency
  - concept_durability
related_patterns:
  - pattern_queue
  - pattern_event_driven
  - pattern_circuit_breaker
tags:
  - messaging
  - reliability
  - consistency
estimated_read_time: 5
order: 10
---
Delivery guarantees are contracts about message behavior, not guarantees of business correctness by themselves.