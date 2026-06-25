// Runtime resolver for federated chunks. Import this ONCE in the host's entry
// (index.js) BEFORE rendering the app, so Re.Pack knows where to fetch remote
// containers and their chunks from at runtime.
//
// Adapted from the official Re.Pack federation example. Make the base URL
// env-aware: dev server in development, CDN in production.
import { ScriptManager, Script } from '@callstack/repack/client';

// Map each remote container to where it is served.
const REMOTES = {
  // [REMOTE_NAME]: dev server on [REMOTE_PORT]; swap for your CDN in prod.
  '[REMOTE_NAME]': __DEV__
    ? `http://localhost:[REMOTE_PORT]`
    : `https://cdn.example.com/[REMOTE_NAME]`,
};

ScriptManager.shared.addResolver(async (scriptId, caller) => {
  // The MF container manifests and chunks are resolved by scriptId/caller.
  const platform = Script.getPlatform?.() ?? 'ios';

  for (const [name, base] of Object.entries(REMOTES)) {
    if (scriptId.startsWith(name) || caller === name) {
      return {
        url: `${base}/${platform}/${scriptId}`,
        cache: !__DEV__,
        // Optional: timeout, query, headers for auth/versioning.
      };
    }
  }
  // Fall through: let Re.Pack handle host-local chunks.
  return undefined;
});
