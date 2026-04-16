import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    ".output/**",
    "app/routeTree.gen.ts",
    "node_modules/**",
  ]),
]);
