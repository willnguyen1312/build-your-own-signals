import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import Inspect from "vite-plugin-inspect";

export default defineConfig({
  plugins: [
    Inspect(),
    react({
      babel: {
        plugins: [["module:@preact/signals-react-transform"]],
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
