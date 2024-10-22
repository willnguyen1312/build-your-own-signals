import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import Inspect from "vite-plugin-inspect";

// babel.config.js
const ReactCompilerConfig = {
  target: "18", // '17' | '18' | '19'
};

export default defineConfig({
  plugins: [
    Inspect(),
    react({
      babel: {
        plugins: [
          ["module:@preact/signals-react-transform"],
          // This plugin will break the above transform if signals are store outside of the component
          // ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
  build: {
    sourcemap: true,
  },
  test: {
    restoreMocks: true,
    environment: "happy-dom",
    include: ["**/*.test.{ts,tsx}"],
  },
});
