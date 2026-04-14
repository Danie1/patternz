---
id: pattern_database_federation
title: Database Federation
summary: Split a monolithic database into multiple smaller databases, each owning a distinct functional domain.
category: Data Platform
level: advanced
problem: A single shared database becomes a bottleneck as the system grows—schema changes from one team affect others, slow queries in one domain degrade unrelated ones, and a single failure takes down all features.
why_it_exists: Federation partitions the database by business domain (users, orders, inventory), so each domain has its own schema, connection pool, and failure boundary. Teams can evolve, scale, and deploy their data stores independently.
when_to_use:
  - Teams have clear domain ownership and rarely need to join data across domain boundaries.
  - One domain's write load or schema churn would otherwise affect unrelated domains.
  - The system is migrating from a monolith toward domain-oriented or microservice ownership.
when_not_to_use:
  - The application requires frequent cross-domain joins—federation forces those joins into application code.
  - Small systems where the operational overhead of multiple databases outweighs the isolation benefit.
  - Domains are not yet stable—refactoring federation boundaries is costly.
tradeoffs:
  - Each database can be sized, tuned, and replaced for its domain's access patterns independently.
  - Cross-domain queries become application-level joins, trading SQL simplicity for deployment independence.
  - Referential integrity across domains can no longer be enforced by the database engine.
examples:
  - An e-commerce system with separate databases for users, product catalog, and order history.
  - A SaaS platform where the analytics database is read-replica-heavy while the transactional database is write-heavy.
  - Migrating a shared PostgreSQL cluster to domain-specific schemas owned by separate microservices.
related_concepts:
  - concept_coupling_and_cohesion
  - concept_availability
  - concept_strong_consistency
related_patterns:
  - pattern_sharding
  - pattern_api_gateway
related_scenarios:
  - scenario_url_shortener
tags:
  - databases
  - architecture
  - scalability
diagram_reference: federation_split
quiz_ids:
  - quiz_tradeoff_judgment
order: 14
importance: 3
estimated_read_time: 6
complexity: high
best_for: Domain-oriented architectures with clear ownership boundaries and low cross-domain join requirements.
avoid_when: Cross-domain queries are frequent or domain boundaries are not yet stable.
main_tradeoff: Domain isolation and independent scalability versus loss of cross-domain referential integrity and join simplicity.
common_mistakes:
  - Defining federation boundaries before domain boundaries are stable, requiring expensive re-migrations.
  - Not handling distributed transactions—operations that previously relied on database-level atomicity now need saga or two-phase commit.
  - Ignoring connection pool management—N federated databases means N connection pools to configure and monitor.
---
Federation forces you to make implicit coupling in a monolithic database explicit. That visibility is valuable—but the cost is that every place you previously relied on a SQL join across domains now becomes an application-side aggregation or an event-driven eventual consistency story.

## Diagram

```mermaid
flowchart LR
  A[App] --> U[(Users DB)]
  A --> O[(Orders DB)]
  A --> P[(Products DB)]
```
