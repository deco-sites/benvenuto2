import { TableMap } from "../static/MockedTableObject.tsx";
import { Redis } from "@upstash/redis";

export interface Props {
  id: string;
}

export default async function loader(
  { id }: Props,
  _req: Request,
): Promise<TableMap> {
  const redis = new Redis({
    url: Deno.env.get("UPSTASH_REDIS_REST_URL")!,
    token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN")!,
  });

  const key = `maps_${id}`;

  const entry = await redis.get(key);

  return entry as TableMap;
}
