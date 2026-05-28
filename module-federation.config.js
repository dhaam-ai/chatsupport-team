export const mfConfig = {
  name: "team",
  filename: "team.js",
  exposes: {
    "./App": "./src/App.tsx",
    "./tailwindStyles": "./src/index.css"
  },
  shared: {
    react: { singleton: true, requiredVersion: "19.2.0" },
    "react-dom": { singleton: true, requiredVersion: "19.2.0" },
    "react-router-dom": { singleton: true, requiredVersion: false },
    "react-redux": { singleton: true, requiredVersion: false },
    "@reduxjs/toolkit": { singleton: true, requiredVersion: false },
    "lucide-react": { singleton: true, requiredVersion: false },
  },
  dts: {
    generateTypes: process.env.NODE_ENV === "production",
    consumeTypes: false,
  },
};
