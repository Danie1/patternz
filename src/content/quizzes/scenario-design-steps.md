---
id: quiz_scenario_steps
title: Scenario Design Steps
related_pattern_ids:
  - pattern_queue
  - pattern_circuit_breaker
  - pattern_event_driven
related_scenario_ids:
  - scenario_chat_app
  - scenario_notification_service
difficulty: medium
questions:
  - id: q1
    prompt: A third-party provider is timing out and causing cascading latency. Best next step?
    type: scenario_step
    options:
      - Add circuit breaker with fallback response
      - Increase request timeout globally
      - Disable all retries permanently
    correct_answer: Add circuit breaker with fallback response
    explanation: A circuit breaker limits blast radius and enables graceful degradation.
    related_pattern_ids:
      - pattern_circuit_breaker
    hint: Protect upstream callers before tuning deeper behavior.
    difficulty: medium
  - id: q2
    prompt: Notification requests spike every hour and workers fall behind. Which change helps most?
    type: single_choice
    options:
      - Queue-based buffering with idempotent workers
      - More synchronous API calls to providers
      - Remove retry logic
    correct_answer: Queue-based buffering with idempotent workers
    explanation: Queues absorb bursts and allow controlled worker scaling.
    related_pattern_ids:
      - pattern_queue
    hint: Separate request intake from work execution.
    difficulty: medium
  - id: q3
    prompt: Event-driven systems mainly trade stronger decoupling for what challenge?
    type: single_choice
    options:
      - Harder observability and ordering complexity
      - Free consistency guarantees
      - Zero operational overhead
    correct_answer: Harder observability and ordering complexity
    explanation: Event workflows require robust tracing, contracts, and deduplication.
    related_pattern_ids:
      - pattern_event_driven
    hint: Think runtime behavior, not compile-time structure.
    difficulty: medium
---
This quiz checks sequencing judgment in realistic architecture incidents.
