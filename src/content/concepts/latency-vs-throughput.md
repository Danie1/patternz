---
id: concept_latency_throughput
title: Latency vs Throughput
summary: Latency is how long one operation takes; throughput is how many operations complete per unit of time.
definition: Latency measures the delay from initiating a request to receiving a response. Throughput measures the rate of successful operations—requests per second, rows written per minute, etc. The two are related but optimizing one often degrades the other.
why_it_matters:
  - Most systems need to balance fast individual responses with high aggregate capacity.
  - Misframing the goal (optimizing average latency when p99 matters) causes poor production behavior.
  - Architectural choices like batching, queuing, and connection pooling directly trade latency for throughput.
tradeoffs:
  - Batching increases throughput but raises latency for individual items.
  - Tight synchronous call chains minimize latency but limit parallelism and throughput.
  - Caches reduce latency for common paths at the cost of write overhead and memory.
examples:
  - A real-time chat system optimizes for low latency; a bulk data export pipeline optimizes for throughput.
  - Connection pools sacrifice per-connection setup latency to raise overall query throughput.
  - A queue absorbs write bursts, accepting higher latency for producers in exchange for stable consumer throughput.
related_concepts:
  - concept_backpressure
  - concept_availability
related_patterns:
  - pattern_queue
  - pattern_cache_aside
  - pattern_load_balancer
tags:
  - performance
  - scalability
  - fundamentals
estimated_read_time: 4
order: 13
---
Latency and throughput are not the same metric. A system can have low latency with poor throughput if it processes requests one at a time very quickly, or high throughput with high latency if it batches aggressively. Understanding both—and which matters more for a given use case—is the starting point for every performance optimization decision.
