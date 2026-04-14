---
id: concept_strong_consistency
title: Strong Consistency
summary: A model where reads always reflect the latest committed write in a globally agreed order.
definition: Strong consistency guarantees that once a write is acknowledged, any subsequent read returns that latest value.
why_it_matters:
  - Simplifies reasoning for critical workflows that require immediate correctness.
  - Reduces subtle bugs in stateful business operations.
  - Supports invariant-heavy domains such as financial ledgers.
tradeoffs:
  - Provides predictable correctness behavior.
  - Usually increases latency due to coordination.
  - Can reduce availability under partitions or quorum loss.
examples:
  - Account balance checks after transfer commits.
  - Inventory reservation systems requiring exact counts.
  - Critical control-plane metadata stores.
related_concepts:
  - concept_eventual_consistency
  - concept_partition_tolerance
related_patterns:
  - pattern_replication
  - pattern_sharding
  - pattern_api_gateway
tags:
  - consistency
  - correctness
  - coordination
estimated_read_time: 4
order: 3
---
Strong consistency prioritizes immediate correctness over coordination cost.