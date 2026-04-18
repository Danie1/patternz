---
id: scenario_url_shortener
title: URL Shortener
summary: Design a short-link service that balances low latency, high read traffic, and simple operations.
level: beginner
system_type: Web backend
core_problem: Resolve short codes quickly while keeping redirects reliable and abuse-resistant.
functional_requirements:
  - Create short links for long URLs
  - Redirect short links quickly
  - Optional expiration support
non_functional_requirements:
  - P95 redirect latency below 60ms
  - High availability for read path
  - Abuse controls for link creation
initial_design: Single API service with relational database and basic caching.
design_steps:
  - Start with synchronous create and read endpoints
  - Add cache-aside for hot redirect keys
  - Add CDN for global edge acceleration
  - Add rate limiter for creation endpoints
concept_links:
  - concept_availability
  - concept_eventual_consistency
  - concept_strong_consistency
architecture_variants:
  - Strong consistency redirect reads from DB only
  - Higher performance redirect reads from cache + replica
related_patterns:
  - pattern_cache_aside
  - pattern_cdn
  - pattern_rate_limiter
quiz_ids:
  - quiz_pattern_fundamentals
estimated_time: 18
difficulty: easy
---
This scenario helps juniors reason about read-heavy systems where simple tradeoffs around caching and consistency matter.

## Diagram

```mermaid
flowchart LR
  User --> Edge[CDN Edge]
  Edge --> API[Shortener API]
  API --> Cache[(Cache)]
  API --> DB[(Primary DB)]
```
