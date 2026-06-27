# Discharge Bridge Platform Overview

Source: discharge-bridge-media marketing platform overview.

## Summary

Discharge Bridge is a hospital discharge orchestration platform for hospital-to-post-acute transitions. It connects EMR workflows, payer coordination, and SNF networks through an interoperability and routing layer.

## Core infrastructure

- Google Cloud Run microservices
- Firestore multi-tenant data architecture
- Vertex AI advisory intelligence services
- HL7 and FHIR interoperability pipelines
- Firebase Authentication and Hosting
- AWS portability where scoped

Primary cloud environment:

- Project: bridgeview-vwsdz
- Region: us-central1

## Production model

Hospital EMR systems connect to an interoperability layer, then to a unified orchestrator API. The orchestrator routes work to the routing engine, prior authorization engine, pharmacy engine, and SNF finder service. Firestore provides the workflow data layer and the React portal provides hospital, SNF, and admin interfaces.

## Core services

The unified orchestrator coordinates inbound referrals, routing and matching logic, service orchestration, workflow state management, tenant isolation, authentication, event logging, and audit logging.

## Advisory intelligence

Vertex AI supports summarization, medication risk review, SNF capability matching support, readiness scoring, and payer documentation preparation. AI output is retained with audit context and deterministic workflow controls remain authoritative.

## Governance

- HIPAA-aligned design
- SOC 2 roadmap
- Customer data ownership
- RBAC and least privilege
- Automated feed validation
- Retention and purge policies
- TLS in transit and AES-256 at rest
- IAM service isolation
- Structured audit logging
- Multi-tenant logical isolation
