---
id: pattern_api_gateway
title: API Gateway
summary: Centralize routing, auth, quotas, and policy for client-facing APIs.
category: Traffic Management
level: intermediate
problem: Clients handle too many service endpoints and inconsistent cross-cutting policies.
why_it_exists: A gateway provides a stable front door and unified controls.
when_to_use:
  - Multi-service backends
  - Multiple client apps sharing APIs
when_not_to_use:
  - Single-service systems
  - Teams unable to operate gateway rules safely
tradeoffs:
  - Better governance with risk of central bottleneck
  - Simplifies clients but adds platform responsibility
examples:
  - Mobile API aggregation
  - Global auth and rate policies
related_concepts:
  - concept_coupling_and_cohesion
  - concept_availability
  - concept_fault_isolation
related_patterns:
  - pattern_load_balancer
  - pattern_rate_limiter
related_scenarios:
  - scenario_chat_app
  - scenario_notification_service
tags:
  - api
  - governance
  - traffic
diagram_reference: gateway_routing
quiz_ids:
  - quiz_tradeoff_judgment
order: 10
importance: 4
estimated_read_time: 7
complexity: medium
best_for: Systems that need consistent edge policy and API composition.
avoid_when: Application is still single-service and simple.
main_tradeoff: Control versus added platform layer.
common_mistakes:
  - Overloading gateway with business logic
  - No versioning strategy
---
A gateway should enforce policy and composition, not become an all-purpose application server.

## Diagram

```mermaid
flowchart LR
  C[Clients] --> G[API Gateway]
  G --> A[Auth Service]
  G --> S[Core Service]
  G --> N[Notification Service]
```
