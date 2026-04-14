---
id: scenario_chat_app
title: Chat Application
summary: Explore real-time messaging architecture with delivery guarantees, fan-out, and scaling constraints.
level: intermediate
system_type: Real-time communication
core_problem: Keep message delivery fast and reliable across many active users and rooms.
functional_requirements:
  - Send and receive real-time messages
  - Persist message history
  - Support online presence
non_functional_requirements:
  - Low tail latency under burst traffic
  - Graceful degradation under dependency failures
  - Horizontal scalability
initial_design: WebSocket gateway with synchronous writes to database.
design_steps:
  - Add load balancer and sticky session strategy
  - Introduce queue for fan-out and notification work
  - Use replication for read-heavy history queries
  - Add circuit breaker around external push services
concept_links:
  - concept_availability
  - concept_delivery_guarantees
  - concept_causal_consistency
  - concept_backpressure
architecture_variants:
  - Monolith + internal queue for speed of delivery
  - Service split with API gateway for long-term scale
related_patterns:
  - pattern_load_balancer
  - pattern_queue
  - pattern_replication
  - pattern_circuit_breaker
  - pattern_api_gateway
quiz_ids:
  - quiz_scenario_steps
estimated_time: 24
difficulty: medium
related_comparisons:
  - comparison_monolith_vs_microservices
---
The chat scenario shows how patterns combine, and where complexity starts to appear as requirements increase.

## Diagram

```mermaid
flowchart LR
  Client --> LB[Load Balancer]
  LB --> Gateway[WebSocket Gateway]
  Gateway --> Queue[(Fan-out Queue)]
  Queue --> Worker[Delivery Worker]
  Worker --> DB[(Message Store)]
```
