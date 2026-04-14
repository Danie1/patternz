---
id: concept_acid
title: ACID Transactions
summary: A set of guarantees—Atomicity, Consistency, Isolation, Durability—that ensure database operations behave correctly even under failure or concurrency.
definition: ACID is a set of properties that relational databases provide for transactions. Atomicity ensures all steps in a transaction succeed or none do. Consistency ensures only valid data is written according to defined rules. Isolation ensures concurrent transactions produce the same result as if they ran sequentially. Durability ensures committed writes survive crashes.
why_it_matters:
  - Critical for correctness in financial, order management, and inventory systems.
  - Defines the contract that application code can rely on from the database layer.
  - Helps distinguish when a relational database with ACID guarantees is necessary versus a NoSQL store with weaker guarantees.
tradeoffs:
  - Full ACID compliance reduces write throughput due to locking, logging, and synchronous persistence.
  - Distributed ACID (2PC) adds significant latency and coordination complexity across nodes.
  - Many NoSQL systems sacrifice ACID for throughput and partition tolerance, requiring the application to handle correctness.
examples:
  - Transferring money between bank accounts—both debit and credit must succeed or neither should.
  - E-commerce checkout—inventory decrement and order creation must be atomic.
  - Relaxing isolation to Read Committed (vs Serializable) is a common throughput-consistency tradeoff in OLTP systems.
related_concepts:
  - concept_durability
  - concept_strong_consistency
  - concept_eventual_consistency
related_patterns:
  - pattern_replication
  - pattern_sharding
tags:
  - databases
  - consistency
  - transactions
estimated_read_time: 5
order: 15
---
ACID guarantees are often taken for granted when using relational databases. The cost of those guarantees only becomes visible at scale—when the serialization overhead of full isolation or the synchrony of durable writes becomes the bottleneck. Understanding ACID helps you decide when to relax guarantees deliberately and what application-level compensations are then required.
