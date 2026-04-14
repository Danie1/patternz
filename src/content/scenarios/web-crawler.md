---
id: scenario_web_crawler
title: Web Crawler
summary: Design a scalable system that continuously discovers, fetches, and indexes pages across the web.
level: advanced
system_type: Data processing / Indexing
core_problem: Crawl a continuously changing web at scale, discover new and updated pages efficiently, avoid duplicate processing, respect crawl policies, and feed clean data to a downstream search index.
functional_requirements:
  - Given a set of seed URLs, discover and fetch pages via link extraction.
  - Respect robots.txt exclusion rules and crawl-delay directives.
  - Store fetched page content and metadata for downstream indexing.
  - Periodically re-crawl pages to detect updates.
non_functional_requirements:
  - Crawl rate should be tunable per domain to avoid overwhelming target servers.
  - The system should handle at least 1 billion unique URLs.
  - Duplicate URLs should not be fetched more than once per crawl cycle.
  - The crawler must be horizontally scalable—adding workers should increase throughput linearly.
initial_design: A single process reads a queue of URLs, fetches each page, extracts links, and writes new links back to the queue. This works for toy crawls but fails at scale due to a single-threaded bottleneck, no deduplication, and no domain-level rate limiting.
design_steps:
  - "Build a URL frontier: a distributed priority queue (Kafka, Redis sorted set, or a purpose-built store) that holds discovered URLs ranked by priority (recency, PageRank estimate) and scheduled crawl time."
  - "Implement a URL seen-set using a large Bloom filter or a distributed key-value store to mark already-enqueued URLs. Before inserting a discovered link, check the seen-set to avoid duplicates."
  - "Deploy a pool of crawler workers that pull URLs from the frontier, respect a per-domain rate limiter, and isolate each domain to a dedicated worker slot to enforce crawl-delay."
  - "Fetch robots.txt for each domain on first contact and cache the result. Workers check the exclusion rules before fetching any page in that domain."
  - "After fetching a page, extract links using an HTML parser, normalize URLs (strip fragments, canonicalize), and push new URLs to the frontier via the seen-set check."
  - "Store raw HTML content in object storage (S3) with metadata (fetch timestamp, status code, content hash) in a database. A separate indexing pipeline reads from object storage asynchronously."
  - "Detect stale or changed content using a content hash comparison against the previous crawl. Pages with no content change can be skipped during indexing."
  - "Shard the URL frontier by domain hash so that workers responsible for a domain cluster together, simplifying rate-limit enforcement and connection reuse."
concept_links:
  - concept_availability
  - concept_delivery_guarantees
  - concept_idempotency
  - concept_backpressure
  - concept_latency_throughput
architecture_variants:
  - Centralized frontier with distributed workers (simpler coordination, frontier becomes a bottleneck at extreme scale).
  - Fully distributed frontier where each worker manages its own URL set partitioned by domain hash.
  - Priority crawl that focuses on recently updated or high-authority domains before low-value pages.
related_patterns:
  - pattern_queue
  - pattern_sharding
  - pattern_rate_limiter
  - pattern_replication
quiz_ids:
  - quiz_scenario_steps
  - quiz_tradeoff_judgment
estimated_time: 45
difficulty: hard
related_comparisons:
  - comparison_queue_vs_direct_sync
---
A web crawler is a distributed systems problem disguised as a networking task. The hard parts are deduplication at scale, polite crawling that does not abuse target servers, and the URL frontier design that determines which pages get crawled first. Getting those three right defines the difference between a toy and a production crawler.

## Diagram

```mermaid
flowchart TD
  S[Seed URLs] --> F[(URL Frontier)]
  F --> W1[Crawler Worker]
  F --> W2[Crawler Worker]
  W1 --> P[HTML Parser]
  W2 --> P
  P --> SF{In seen-set?}
  SF -->|No| F
  SF -->|Yes| X[Discard]
  W1 --> ST[(Page Store)]
  W2 --> ST
  ST --> I[Indexer]
```
