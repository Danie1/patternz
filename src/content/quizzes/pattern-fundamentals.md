---
id: quiz_pattern_fundamentals
title: Pattern Fundamentals
related_pattern_ids:
  - pattern_cache_aside
  - pattern_load_balancer
  - pattern_cdn
related_scenario_ids:
  - scenario_url_shortener
difficulty: easy
questions:
  - id: q1
    prompt: Your redirect endpoint is read-heavy and repetitive. Which pattern gives immediate value?
    type: single_choice
    options:
      - Cache-aside
      - Sharding
      - Event-driven architecture
    correct_answer: Cache-aside
    explanation: Cache-aside reduces repeated database reads for hot keys.
    related_pattern_ids:
      - pattern_cache_aside
    hint: Think about repeated reads with acceptable staleness.
    difficulty: easy
  - id: q2
    prompt: Why place a CDN in front of static assets?
    type: true_false
    options:
      - To reduce latency by serving from edge locations
      - To enforce database consistency
    correct_answer: To reduce latency by serving from edge locations
    explanation: CDNs reduce geographic round-trip distance and origin load.
    related_pattern_ids:
      - pattern_cdn
    hint: Focus on user-perceived speed globally.
    difficulty: easy
  - id: q3
    prompt: Which tradeoff appears when adding a load balancer?
    type: single_choice
    options:
      - Better resilience but additional infrastructure to run
      - Lower cost with no new complexity
      - Guaranteed zero downtime forever
    correct_answer: Better resilience but additional infrastructure to run
    explanation: Load balancing improves availability and scale while adding operational layers.
    related_pattern_ids:
      - pattern_load_balancer
    hint: Most reliability patterns add operational responsibility.
    difficulty: easy
---
A short quiz to test first-principles understanding of common foundation patterns.
