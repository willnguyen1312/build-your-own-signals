import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  test: {
    restoreMocks: true,
    environment: "happy-dom",
    include: ["**/*.test.{ts,tsx}"],
  },
});
