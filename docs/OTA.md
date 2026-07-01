# Over-the-air (OTA) updates with Re.Pack

**English** · [Español](OTA.es.md)

One of Re.Pack's standout capabilities: because Module Federation downloads JS/Hermes-bytecode **remote chunks** at runtime, you can ship JS updates by replacing a chunk on your CDN — **without** a new App Store / Play Store submission. This is the plugin's most differentiating Re.Pack feature.

## Why Re.Pack enables this

The host app resolves each remote chunk from a URL at runtime (via `ScriptManager`). Update the chunk (and its `mf-manifest.json`) on the CDN, and the next launch downloads the new code. A **single-bundle** app has nothing to update remotely — OTA requires Module Federation (host + remotes). See [`/repack-init`](../commands/repack-init.md).

## What you can and can't ship OTA

| Change | OTA? |
|---|---|
| JS/TS logic, UI, styles, copy, most bug fixes | ✅ yes — update the remote chunk |
| Assets bundled into a chunk | ✅ yes |
| A new/updated native module (Kotlin/Swift, Pods/Gradle) | ❌ no — needs a store release |
| React Native / Hermes engine upgrade | ❌ no — store release |
| Changes to the host bundle's shared singletons | ⚠️ risky — can break remotes; prefer a store release |

## How it works

```
CDN
 ├─ HostApp.container.js.bundle        (shipped in the store binary)
 └─ MiniApp/                           (updatable OTA)
     ├─ mf-manifest.json   ← bump this + the chunks to release an update
     └─ *.chunk.bundle
Host at launch → ScriptManager resolves MiniApp@<CDN>/mf-manifest.json → downloads latest
```

## Safety: skew, fallback, rollout, rollback

- **Version skew:** the host and a remote share a contract (props, shared singletons). Version your manifests and gate a remote to a host range so an incompatible chunk isn't served.
- **Fallback:** always handle a failed chunk download (network/CDN) — render a cached version or a graceful placeholder, never a white screen.
- **Staged rollout:** serve the new manifest to a fraction of clients first (CDN routing / feature flag), watch chunk-load-failure and crash rates, then ramp.
- **Rollback:** repoint the host to the previous chunk/manifest version. Keep prior versions on the CDN.

## When to adopt it

v1 apps usually ship single-bundle (simpler). Adopt Module Federation + OTA when you want to push fixes/content between store releases, or when independent teams own features. Run `/repack-init` to carve the first remote, and record the OTA hosting/rollback plan in `memory-bank/operations/`.

## Store policy note

Stores permit JS updates that fix bugs or adjust content, but **not** updates that change the app's core purpose or bypass review. Keep OTA within policy — treat it as fast iteration, not a way to ship what review would reject.
