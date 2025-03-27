import { Env } from "@deco/actors/cf";
import { withActors } from "@deco/actors/hono";
import { Hono } from "@hono/hono";
export { ActorTable } from "./ActorTable.ts";

const app = new Hono<{ Bindings: Env }>();

app.use(withActors());

app.get("/", (c) => c.text("Hello Cloudflare Workers!"));

export default app;
