---
id: pattern_active_passive_failover
title: Active-Passive Failover
summary: Keep a standby replica that takes over read and write traffic when the active node fails.
category: Reliability
level: intermediate
problem: A single active server is a single point of failure. Any hardware fault, software bug, or maintenance window removes the system from service entirely.
why_it_exists: Active-passive failover maintains a standby replica that continuously receives data from the active node. When the active fails, the standby is promoted and takes over, minimizing downtime without requiring the application to handle the failover itself.
when_to_use:
  - Stateful services (databases, leader-elected coordinators) that cannot be trivially horizontally scaled.
  - Systems with strict uptime SLAs where any prolonged outage has significant business impact.
  - Environments where DNS failover or health-check-based promotion is operationally manageable.
when_not_to_use:
  - Stateless services where simply running more instances behind a load balancer is sufficient.
  - Cost-sensitive environments where an idle passive node is wasteful and the workload can tolerate brief downtime.
  - Systems requiring write availability on both nodes simultaneously—use active-active instead.
tradeoffs:
  - Recovery time is short—promotion happens in seconds to minutes rather than requiring manual intervention.
  - The passive node is idle under normal operation, representing unused capacity.
  - A replication lag window means acknowledged writes may not yet be on the standby, risking small data loss during failover.
examples:
  - Amazon RDS Multi-AZ deployments—synchronous standby in a second availability zone with automatic promotion.
  - MySQL primary/replica with orchestration tools (MHA, Orchestrator) promoting the replica on primary failure.
  - Etcd and ZooKeeper use a similar leader-election model where a follower takes over if the leader stops sending heartbeats.
related_concepts:
  - concept_availability
  - concept_durability
  - concept_fault_isolation
related_patterns:
  - pattern_replication
  - pattern_load_balancer
  - pattern_circuit_breaker
related_scenarios:
  - scenario_url_shortener
  - scenario_notification_service
tags:
  - reliability
  - high-availability
  - databases
diagram_reference: failover_active_passive
quiz_ids:
  - quiz_tradeoff_judgment
order: 16
importance: 4
estimated_read_time: 5
complexity: medium
best_for: Stateful systems requiring automatic recovery from single-node failure without operator intervention.
avoid_when: Idle standby capacity is wasteful and brief downtime is acceptable.
main_tradeoff: Automatic recovery and simplicity versus wasted standby resources and potential small data loss.
common_mistakes:
  - Not testing failover regularly—the first time it runs in production is the worst time to discover it is broken.
  - Relying on replication lag as zero during normal operation—it rarely is, so promote-time data loss must be accounted for.
  - No split-brain prevention—if the old active node recovers and both nodes believe they are active, data divergence results.
---
Active-passive failover is deceptively simple to describe but subtle to operate. The standby must continuously replicate from the active, the promotion mechanism must be reliable, and the system must prevent the old active from accepting writes after failover—the split-brain problem. Test your failover path as frequently as your recovery time objective requires.

## Diagram

```mermaid
stateDiagram-v2
  [*] --> Active
  Active --> Passive: replication
  Active --> Failed: hardware or software fault
  Failed --> Promoting: health check timeout
  Promoting --> Passive: standby takes over
  Passive --> Active: promotion complete
```
