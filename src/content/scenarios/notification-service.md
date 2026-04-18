---
id: scenario_notification_service
title: Notification Service
summary: Build a multi-channel notifier for email, push, and SMS with reliability and cost awareness.
level: intermediate
system_type: Event processing
core_problem: Deliver notifications reliably despite provider variability and traffic spikes.
functional_requirements:
  - Accept notification requests from product teams
  - Route by channel and template
  - Retry transient failures
non_functional_requirements:
  - High durability of queued notifications
  - Provider outage tolerance
  - Controlled operational cost
initial_design: Single API receives requests and calls providers synchronously.
design_steps:
  - Move delivery work to queue-based workers
  - Add circuit breaker per provider integration
  - Add rate limiting and priority tiers
  - Adopt event-driven workflow for audit and analytics
concept_links:
  - concept_durability
  - concept_retry_semantics
  - concept_idempotency
  - concept_delivery_guarantees
  - concept_backpressure
depends_on_concepts:
  - concept_delivery_guarantees
  - concept_idempotency
related_to_concepts:
  - concept_backpressure
architecture_variants:
  - Simple queue + workers for startup velocity
  - Event-driven orchestration for high scale and observability
related_patterns:
  - pattern_queue
  - pattern_circuit_breaker
  - pattern_rate_limiter
  - pattern_event_driven
  - pattern_api_gateway
depends_on_patterns:
  - pattern_queue
  - pattern_circuit_breaker
related_to_patterns:
  - pattern_rate_limiter
  - pattern_event_driven
quiz_ids:
  - quiz_tradeoff_judgment
estimated_time: 20
difficulty: medium
---
This scenario emphasizes practical tradeoffs between reliability, cost, and complexity in asynchronous systems.

## Diagram

```mermaid
flowchart LR
  API[Notification API] --> Q[(Queue)]
  Q --> W[Worker]
  W --> CB[Circuit Breaker]
  CB --> P[Provider]
  W --> Audit[(Event Log)]
```
