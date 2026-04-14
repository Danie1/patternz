---
id: concept_partition_tolerance
title: Partition Tolerance
summary: The ability of a distributed system to continue operating despite network communication failures between nodes.
definition: Partition tolerance means the system can keep making progress when parts of the network cannot communicate reliably.
why_it_matters:
  - Network faults are unavoidable in distributed systems.
  - Forces explicit choices between strict consistency and availability under failure.
  - Prevents architectures that assume perfect connectivity.
tradeoffs:
  - Improves resilience to real-world network faults.
  - Can require fallback behavior and temporary inconsistency.
  - Increases design complexity in coordination-heavy workflows.
examples:
  - Regional service partitions during cloud routing incidents.
  - Message delivery continuing in one zone while another is isolated.
  - Replica sets operating with quorum degradation behavior.
related_concepts:
  - concept_availability
  - concept_strong_consistency
related_patterns:
  - pattern_replication
  - pattern_event_driven
  - pattern_queue
tags:
  - distributed-systems
  - networking
  - reliability
estimated_read_time: 4
order: 6
---
Partition tolerance is a baseline assumption for distributed architecture, not an optional feature.