---
id: pattern_event_driven
title: Event-Driven Architecture
summary: Services emit and consume events to decouple workflows and scale independently.
category: Async Processing
level: intermediate
problem: Tight service coupling slows delivery and increases failure propagation.
why_it_exists: Events let systems evolve with looser runtime dependencies.
when_to_use:
  - Independent domain workflows
  - Integrations across many consumers
when_not_to_use:
  - Simple systems with straightforward synchronous flows
  - Teams new to observability and message semantics
tradeoffs:
  - Better decoupling with harder debugging and ordering concerns
  - Scales well but increases operational and data consistency complexity
examples:
  - Order lifecycle events
  - User activity stream processing
related_concepts:
  - concept_causal_consistency
  - concept_idempotency
  - concept_delivery_guarantees
  - concept_coupling_and_cohesion
related_patterns:
  - pattern_queue
  - pattern_api_gateway
related_scenarios:
  - scenario_notification_service
  - scenario_chat_app
tags:
  - events
  - decoupling
  - scaling
diagram_reference: pub_sub
quiz_ids:
  - quiz_scenario_steps
order: 9
importance: 4
estimated_read_time: 8
complexity: high
best_for: Modular systems with many downstream consumers.
avoid_when: Simplicity and strict sequencing are top priorities.
main_tradeoff: Decoupling versus operational complexity.
common_mistakes:
  - Missing event contracts
  - No deduplication strategy
---
Event-driven architecture is powerful when teams manage event contracts as carefully as APIs.

## Diagram

```mermaid
flowchart LR
  P[Publisher] --> B[(Event Bus)]
  B --> C1[Consumer 1]
  B --> C2[Consumer 2]
```
