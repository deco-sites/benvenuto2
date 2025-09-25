//import { GzipStream } from "https://deno.land/x/compress@v0.4.4/mod.ts";
import { Redis } from "@upstash/redis";
import { AppContext } from "site/apps/site.ts";

export interface Props {
  id: string;
  mapJSON: string;
}

const action = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<void> => {
  const {
    id,
    mapJSON,
  } = props;

  const CHANNEL_NAME = `tablemap_${id}_channel`;

  const redis = new Redis({
    url: ctx.upstashRedis.url,
    token: ctx?.upstashRedis?.token?.get() ?? undefined,
  });

  const key = `maps_${id}`;

  await redis.set(key, mapJSON);

  const result = await redis.publish(CHANNEL_NAME, mapJSON);

  console.log(
    "Canal:" + CHANNEL_NAME +
      "Salvando no banco" + key + ":",
    result,
  );
  return;
};

export default action;
