---
id: concept_idempotency
title: Idempotency
summary: Repeating the same operation with the same intent produces the same outcome as doing it once.
definition: Idempotency is a property where duplicate requests do not create duplicate side effects, which is critical when retries or redelivery can occur.
why_it_matters:
  - Prevents duplicate charges, emails, or state transitions during retries.
  - Makes distributed workflows safer under network timeouts and unknown outcomes.
  - Reduces operational incidents caused by repeated delivery.
tradeoffs:
  - Improves reliability of retry-heavy systems.
  - Requires stable request identity and deduplication storage.
  - Incorrect key design can block valid distinct operations.
examples:
  - Payment APIs keyed by idempotency token.
  - Message consumers that ignore already-processed event IDs.
  - Job runners that guard completion writes with unique constraints.
related_concepts:
  - concept_retry_semantics
  - concept_delivery_guarantees
related_patterns:
  - pattern_queue
  - pattern_event_driven
  - pattern_api_gateway
tags:
  - reliability
  - retries
  - messaging
estimated_read_time: 4
order: 2
---
Idempotency is a behavioral guarantee that stays useful regardless of transport or framework choices.