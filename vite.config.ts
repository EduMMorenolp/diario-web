import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: "/LaDiarIA/",
  server: { port: 5173, host: true },
});
