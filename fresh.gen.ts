// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_app from "./routes/_app.tsx";
import * as $sse_tables from "./routes/sse/tables.ts";
import * as $Editor from "./islands/Editor.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_app.tsx": $_app,
    "./routes/sse/tables.ts": $sse_tables,
  },
  islands: {
    "./islands/Editor.tsx": $Editor,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
