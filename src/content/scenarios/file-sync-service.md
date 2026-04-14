---
id: scenario_file_sync_service
title: File Sync Service
summary: Design a service that keeps files synchronized across a user's devices with conflict detection, versioning, and efficient transfer.
level: intermediate
system_type: Cloud storage / Sync
core_problem: Detect file changes on any device, transfer only the changed portions efficiently, persist versions reliably, and resolve conflicts when the same file is edited on multiple devices simultaneously.
functional_requirements:
  - Users can upload files from any device and have them appear on all other devices.
  - The service stores historical versions of each file and allows rollback.
  - File deletions propagate to all devices.
  - Files can be shared with other users with read or write permissions.
non_functional_requirements:
  - Uploads and syncs should transfer only changed chunks, not entire files (delta sync).
  - File metadata operations should complete within 100 ms.
  - Files must be stored durably—zero acceptable data loss after upload acknowledgment.
  - The service should support at least 100 million users with average file sizes up to several GB.
initial_design: A simple service accepts file uploads, stores them in a database, and returns a file list on request. All connected devices poll for changes periodically. This is inefficient—whole-file transfers waste bandwidth, polling misses changes between intervals, and no conflict detection exists.
design_steps:
  - "Split files into fixed-size content-addressable chunks (4–8 MB). Compute a SHA-256 hash for each chunk. Before uploading, the client sends the list of chunk hashes to the server; the server returns which chunks it already has, so only missing chunks are transferred."
  - "Store chunks in object storage (S3 or equivalent) keyed by content hash. Identical content across different files or versions shares the same chunks automatically (client-side deduplication)."
  - "Maintain a metadata database (relational or document store) that maps file paths to their ordered list of chunk hashes, along with version timestamps, device IDs, and user IDs."
  - "Replace polling with a long-poll or WebSocket notification channel. When a file changes on Device A, the server pushes a change notification to all other connected devices, which then sync the updated metadata and fetch missing chunks."
  - "Model versions as immutable snapshots—each version is a list of chunk hashes at a point in time. Restoring a version means updating the file's current chunk list pointer, not copying data."
  - "Detect conflicts by comparing the base version the client last synced with the current server version. If both diverged (two edits from different devices since the common ancestor), create a conflict copy rather than silently overwriting."
  - "Front object storage with a CDN for download performance—chunks are immutable and content-addressed, making them ideal CDN candidates."
  - "Use a message queue to decouple upload processing from sync notification—chunk store confirmation publishes an event, a worker updates metadata and sends device notifications."
concept_links:
  - concept_durability
  - concept_strong_consistency
  - concept_availability
  - concept_idempotency
  - concept_delivery_guarantees
architecture_variants:
  - Block-level deduplication (here) versus whole-file deduplication (simpler but less efficient for large files).
  - Centralized metadata store versus distributed metadata with eventual consistency (trading simplicity for scale).
  - Full version history versus configurable retention window (storage cost vs rollback depth).
related_patterns:
  - pattern_queue
  - pattern_replication
  - pattern_cdn
  - pattern_cache_aside
  - pattern_event_driven
quiz_ids:
  - quiz_scenario_steps
  - quiz_tradeoff_judgment
estimated_time: 40
difficulty: medium
related_comparisons:
  - comparison_monolith_vs_microservices
---
A file sync service is a practical exercise in making distributed state consistent across devices. The chunk-based design solves bandwidth efficiency; the metadata database solves versioning; the notification channel solves polling; and conflict detection solves concurrent edits. Each piece is independently addressable, but they only work reliably together.

## Diagram

```mermaid
flowchart TD
  D1[Device A] -->|chunk upload| CS[(Chunk Store\nObject Storage)]
  D1 -->|metadata update| MD[(Metadata DB)]
  MD --> N[Notification Service]
  N --> D2[Device B]
  D2 -->|fetch missing chunks| CS
  CS --> CDN[CDN]
  CDN --> D2
```
