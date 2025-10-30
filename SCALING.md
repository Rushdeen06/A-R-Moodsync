# A&R MoodSync Scaling & Production Readiness Guide

This document lays out the practical, incremental steps to evolve A&R MoodSync from a single-user prototype into a secure, observable, multi-tenant, resilient production platform.

---
## 1. Architecture Overview (Current vs Target)

| Layer | Current State | Target (Phase 3+) |
|-------|---------------|--------------------|
| Frontend | Vite React SPA served via GitHub Pages | CDN + Edge cached static assets (Cloudflare / Fastly) + Optional SSR/ISR for marketing pages |
| Backend | Single Express instance, in-memory stores, optional Supabase | Containerized API (Express / Fastify) behind Load Balancer, horizontal autoscale |
| Data | In-memory + Supabase (optional) | Dedicated Postgres (Supabase managed or RDS) with schema migrations, Redis cache |
| Auth | Demo users + Supabase tokens | Central auth & org membership (Supabase or Auth0) + Role-Based Access Control + Feature flags |
| Observability | Console logs only | Structured logs (Pino), metrics (Prometheus), tracing (OpenTelemetry) |
| Deployment | Manual builds & gh-pages | CI/CD (GitHub Actions) -> staging & production environments |

---
## 2. Phased Scaling Roadmap

### Phase 1 – Hardening (Now → 2 weeks)
1. Add security middlewares (helmet, rate limiting, compression) ✅ (implemented in this patch)
2. Centralize configuration (env validation, single config file)
3. Replace in-memory stores with Supabase/Postgres tables (`mood_entries`, `user_settings`)
4. Introduce structured logging (pino) ✅ (implemented)
5. Separate health endpoints: `/health/live` & `/health/ready`
6. Add basic request metrics & 95th percentile latency tracking

### Phase 2 – Reliability & Multi-Tenancy (Weeks 3–6)
1. Introduce `organizations` and `memberships` tables
2. Add `org_id` to mood entries for scoped queries
3. Implement soft deletion + audit fields (`created_at`, `updated_at`, `deleted_at`)
4. Move secrets to secure store (GitHub Actions secrets / Vault)
5. Add background job queue (BullMQ + Redis) for digest emails & weekly reports
6. Add rate-based burnout anomaly detector (scheduled job)

### Phase 3 – Scale & Performance (Weeks 6–12)
1. Containerize (Docker) + deploy on Fly.io / Render / AWS ECS
2. Introduce Redis caching for frequent aggregate queries (weekly stats, wellbeing score)
3. Implement horizontal autoscaling triggers (CPU + response time)
4. Add global CDN + asset versioning + prefetch critical chunks
5. Add OpenTelemetry tracing (user journey: mood log → analytics update)
6. Performance budget (JS bundle ≤ 150KB gzip initial load)

### Phase 4 – Enterprise & Observability (Months 3–6)
1. SLOs: 99.9% uptime, API p95 response < 350ms
2. Full audit logging (mood edit/delete, admin access)
3. Feature flags (LaunchDarkly or simple DB-based rollout)
4. Privacy posture (support data export & right-to-erasure endpoints)
5. Advanced anomaly detection (rolling z-scores / ML model)

---
## 3. Key Data Model (Target)

```sql
-- moods
CREATE TABLE mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  org_id UUID REFERENCES organizations(id),
  mood TEXT NOT NULL CHECK (mood IN ('great','good','okay','low','very-low')),
  intensity SMALLINT NOT NULL CHECK (intensity BETWEEN 1 AND 5),
  note TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX ON mood_entries (org_id, timestamp DESC);
CREATE INDEX ON mood_entries (user_id, timestamp DESC);
```

Add supporting tables: `organizations`, `team_memberships`, `weekly_digests`, `interventions`, `anonymous_feedback`.

---
## 4. Backend Enhancements

| Concern | Action | Tooling |
|---------|--------|---------|
| Logging | Use Pino for structured JSON logs | pino-pretty in dev |
| Metrics | Expose `/metrics` (Prometheus format) | prom-client |
| Health | Split liveness & readiness endpoints | `/health/live`, `/health/ready` |
| Security | helmet + rate limiting + input validation (zod) | express-rate-limit |
| Performance | gzip / brotli compression + long-lived static asset caching | compression middleware |
| Graceful shutdown | Drain connections with 30–60s timeout | server.close & inflight tracking |

---
## 5. Frontend Performance & UX
1. Code splitting already via lazy imports – audit chunk sizes (`MobileAnalytics` ~ large). Defer heavy analytics until interaction.
2. Preload critical font & CSS.
3. Use service worker for offline & break reminder reliability.
4. Add a lightweight state layer (Zustand/Redux) for multi-tab consistency.
5. Introduce skeleton loading & optimistic mood entry.

