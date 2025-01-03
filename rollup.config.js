// --jsx JSX support is provided using another plugin. If you want your output to contains JSX code (i.e. --jsx preserve), you need the @babel/plugin-syntax-jsx plugin; if you want to transpile it to standard JavaScript (i.e. --jsx react or --jsx react-native), you should use the @babel/plugin-transform-react-jsx plugin.

// Note: Quick and dirty
// ./node_modules/.bin/babel . --ignore node_modules --ignore types -d lib-pages --extensions ".ts,.tsx" --presets=@babel/preset-react --presets @babel/preset-typescript
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import sucrase from "@rollup/plugin-sucrase";
import json from "@rollup/plugin-json";

import { readdir } from "node:fs/promises";
import { join } from "node:path";

const walk = async (dirPath) =>
  Promise.all(
    await readdir(dirPath, { withFileTypes: true }).then((entries) =>
      entries.map((entry) => {
        const childPath = join(dirPath, entry.name);
        return entry.isDirectory() ? walk(childPath) : childPath;
      })
    )
  );

const allFiles = await Promise.all(
  ["src"].map(
    walk
  )
);

const config = {
  input: "src/transformers.js",
  output: {
    dir: "dist/isomorphic",
    format: "es",
  },
  external: [/node_modules/],
  plugins: [
    //typescript(),
    json(),
    resolve(),
    commonjs(),
  ],
};
export default [config];
