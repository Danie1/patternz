---
id: pattern_rate_limiter
title: Rate Limiter
summary: Control request volume per identity to protect services and enforce fairness.
category: Reliability
level: beginner
problem: Bursts and abusive clients overwhelm critical services.
why_it_exists: It caps request rates and shields downstream dependencies.
when_to_use:
  - Public APIs
  - Expensive endpoints
when_not_to_use:
  - Internal low-risk tools
  - Very low traffic systems
tradeoffs:
  - Better stability with occasional false rejections
  - Requires clear error messaging and retry design
examples:
  - Per-token request quotas
  - Login attempt throttling
related_concepts:
  - concept_backpressure
  - concept_retry_semantics
  - concept_availability
related_patterns:
  - pattern_api_gateway
  - pattern_circuit_breaker
related_scenarios:
  - scenario_notification_service
  - scenario_chat_app
tags:
  - reliability
  - abuse-prevention
  - fairness
diagram_reference: token_bucket_flow
quiz_ids:
  - quiz_tradeoff_judgment
order: 3
importance: 5
estimated_read_time: 6
complexity: medium
best_for: Shared services with variable client behavior.
avoid_when: You do not control client retry behavior.
main_tradeoff: Protection versus occasional user friction.
common_mistakes:
  - Limiting only by IP
  - No separate limits for expensive operations
---
Rate limiting teaches one of the most common architecture tradeoffs: protecting the system may reduce user convenience.

## Diagram

```mermaid
flowchart LR
  R[Request] --> T{Tokens available?}
  T -->|Yes| P[Process]
  T -->|No| L[429 Limit]
```
