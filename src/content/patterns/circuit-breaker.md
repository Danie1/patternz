---
id: pattern_circuit_breaker
title: Circuit Breaker
summary: Stop calling failing dependencies temporarily to prevent cascading outages.
category: Reliability
level: intermediate
problem: Repeated calls to unhealthy dependencies amplify latency and failure.
why_it_exists: It fails fast and gives downstream systems recovery time.
when_to_use:
  - External APIs with variable reliability
  - Microservice call chains
when_not_to_use:
  - Single-process apps without network dependencies
  - Critical paths without fallback options
tradeoffs:
  - Higher resilience with possible temporary false-open periods
  - Requires careful threshold tuning
examples:
  - Payment provider fallback mode
  - Recommendation service graceful degradation
related_concepts:
  - concept_fault_isolation
  - concept_availability
  - concept_retry_semantics
related_patterns:
  - pattern_queue
  - pattern_rate_limiter
related_scenarios:
  - scenario_notification_service
  - scenario_chat_app
tags:
  - resilience
  - fault-tolerance
  - latency
diagram_reference: circuit_states
quiz_ids:
  - quiz_scenario_steps
order: 7
importance: 4
estimated_read_time: 6
complexity: medium
best_for: Dependency-heavy systems needing graceful degradation.
avoid_when: There is no fallback behavior.
main_tradeoff: Stability versus occasional temporary blocking.
common_mistakes:
  - No fallback response
  - Shared breaker across unrelated operations
---
Circuit breakers shift teams from retrying blindly to designing explicit failure modes.

## Diagram

```mermaid
stateDiagram-v2
  [*] --> Closed
  Closed --> Open: failures threshold
  Open --> HalfOpen: cooldown
  HalfOpen --> Closed: success
  HalfOpen --> Open: failure
```
