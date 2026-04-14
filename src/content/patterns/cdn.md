---
id: pattern_cdn
title: CDN
summary: Serve static or cacheable content from edge locations near users.
category: Delivery
level: beginner
problem: Global users experience high latency and origin overload.
why_it_exists: Edge caching improves latency and absorbs repeat traffic.
when_to_use:
  - Global audiences
  - Static assets and cacheable API responses
when_not_to_use:
  - Highly personalized uncached responses
  - Internal tools with local users
tradeoffs:
  - Better performance with cache invalidation complexity
  - Reduced origin traffic but extra edge config
examples:
  - JS/CSS/image delivery
  - Cached read APIs
related_concepts:
  - concept_availability
  - concept_eventual_consistency
related_patterns:
  - pattern_cache_aside
  - pattern_load_balancer
related_scenarios:
  - scenario_url_shortener
tags:
  - performance
  - edge
  - latency
diagram_reference: edge_cache
quiz_ids:
  - quiz_pattern_fundamentals
order: 8
importance: 4
estimated_read_time: 5
complexity: low
best_for: Broadly distributed read traffic.
avoid_when: Payloads are private and uncacheable.
main_tradeoff: Speed versus cache complexity.
common_mistakes:
  - No cache-control strategy
  - Purge patterns not automated
---
CDNs are one of the easiest high-leverage wins for user-perceived performance.

## Diagram

```mermaid
flowchart LR
  U[Global users] --> E[Edge nodes]
  E --> O[Origin]
```
