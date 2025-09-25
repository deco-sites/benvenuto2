import { TableMap } from "site/static/MockedTableObject.tsx";
import { Redis } from "@upstash/redis";
import { AppContext } from "site/apps/site.ts";

export interface Props {
  id: string;
}

const action = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<TableMap> => {
  const {
    id,
  } = props;

  const redis = new Redis({
    url: ctx.upstashRedis.url,
    token: ctx?.upstashRedis?.token?.get() ?? undefined,
  });

  const key = `maps_${id}`;

  const entry = await redis.get(key);

  console.log("Pegando mapa do banco " + key);

  return entry as TableMap;
};

export default action;
