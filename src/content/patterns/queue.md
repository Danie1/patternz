---
id: pattern_queue
title: Queue
summary: Decouple producers and consumers for asynchronous, resilient processing.
category: Async Processing
level: beginner
problem: Synchronous processing creates latency and cascading failure risk.
why_it_exists: Queues smooth traffic spikes and isolate failure domains.
when_to_use:
  - Background work
  - Workloads with retry needs
when_not_to_use:
  - Strict low-latency request-response paths
  - Small systems with trivial workloads
tradeoffs:
  - Better reliability with eventual consistency and operational complexity
  - Requires idempotency and dead-letter strategy
examples:
  - Email delivery pipeline
  - Media processing jobs
related_concepts:
  - concept_backpressure
  - concept_delivery_guarantees
  - concept_idempotency
  - concept_eventual_consistency
  - concept_fault_isolation
related_patterns:
  - pattern_event_driven
  - pattern_circuit_breaker
related_scenarios:
  - scenario_notification_service
  - scenario_chat_app
tags:
  - async
  - resilience
  - throughput
diagram_reference: queue_worker
quiz_ids:
  - quiz_scenario_steps
order: 4
importance: 5
estimated_read_time: 7
complexity: medium
best_for: Non-blocking workflows and burst absorption.
avoid_when: User must receive immediate final result.
main_tradeoff: Reliability versus immediacy.
common_mistakes:
  - No dead-letter queue
  - Non-idempotent consumers
---
Queues help teams move from request-centric thinking to workflow-centric design.

## Diagram

```mermaid
flowchart LR
  P[Producer] --> Q[(Queue)]
  Q --> W1[Worker]
  Q --> W2[Worker]
  W1 --> DB[(Store)]
```
