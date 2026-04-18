---
id: concept_cap_theorem
title: CAP Theorem
summary: A distributed system can guarantee at most two of three properties—Consistency, Availability, and Partition Tolerance—simultaneously.
definition: CAP theorem states that in the presence of a network partition, a distributed system must choose between consistency (every read reflects the latest write) and availability (every request receives a response). Because network partitions are unavoidable in real distributed systems, the practical choice is between CP (sacrifice availability during a partition) and AP (sacrifice consistency during a partition).
why_it_matters:
  - Forces explicit architectural decisions about acceptable behavior under failure.
  - Explains why distributed databases have fundamentally different consistency models.
  - Guides technology selection—choosing between systems like Cassandra (AP) vs HBase or Zookeeper (CP).
tradeoffs:
  - CP systems return errors or become read-only during partitions to preserve data correctness.
  - AP systems serve possibly stale data during partitions to stay reachable.
  - PACELC extends CAP to also describe the latency-consistency tradeoff in the normal (no-partition) case.
examples:
  - Cassandra and DynamoDB favor AP—they stay available and use eventual consistency.
  - HBase and Zookeeper favor CP—they block or reject writes if the cluster cannot maintain quorum.
  - A distributed lock service must be CP to avoid split-brain.
related_concepts:
  - concept_availability
  - concept_partition_tolerance
  - concept_eventual_consistency
  - concept_strong_consistency
depends_on_concepts:
  - concept_availability
  - concept_partition_tolerance
related_to_concepts:
  - concept_eventual_consistency
  - concept_strong_consistency
related_patterns:
  - pattern_replication
  - pattern_sharding
tags:
  - distributed-systems
  - consistency
  - fundamentals
estimated_read_time: 5
order: 14
---
CAP theorem is not a design decision you make once—it describes a constraint that is always in effect. Every distributed data system implicitly chooses a side. Knowing which side your dependencies choose lets you reason correctly about the failure modes your application inherits.
