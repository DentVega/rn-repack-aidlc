# Activation Checklist

> Produced and maintained by the AI-DLC **Operations** agent, saved to
> `memory-bank/operations/activation-checklist.md`. Construction produces
> **verified code**; this file lists the manual, environment-specific steps only
> **you** can run to make the app actually run. It makes the "code-complete ≠
> running" boundary explicit. Check items off as you complete them; leave a step
> unchecked (not deleted) if it doesn't apply, with a note why.

## Status
- **Code-complete:** `<bolts done>` / `<total>`
- **Activated:** `<no / partial / yes>` — `<what's left>`

## Backend
- [ ] Apply migrations to the live project — `<command>` (e.g. `supabase db push`) · `<N>/<N>`
- [ ] Deploy server/edge functions — `<command>` (e.g. `supabase functions deploy`) · `<N>/<N>`
- [ ] Set secrets / service config — `<command>` (e.g. `supabase secrets set …`)

## Native (Re.Pack app)
- [ ] Rebuild when a native module was added — `pod install` (iOS) / Gradle sync (Android)
- [ ] Run on device/simulator — `<command>`
- [ ] Re.Pack: host bundle builds; remote chunks served (only if Module Federation is used)

## Dashboard / Infra
- [ ] Auth redirect / deep-link URLs registered — e.g. `<scheme>://auth/{callback,reset,confirm}`
- [ ] Storage buckets / public assets created
- [ ] Build-time env vars set — `.env` / DefinePlugin / CI secrets (never commit secrets)

## Seed / data
- [ ] Minimum data to boot the core flow — `<what + command>`

## Verify (is it actually live?)
- [ ] App boots against the **real** backend (not placeholders)
- [ ] One write path works end-to-end
- [ ] A deep link opens and routes correctly
- [ ] (optional) `agent-device` E2E on the core flow

## Notes
- `<environment-specific gotchas, ordering dependencies, deferred items>`