Bundle improvement quick wins:
| Item | Current | Target |
|------|---------|--------|
| Main JS | ~94KB gzip | <70KB gzip |
| Analytics | ~374KB (lazy) | Reduce by removing unused charts, dynamic imports of heavy libs |
| CSS | 35KB | <25KB (purge unused styles) |

---
## 6. Deployment & Environments
| Env | Purpose | Differs By |
|-----|---------|------------|
| Dev (local) | Fast iteration | Mock data, verbose logging |
| Staging | Pre-prod validation | Real schema, sample orgs, obfuscated user data |
| Production | Real users | Full observability, security policies |

CI/CD Pipeline (GitHub Actions):
1. Lint + Type check.
2. Run unit & integration tests.
3. Build front + back.
4. Run e2e (Playwright) against ephemeral preview.
5. Scan dependencies (npm audit / osv-scanner).
6. Deploy on push to `main` (after approvals for protected branches).

---
## 7. Observability Stack
| Layer | Tool |
|-------|------|
| Logs | Pino → Logtail / Datadog / ELK |
| Metrics | prom-client → Prometheus → Grafana |
| Traces | OpenTelemetry SDK → Tempo / Jaeger |
| Alerts | PagerDuty / Opsgenie (latency, error rate, saturation) |

Core Metrics:
- request_count{route,method}
- request_duration_seconds_bucket
- mood_entries_created_total
- burnout_risk_high_total
- active_sessions_gauge

Error budget alerts: if p95 latency > 350ms for 10 consecutive minutes or error rate > 2%.

---
## 8. Security & Privacy
1. **Headers**: helmet sets HSTS, X-Frame-Options, Content-Security-Policy.
2. **Rate Limiting**: Global + per-IP adaptive (start simple, refine later).
3. **Input Validation**: zod schemas for POST bodies.
4. **Secret Management**: No secrets in repo; use `.env` only locally; CI pulls from encrypted store.
5. **PII Minimization**: Store only needed fields; separate emotional notes from identifying info.
6. **Access Logs**: Log user id + org id + action for privileged operations.
7. **GDPR**: Implement endpoints for data export (`/api/users/:id/export`) & erasure (`/api/users/:id/delete`).

---
## 9. Capacity Planning (Baseline Targets)
Assume initial org size: 200 users, 5 mood entries/day/user.

| Metric | Estimate | Notes |
|--------|----------|-------|
| Requests/day | ~5,000–7,000 | mood posts + dashboard fetches |
| Peak RPS | ~8–12 | Morning check-in bursts |
| DB size (Year 1) | <5GB | Mood entries + feedback + metadata |
| Cache hit goal | >60% | Weekly digest & wellbeing score reused |

Scale trigger: if p95 latency > 300ms at 50% CPU utilize horizontal scale (add instance). If cache hit <50%, tune Redis TTL & key strategy.

---
## 10. Background Jobs & Queues
Use BullMQ (Redis) for:
1. Weekly digest generation.
2. Burnout risk recalculation.
3. Quiet hour anomaly alerts.
4. CSV export packaging.

Retry strategy: exponential backoff (1m, 5m, 30m) with dead-letter queue for investigation.

---
## 11. Feature Flag Strategy
Simple initial approach:
```sql
CREATE TABLE feature_flags (
  key TEXT PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  rollout_percentage INT DEFAULT 100,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
Client fetches flags at login; cache for session duration.

---
## 12. Testing Matrix
| Type | Tools | Scope |
|------|-------|-------|
| Unit | Vitest/Jest | Pure functions (metrics, score calc) |
| Component | React Testing Library | Mood form, breathing component |
| Integration | Supertest | API endpoints (mood create, auth) |
| E2E | Playwright | Login → log mood → view analytics |
| Load | k6 / Artillery | Sustained & spike scenarios |
| Security | OWASP ZAP | Basic vulnerability scan |

Load Test Baseline:
```
VU: 50
Duration: 10m
Target RPS: 20
Success Criteria: <2% errors, p95 < 400ms
```

---
## 13. Incremental Action Checklist (First 30 Days)
- [x] Security middlewares (helmet, compression, rate limiting, logging)
- [ ] Config module with env validation
- [ ] Migrate mood storage to Postgres/Supabase table
- [ ] Add `/metrics` endpoint
- [ ] Add request duration histogram
- [ ] CI pipeline with type check + tests
- [ ] Redis cache for weekly digest
- [ ] Dockerfile + container runbook

---
## 14. Example Dockerfile (Preview)
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/build ./build
COPY --from=build /app/server ./server
COPY --from=build /app/server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production
EXPOSE 4000
CMD ["node","index.js"]
```

---
## 15. References & Next Steps
- Supabase Performance: use RLS + partial indexes
- For analytics expansion: consider pre-computed materialized views refreshed hourly
- Long term: Evaluate event sourcing (Kafka) if branching into advanced behavioral analytics

---
Feel free to request specific implementation steps next (e.g., add metrics endpoint, Dockerfile, CI workflow).
