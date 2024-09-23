//import { GzipStream } from "https://deno.land/x/compress@v0.4.4/mod.ts";
import { Redis } from "@upstash/redis";

export interface Props {
  empresa: string;
  filial: string;
  id: string;
  mapJSON: string;
}

const action = async (
  props: Props,
  _req: Request,
): Promise<void> => {
  const {
    empresa,
    filial,
    id,
    mapJSON,
  } = props;

  const redis = new Redis({
    url: Deno.env.get("UPSTASH_REDIS_REST_URL")!,
    token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN")!,
  });
  const key = `maps_${empresa}_${filial}_${id}`;

  console.log(
    "Recebido em " + key + " o JSON: ",
    mapJSON,
  );

  const result = await redis.set(key, mapJSON);

  console.log(
    "Salvando no banco " + key + " :",
    result,
  );
  return;
};

export default action;