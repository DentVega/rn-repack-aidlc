// Re.Pack — REMOTE (mini-app) config (Module Federation v2).
// Adapted from the official callstack/repack tester-federation-v2 example.
// Placeholders: [REMOTE_NAME]. The remote EXPOSES one or more entry modules
// the host imports lazily. Remote shares singletons NON-eager (eager: false).
import * as Repack from '@callstack/repack';
import rspack from '@rspack/core';
import pkg from './package.json' with { type: 'json' };

export default Repack.defineRspackConfig((env) => {
  const { mode, context, platform } = env;

  return {
    mode,
    context,
    entry: './index.js',
    resolve: {
      ...Repack.getResolveOptions({ enablePackageExports: true }),
    },
    output: {
      path: '[context]/build/[REMOTE_NAME]/[platform]',
      uniqueName: '[REMOTE_NAME]',
    },
    module: {
      rules: [
        {
          test: /\.[cm]?[jt]sx?$/,
          use: {
            loader: '@callstack/repack/babel-swc-loader',
            parallel: true,
            options: {},
          },
          type: 'javascript/auto',
        },
        ...Repack.getAssetTransformRules({ inline: true }),
      ],
    },
    plugins: [
      new Repack.RepackPlugin({
        extraChunks: [
          { include: /.*/, type: 'remote', outputPath: `build/[REMOTE_NAME]/${platform}/output-remote` },
        ],
      }),
      new Repack.plugins.ModuleFederationPluginV2({
        name: '[REMOTE_NAME]',
        filename: '[REMOTE_NAME].container.js.bundle',
        exposes: {
          // The host imports this via: import('[REMOTE_NAME]/Navigator')
          './Navigator': './src/navigation/MainNavigator',
        },
        dts: false,
        shared: sharedDeps(pkg, { eager: false }),
      }),
      new rspack.IgnorePlugin({ resourceRegExp: /^@react-native-masked-view/ }),
    ],
  };
});

// Mirror the host's shared list exactly (same libs, same versions). Shared deps
// are negotiated through a global share scope at runtime, so mini-apps reuse
// each other's copies (Re.Pack default: `loaded-first`).
//
// Slimming tip: for a dep the host is GUARANTEED to have loaded eagerly, a
// remote can add `import: false` (consume-only — no fallback copy bundled),
// shrinking its chunk. Trade-off: the remote then cannot load standalone.
function sharedDeps(pkg, { eager }) {
  const dep = (name) => ({
    singleton: true,
    eager,
    version: pkg.dependencies[name],
    requiredVersion: pkg.dependencies[name],
  });
  return {
    react: { singleton: true, eager, requiredVersion: pkg.dependencies.react },
    'react-native': { singleton: true, eager, requiredVersion: pkg.dependencies['react-native'] },
    '@react-navigation/native': dep('@react-navigation/native'),
    '@react-navigation/native-stack': dep('@react-navigation/native-stack'),
    'react-native-safe-area-context': dep('react-native-safe-area-context'),
    'react-native-screens': dep('react-native-screens'),

    // App-level shared singletons — keep in lockstep with the host's list.
    // STATEFUL libs must be singletons (one QueryClient / store / i18n /
    // session client across ALL mini-apps):
    // '@tanstack/react-query': dep('@tanstack/react-query'),
    // 'zustand': dep('zustand'),
    // 'i18next': dep('i18next'),
    // 'react-i18next': dep('react-i18next'),
    // '@supabase/supabase-js': dep('@supabase/supabase-js'),
  };
}
