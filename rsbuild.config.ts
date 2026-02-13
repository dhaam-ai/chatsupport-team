import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';

export default defineConfig({
  plugins: [pluginReact()],

  server: {
    port: 3004,  // ← Different port for team
  },

  output: {
    publicPath: 'http://localhost:3004/',
  },

  tools: {
    postcss: (config) => {
      config.postcssOptions = {
        plugins: ['@tailwindcss/postcss'],
      };
    },

    rspack: {
      experiments: {
        moduleFederation: true,
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            exclude: /\.module\.css$/,
            type: 'css',
          },
          {
            test: /\.module\.css$/,
            type: 'css/module',
          },
        ],
      },
      output: {
        uniqueName: 'team',
        publicPath: 'auto',
      },
      plugins: [
        new ModuleFederationPlugin({
          name: 'team',
          filename: 'remoteEntry.js',

          exposes: {
            './App': './src/App.tsx',
          },

          shared: {
            react: { singleton: true, eager: true, requiredVersion: '19.2.0' },
            'react-dom': { singleton: true, eager: true, requiredVersion: '19.2.0' },
            'react-router-dom': { singleton: true, eager: true, requiredVersion: '6.28.0' },
            'lucide-react': { singleton: true, eager: true, requiredVersion: '0.553.0' },
          },

          dts: false,
        }),
      ],
    },
  },
});