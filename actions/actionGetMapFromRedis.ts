import { TableMap } from "site/static/MockedTableObject.tsx";
import { Redis } from "@upstash/redis";

export interface Props {
  empresa: string;
  filial: string;
  id: string;
}

const action = async (
  props: Props,
  _req: Request,
): Promise<TableMap> => {
  const {
    empresa,
    filial,
    id,
  } = props;

  const redis = new Redis({
    url: Deno.env.get("UPSTASH_REDIS_REST_URL")!,
    token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN")!,
  });

  const key = `maps_${empresa}_${filial}_${id}`;

  const entry = await redis.get(key);

  console.log("Pegando mapa do banco " + key);
  console.log("Mapa pego:  " + entry);

  return JSON.parse(entry as string);
};

export default action;
