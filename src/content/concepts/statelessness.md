---
id: concept_statelessness
title: Statelessness
summary: A stateless service holds no per-user or per-session data in memory between requests; all necessary context travels with the request.
definition: Statelessness means that every request a service receives contains all information needed to process it. The server does not retain session-specific state between calls. Any state that must persist (user sessions, shopping carts, authentication tokens) is stored in an external system—a database, cache, or distributed store—and referenced by an identifier sent with each request.
why_it_matters:
  - Stateless services can be freely added, removed, or replaced without draining sessions, enabling true horizontal scaling.
  - Any instance behind a load balancer can handle any request, eliminating the need for sticky sessions.
  - Failure of one instance does not lose user state because state was never in that instance.
tradeoffs:
  - Requires an external state store (e.g., Redis) for session data, which becomes a dependency and potential bottleneck.
  - Passing all context with each request increases payload size for session-heavy interactions.
  - Proper token-based authentication (JWT, opaque tokens with external lookup) must be designed upfront.
examples:
  - REST APIs that use JWTs—each request carries an encoded claim and the server needs no local session table.
  - Autoscaling application servers behind a load balancer—any node can serve any user.
  - Lambda functions and containers that start fresh on each invocation by design.
related_concepts:
  - concept_availability
  - concept_fault_isolation
  - concept_horizontal_vertical_scaling
related_patterns:
  - pattern_load_balancer
  - pattern_api_gateway
  - pattern_cache_aside
tags:
  - scalability
  - architecture
  - fundamentals
estimated_read_time: 4
order: 18
---
Statelessness is not about avoiding state—it is about deciding where state lives. Moving state out of service instances and into dedicated stores separates the scaling concern (how many instances) from the persistence concern (how much data), letting each be addressed independently.
