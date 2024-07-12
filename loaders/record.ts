import { AppContext } from "site/apps/deco/records.ts";

export default async function record(_p: null, _req: Request, ctx: AppContext) {
  const sqlClient = await ctx.invoke.records.loaders.sqlClient();
  return await sqlClient.execute({
    sql: "SELECT name FROM profiles WHERE id = ?",
    args: [2],
  });
}
