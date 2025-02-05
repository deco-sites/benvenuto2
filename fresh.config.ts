import { defineConfig } from "$fresh/server.ts";
import { plugins } from "deco/plugins/deco.ts";
import manifest, { Manifest } from "./manifest.gen.ts";
//import tailwind from "./tailwind.config.ts";
import { Deco, DecoRouteState } from "@deco/deco";
import { framework as htmxFramework } from "@deco/deco/htmx";
import { Hono } from "@hono/hono";
import { withActors } from "@deco/actors/hono";
import { ActorTable } from "./actors/ActorTable.ts";

const server = new Hono<DecoRouteState<Manifest>>();
server.use(withActors([ActorTable]));

const deco = await Deco.init<Manifest>({
  manifest,
  bindings: {
    server,
    framework: htmxFramework,
  },
});

export default defineConfig({
  plugins: plugins({
    manifest,
    // deno-lint-ignore no-explicit-any
    //
    deco,
  }),
});
