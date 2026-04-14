---
id: pattern_load_balancer
title: Load Balancer
summary: Distribute requests across service instances to improve availability and throughput.
category: Traffic Management
level: beginner
problem: A single service instance becomes a bottleneck and single point of failure.
why_it_exists: It spreads traffic and supports horizontal scaling.
when_to_use:
  - Stateless services with multiple instances
  - Public APIs with variable traffic
when_not_to_use:
  - Single-node systems with low traffic
  - Stateful affinity without session strategy
tradeoffs:
  - Better resilience with added operational layer
  - Smarter balancing needs health checks and tuning
examples:
  - API fleet behind reverse proxy
  - Web app front door
related_concepts:
  - concept_availability
  - concept_fault_isolation
  - concept_backpressure
related_patterns:
  - pattern_rate_limiter
  - pattern_api_gateway
related_scenarios:
  - scenario_chat_app
  - scenario_notification_service
tags:
  - availability
  - scaling
  - reliability
diagram_reference: load_balancer_basic
quiz_ids:
  - quiz_pattern_fundamentals
order: 2
importance: 5
estimated_read_time: 5
complexity: low
best_for: Multi-instance stateless APIs.
avoid_when: You cannot run at least two healthy replicas.
main_tradeoff: Resilience versus extra infrastructure.
common_mistakes:
  - Missing health checks
  - Ignoring sticky-session behavior
---
Load balancers are foundational because they make scale and failure handling predictable.

## Diagram

```mermaid
flowchart LR
  U[Users] --> LB[Load Balancer]
  LB --> S1[Service A]
  LB --> S2[Service B]
  LB --> S3[Service C]
```
