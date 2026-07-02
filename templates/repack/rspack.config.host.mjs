// Re.Pack — HOST app config (Module Federation v2).
// Adapted from the official callstack/repack tester-federation-v2 example.
// Placeholders: [HOST_NAME], [REMOTE_NAME], [REMOTE_PORT]. Pin shared versions
// to the ones in your package.json (host = eager: true).
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
      path: '[context]/build/host/[platform]',
      uniqueName: '[HOST_NAME]',
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
        ...Repack.getAssetTransformRules({ inline: true, maxInlineSize: 90 * 1024 }),
      ],
    },
    plugins: [
      new Repack.RepackPlugin({
        extraChunks: [
          { include: /.*/, type: 'remote', outputPath: `build/host/${platform}/output-remote` },
        ],
      }),
      new Repack.plugins.ModuleFederationPluginV2({
        name: '[HOST_NAME]',
        filename: '[HOST_NAME].container.js.bundle',
        // Remotes are resolved at runtime from their mf-manifest.json.
        // In prod, swap localhost for your CDN (env-aware — see SETUP.md).
        remotes: {
          ['[REMOTE_NAME]']: `[REMOTE_NAME]@http://localhost:[REMOTE_PORT]/${platform}/mf-manifest.json`,
        },
        dts: false,
        // Host shares its singletons EAGER so they load with the host bundle.
        shared: sharedDeps(pkg, { eager: true }),
      }),
      // @react-navigation/elements optionally requires this; ignore if unused.
      new rspack.IgnorePlugin({ resourceRegExp: /^@react-native-masked-view/ }),
    ],
  };
});

// Keep this list in sync between host and every remote. Versions must match
// (singletons) to avoid duplicate React/RN across federated chunks.
//
// HOW SHARING WORKS: all containers (host + every remote) negotiate shared deps
// through a global share scope at runtime (Re.Pack defaults to the
// `loaded-first` strategy) — so mini-apps share these libraries with EACH OTHER,
// not just with the host. Re.Pack also auto-shares react/react-native (incl.
// deep imports) by default; declaring them here just pins versions explicitly.
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

    // App-level shared singletons — uncomment the ones this project uses.
    // STATEFUL libraries MUST be shared singletons: if each mini-app bundles
    // its own copy you get separate caches/stores/instances (duplicated
    // session state, queries that never invalidate, out-of-sync language)
    // plus fatter chunks.
    // '@tanstack/react-query': dep('@tanstack/react-query'), // one QueryClient/cache
    // 'zustand': dep('zustand'),                             // one store instance
    // 'i18next': dep('i18next'),                             // one i18n instance
    // 'react-i18next': dep('react-i18next'),
    // '@supabase/supabase-js': dep('@supabase/supabase-js'), // one auth/session client
  };
}
