# Deferred / future considerations

> Maintainer backlog of ideas intentionally **not** implemented yet, with the
> reasoning, so a "why didn't we do X?" has an answer and a change of mind has a
> starting point. This is an internal doc (single-language, not part of the
> bilingual user docs).

---

## Backend standards — make the backend a first-class citizen

**Status:** Deferred (2026-06-26). Keep the plugin **strictly frontend-focused** (RN + Re.Pack) for now.

**Context.** The `memory-bank/standards/` cover the frontend well (tech-stack, coding, architecture, testing) but say nothing about the backend. The Betmeet migration (first real-world use) nevertheless built a full backend — 13 Supabase migrations, 11 Edge Functions, RLS policies, atomic plpgsql — entirely **ad-hoc**, with no standard to anchor conventions (Edge Function structure, migration naming, JWT verification, where server-only logic lives, the client↔backend contract). It worked because the agent was disciplined, but the next project would reinvent all of it.

**The idea.** Add `templates/standards/backend-standards.md` covering: platform choice (e.g. Supabase Auth+Postgres+RLS) and why; data-layer conventions (schema, migrations, RLS); server-only logic (Edge Functions / RPC: structure, auth); the client↔backend contract (REST/RPC/SDK); security (RLS, `service_role` never in the client, secrets); and backend testing.

**Recommended shape if revisited — conditional, not default.** `aidlc-init` should NOT seed it by default (that would broaden the plugin from frontend-first to full-stack). Instead, seed it only when the Inception backend question answers **"build own"**. That keeps the plugin frontend-first while giving the backend a home the moment it enters scope.

**Why deferred.** This is a scope decision, not a fix: the plugin is named `rn-repack` and is deliberately frontend-focused, assuming you reuse a backend. Adding backend standards risks diluting that focus.

**Trigger to revisit.** If building (not just consuming) backends becomes common across projects using the plugin. The reuse-vs-build backend question added in **0.8.0** (`aidlc-inception`) is the natural hook — if that answer is frequently "build own," implement this.
