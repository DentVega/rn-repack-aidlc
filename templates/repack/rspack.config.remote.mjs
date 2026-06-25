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
  };
}
