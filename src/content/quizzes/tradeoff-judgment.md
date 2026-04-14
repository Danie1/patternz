---
id: quiz_tradeoff_judgment
title: Tradeoff Judgment
related_pattern_ids:
  - pattern_api_gateway
  - pattern_replication
  - pattern_rate_limiter
related_scenario_ids:
  - scenario_notification_service
difficulty: hard
questions:
  - id: q1
    prompt: Your read replica lags by 2 seconds. A workflow requires immediate post-write correctness. What should you do?
    type: single_choice
    options:
      - Route that read path to primary
      - Increase cache TTL
      - Add more replicas only
    correct_answer: Route that read path to primary
    explanation: Critical read-after-write flows should avoid lagging replicas.
    related_pattern_ids:
      - pattern_replication
    hint: Match consistency requirements to read path.
    difficulty: hard
  - id: q2
    prompt: When is an API gateway likely overkill?
    type: single_choice
    options:
      - Single-service product with one client and simple auth
      - Multi-team platform with many clients
      - Need central quota policy
    correct_answer: Single-service product with one client and simple auth
    explanation: Gateway value grows with cross-cutting policy complexity and service count.
    related_pattern_ids:
      - pattern_api_gateway
    hint: Assess scale of API governance need.
    difficulty: medium
  - id: q3
    prompt: Select all true statements about rate limiting.
    type: multiple_choice
    options:
      - It protects downstream systems from abusive bursts
      - It can introduce user friction if poorly tuned
      - It removes all need for capacity planning
    correct_answer:
      - It protects downstream systems from abusive bursts
      - It can introduce user friction if poorly tuned
    explanation: Rate limits improve fairness and stability, but do not replace capacity planning.
    related_pattern_ids:
      - pattern_rate_limiter
    hint: Look for both system and user impacts.
    difficulty: hard
---
This quiz focuses on judgment calls where requirements conflict.
