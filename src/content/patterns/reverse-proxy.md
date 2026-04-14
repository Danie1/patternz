---
id: pattern_reverse_proxy
title: Reverse Proxy
summary: An intermediary server that accepts client requests and forwards them to backend services, centralizing cross-cutting concerns.
category: Networking
level: beginner
problem: Backend services expose raw infrastructure—they lack TLS termination, compression, request buffering, and a unified entry point for security policies.
why_it_exists: A reverse proxy sits in front of backends and handles cross-cutting concerns—TLS, caching, rate limiting, and routing—without modifying each service.
when_to_use:
  - Any production web service that must terminate TLS at the edge.
  - Systems that need request buffering to protect slow backends from fast clients.
  - Serving static assets from cache without hitting application servers.
  - Routing traffic to different backend versions (A/B, canary deploys) without client awareness.
when_not_to_use:
  - Purely internal service-to-service traffic on a private network where TLS offload is already handled.
  - Adding an unnecessary network hop to latency-sensitive paths with no cross-cutting requirements.
tradeoffs:
  - Centralizes security and routing logic but adds a network hop and requires its own reliability.
  - A single reverse proxy becomes a single point of failure unless itself made redundant.
  - Hides backend IP addresses from clients, which can complicate debugging and log correlation.
examples:
  - Nginx or Caddy terminating TLS and forwarding decrypted traffic to Node.js app servers.
  - HAProxy routing requests between blue and green deployment pools during a release.
  - Serving pre-compressed static bundles from reverse proxy cache before they reach the origin.
related_concepts:
  - concept_availability
  - concept_fault_isolation
  - concept_statelessness
related_patterns:
  - pattern_load_balancer
  - pattern_api_gateway
  - pattern_cdn
related_scenarios:
  - scenario_url_shortener
tags:
  - networking
  - security
  - edge
diagram_reference: reverse_proxy_flow
quiz_ids:
  - quiz_pattern_fundamentals
order: 11
importance: 4
estimated_read_time: 5
complexity: low
best_for: Any service needing TLS termination, compression, or a unified entry point for security.
avoid_when: Pure internal service mesh traffic already handled by a sidecar or service mesh.
main_tradeoff: Operational simplicity and security versus an additional network hop and availability dependency.
common_mistakes:
  - Running a single proxy instance without redundancy—the reverse proxy itself becomes the single point of failure.
  - Not enabling connection keepalive between proxy and backends, causing per-request TCP handshake overhead.
  - Misconfiguring forwarded headers (X-Forwarded-For, X-Real-IP), breaking IP-based rate limiting or audit logs.
---
A reverse proxy is the first layer of defense in production deployments. It decouples the client-facing contract (URL structure, TLS version, compression) from the backend implementation, letting both evolve independently.

## Diagram

```mermaid
flowchart LR
  C[Client] --> RP[Reverse Proxy]
  RP --> A[App Server 1]
  RP --> B[App Server 2]
  RP --> S[(Static Cache)]
```
