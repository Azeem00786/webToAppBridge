import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

export default [
  // UMD build for browsers
  {
    input: "src/index.js",
    output: {
      name: "WebToRNBridge",
      file: pkg.browser,
      format: "umd",
    },
    plugins: [resolve(), commonjs(), terser()],
  },
  // ESM build for modern bundlers
  {
    input: "src/index.js",
    output: { file: pkg.module, format: "es" },
  },
  // CommonJS build for Node.js
  {
    input: "src/index.js",
    output: { file: pkg.main, format: "cjs" },
  },
];
