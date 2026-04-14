---
id: concept_durability
title: Durability
summary: The guarantee that accepted data survives crashes and is not lost after acknowledgment.
definition: Durability means once a write is committed, it remains stored reliably even through process, node, or power failures.
why_it_matters:
  - Protects critical business data from silent loss.
  - Defines trust boundaries for acknowledgments and commits.
  - Informs backup, replication, and storage design choices.
tradeoffs:
  - Increases confidence in committed operations.
  - May add write latency from fsync, quorum, or replication confirmation.
  - Requires operational rigor around storage and recovery.
examples:
  - Database commits persisted to write-ahead logs.
  - Durable message queues that recover after broker restart.
  - Ledger systems with replicated commit acknowledgment.
related_concepts:
  - concept_strong_consistency
  - concept_delivery_guarantees
related_patterns:
  - pattern_queue
  - pattern_replication
  - pattern_event_driven
tags:
  - storage
  - reliability
  - data-safety
estimated_read_time: 4
order: 7
---
Durability is about trusted persistence, not just successful API responses.