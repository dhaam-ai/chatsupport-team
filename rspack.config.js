import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import RefreshPlugin from "@rspack/plugin-react-refresh";
import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";
import { mfConfig } from "./module-federation.config.js";

const isLocalDev = process.env.NODE_ENV === "local" || process.env.NODE_ENV === "development";
const appEnv = process.env.REACT_APP_ENV || "dev";

console.log("🔧 Build Configuration:");
console.log("  NODE_ENV:", process.env.NODE_ENV);
console.log("  REACT_APP_ENV:", appEnv);
console.log("  isLocalDev:", isLocalDev);

const targets = ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"];

export default defineConfig({
  context: __dirname,
  
  mode: isLocalDev ? "development" : "production",
  
  entry: {
    main: "./src/index.ts",
  },
  
  resolve: {
    extensions: ["...", ".ts", ".tsx", ".jsx"],
    fullySpecified: false,
  },

  devServer: {
    port: 3004,
    historyApiFallback: true,
    watchFiles: [path.resolve(__dirname, "src")],
    hot: true,
  },
  
  output: {
    uniqueName: "team",
    publicPath: "auto",
    path: path.resolve(__dirname, "dist"),
    filename: isLocalDev ? "[name].js" : "[name].[contenthash:8].js",
    chunkFilename: isLocalDev ? "[name].chunk.js" : "[name].[contenthash:8].chunk.js",
    clean: true,
  },

  experiments: {
    css: true,
  },

  module: {
  rules: [
    {
      test: /\.js$/,
      resolve: {
        fullySpecified: false,
      },
    },
    {
      test: /\.svg$/,
      type: "asset",
    },
    {
      test: /\.(png|jpe?g|gif)$/i,
      type: "asset/resource",
    },
    {
      test: /\.css$/,
      use: ["postcss-loader"],
      type: "css",
    },
    {
      test: /\.(jsx?|tsx?)$/,
      use: [
        {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
              },
              transform: {
                react: {
                  runtime: "automatic",
                  development: isLocalDev,
                  refresh: isLocalDev,
                },
              },
            },
            env: { targets },
          },
        },
      ],
    },
  ],
},

    plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
      minify: !isLocalDev,
    }),
    
    new rspack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(isLocalDev ? 'development' : 'production'),
      'process.env.REACT_APP_ENV': JSON.stringify(appEnv),
    }),
    
    new ModuleFederationPlugin(mfConfig),
    
    isLocalDev ? new RefreshPlugin() : null,
  ].filter(Boolean),
  
  optimization: {
    minimize: !isLocalDev,
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin(),
      new rspack.LightningCssMinimizerRspackPlugin({
        minimizerOptions: { targets },
      }),
    ],
  },
  
  devtool: isLocalDev ? 'eval-cheap-module-source-map' : false,
});