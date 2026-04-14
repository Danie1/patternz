---
id: concept_availability
title: Availability
summary: The proportion of time a system can serve valid responses to requests.
definition: Availability measures whether a service remains reachable and returns non-error responses within expected behavior over time.
why_it_matters:
  - Directly affects user trust and business continuity.
  - Frames architecture decisions around redundancy and graceful degradation.
  - Helps teams prioritize failure handling over nominal throughput.
tradeoffs:
  - High availability improves user experience during failures.
  - Often adds infrastructure complexity and failover logic.
  - Aggressive availability goals can increase stale data or reduced feature modes.
examples:
  - Multi-instance APIs behind load balancing.
  - Read-only fallback modes during write path outages.
  - Regional failover for mission-critical services.
related_concepts:
  - concept_partition_tolerance
  - concept_fault_isolation
related_patterns:
  - pattern_load_balancer
  - pattern_circuit_breaker
  - pattern_rate_limiter
tags:
  - reliability
  - uptime
  - resilience
estimated_read_time: 4
order: 5
---
Availability is about staying useful under stress, not only being fast when everything is healthy.