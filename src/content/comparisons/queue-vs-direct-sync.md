---
id: comparison_queue_vs_sync
title: Queue vs Direct Synchronous Processing
summary: Understand when async queues improve reliability and when direct calls keep systems simpler.
compared_options:
  - Queue-based async
  - Direct synchronous
dimensions:
  - name: User response latency
    option_scores:
      Queue-based async: Fast acknowledgment, delayed completion
      Direct synchronous: Immediate completion path, higher tail risk
  - name: Failure tolerance
    option_scores:
      Queue-based async: Strong with retries and DLQ
      Direct synchronous: Sensitive to downstream failures
  - name: Operational complexity
    option_scores:
      Queue-based async: Higher due to workers and retries
      Direct synchronous: Lower infrastructure burden
  - name: Throughput under bursts
    option_scores:
      Queue-based async: Better smoothing and backpressure
      Direct synchronous: Prone to spikes and timeouts
recommended_when:
  - Choose queue-based async for non-blocking tasks and bursty traffic.
  - Choose direct sync for simple, user-critical operations requiring immediate confirmation.
anti_patterns:
  - Using sync calls for long-running external integrations
  - Introducing queues without idempotent consumers
related_patterns:
  - pattern_queue
  - pattern_circuit_breaker
related_scenarios:
  - scenario_notification_service
  - scenario_url_shortener
examples:
  - Notification pipelines use queues
  - Payment authorization often stays synchronous
---
This comparison helps juniors distinguish user-facing latency from system completion latency.

## Diagram

```mermaid
flowchart LR
  Req[Client Request] --> D{Processing mode}
  D -->|Direct sync| Svc[Service + Provider Call]
  D -->|Queue async| Q[(Queue)]
  Q --> W[Worker]
```
