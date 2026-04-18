---
id: scenario_social_feed
title: Social Feed
summary: Design a personalized activity feed that delivers posts from followed accounts at low latency for millions of users.
level: advanced
system_type: Content delivery / Social platform
core_problem: Generate and serve a personalized, chronologically ordered feed of posts for each user based on who they follow, at low read latency under high concurrent load.
functional_requirements:
  - Users can follow and unfollow other users.
  - The feed displays the most recent posts from followed accounts.
  - Users can post text, images, and links.
  - Feed supports infinite scroll with cursor-based pagination.
non_functional_requirements:
  - Feed reads should return within 200 ms at the 99th percentile.
  - The system should support at least 100 million daily active users.
  - Writes (new posts) should be durable and not lost.
  - The feed can be eventually consistent—a post appearing seconds late is acceptable.
initial_design: A single application server reads the list of accounts a user follows, fetches recent posts for each, merges and sorts them by timestamp, and returns the result. This approach works at small scale but degrades quickly—it performs fan-out on read, issuing O(following_count) database queries per feed request.
design_steps:
  - "Identify the core bottleneck: fan-out on read requires one query per followed account, making latency proportional to follow count. For users following thousands of accounts, this is too slow."
  - "Introduce fan-out on write (push model): when a user posts, a background worker writes the post ID into a pre-computed feed list for every follower. Feed reads then become a single sorted-set lookup per user."
  - "Store pre-computed feed lists in Redis sorted sets keyed by user ID, with post timestamp as the score. Feed reads are O(1) lookups with cursor-based pagination."
  - "Handle celebrity accounts (high-follower outliers) with a hybrid model: celebrities use pull (fan-out on read) since writing to millions of follower feeds per post is too expensive; regular accounts use push."
  - "Use an event queue (Kafka or SQS) to decouple post creation from fan-out workers, providing backpressure and retry semantics if fan-out lags."
  - "Store post content and media in object storage (S3) behind a CDN. Feed entries reference content IDs—only the feed list itself lives in Redis."
  - "Add a database replica for the follow-graph queries needed during hybrid fan-out, isolating read load from the write primary."
  - "Paginate the feed using cursor tokens (last-seen post timestamp) rather than OFFSET, since OFFSET degrades at depth."
concept_links:
  - concept_availability
  - concept_eventual_consistency
  - concept_backpressure
  - concept_delivery_guarantees
  - concept_causal_consistency
  - concept_latency_throughput
architecture_variants:
  - Pure fan-out on write (push) for all users—simple reads but infeasible for high-follower accounts.
  - Pure fan-out on read (pull) for all users—consistent but read latency grows with follow count.
  - Hybrid model—push for regular users, pull merged at read time for celebrity accounts.
related_patterns:
  - pattern_queue
  - pattern_cache_aside
  - pattern_cdn
  - pattern_event_driven
  - pattern_replication
quiz_ids:
  - quiz_scenario_steps
  - quiz_tradeoff_judgment
estimated_time: 45
difficulty: hard
---
Designing a social feed surfaces one of the most instructive tradeoffs in distributed systems—fan-out on read versus fan-out on write. Neither extreme works universally; the production answer is nearly always a hybrid that handles the celebrity problem differently from regular accounts.

## Diagram

```mermaid
flowchart TD
  U[User posts] --> Q[(Event Queue)]
  Q --> FW[Fan-out Workers]
  FW --> F[(Feed Cache\nRedis sorted sets)]
  FW --> DB[(Post Store)]
  R[Reader] --> F
  F -->|cache miss| DB
```
