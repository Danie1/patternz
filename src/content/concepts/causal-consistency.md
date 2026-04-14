---
id: concept_causal_consistency
title: Causal Consistency
summary: A model preserving cause-and-effect ordering while allowing unrelated operations to proceed independently.
definition: Causal consistency ensures that if one operation depends on another, all observers see them in that causal order, even if total global ordering is relaxed.
why_it_matters:
  - Matches user expectations in collaborative and messaging workflows.
  - Offers stronger semantics than eventual consistency with less cost than strict global ordering.
  - Helps avoid confusing read timelines where replies appear before original actions.
tradeoffs:
  - Preserves meaningful ordering constraints without full serialization.
  - Requires metadata to track causal dependencies.
  - Still allows divergence for concurrent unrelated updates.
examples:
  - Chat threads where replies should follow parent messages.
  - Collaborative document edits with dependency tracking.
  - Comment systems with threaded ordering semantics.
related_concepts:
  - concept_eventual_consistency
  - concept_strong_consistency
related_patterns:
  - pattern_event_driven
  - pattern_queue
  - pattern_replication
tags:
  - consistency
  - ordering
  - collaboration
estimated_read_time: 5
order: 4
---
Causal consistency protects cause-and-effect relationships without forcing a single global timeline.