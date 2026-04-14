---
id: concept_coupling_and_cohesion
title: Coupling and Cohesion
summary: Two design qualities that describe dependency strength between modules and focus within each module.
definition: Coupling measures how strongly components depend on each other, while cohesion measures how closely related responsibilities are inside a component.
why_it_matters:
  - Predicts how difficult systems are to change safely.
  - Helps structure teams and services around clearer boundaries.
  - Reduces blast radius of defects and refactors.
tradeoffs:
  - Low coupling and high cohesion improve evolvability.
  - Excessive decoupling can introduce unnecessary indirection.
  - Over-cohesion can hide useful abstraction boundaries.
examples:
  - Service boundaries aligned to bounded domain responsibilities.
  - Shared library extraction to remove duplicate cross-service code.
  - Refactoring monolith modules by business capability.
related_concepts:
  - concept_fault_isolation
  - concept_backpressure
related_patterns:
  - pattern_api_gateway
  - pattern_event_driven
  - pattern_queue
tags:
  - design
  - modularity
  - maintainability
estimated_read_time: 4
order: 11
---
Coupling and cohesion are diagnostic lenses for architecture quality over time.