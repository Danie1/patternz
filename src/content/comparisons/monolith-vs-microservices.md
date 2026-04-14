---
id: comparison_monolith_vs_microservices
title: Monolith vs Microservices
summary: Compare delivery speed, scaling boundaries, and operational complexity between two common architectures.
compared_options:
  - Monolith
  - Microservices
dimensions:
  - name: Team cognitive load
    option_scores:
      Monolith: Lower early-stage overhead
      Microservices: Higher due to service boundaries and ops
  - name: Independent scaling
    option_scores:
      Monolith: Coarse-grained scaling
      Microservices: Fine-grained scaling per service
  - name: Deployment complexity
    option_scores:
      Monolith: Simpler CI/CD pipeline
      Microservices: Higher orchestration and release coordination
  - name: Failure isolation
    option_scores:
      Monolith: Lower isolation
      Microservices: Better isolation with good boundaries
recommended_when:
  - Choose monolith when product scope and team are small and learning speed matters most.
  - Choose microservices when domains are clear and teams need independent deployment velocity.
anti_patterns:
  - Splitting into microservices before clear domain boundaries
  - Keeping tightly coupled services that must deploy together
related_patterns:
  - pattern_api_gateway
  - pattern_circuit_breaker
related_scenarios:
  - scenario_chat_app
examples:
  - Startup MVP starts monolith and extracts bounded services later
  - Multi-team platform with independent release cadence
---
This comparison is about timing and organizational fit, not ideology.

## Diagram

```mermaid
flowchart LR
  User --> M[Monolith]
  User --> G[API Gateway]
  G --> S1[Service A]
  G --> S2[Service B]
  G --> S3[Service C]
```
