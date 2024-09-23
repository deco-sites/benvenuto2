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

  if (typeof entry === "string") {
    const parsedEntry = JSON.parse(entry);
    console.log("Mapa pego como JSON: ", parsedEntry);
    return parsedEntry as TableMap; // Return the parsed JSON object
  } else {
    console.log(
      "Unexpected non-string entry type, returning raw entry: ",
      entry,
    );
    return entry as TableMap; // If it's already an object, return it directly
  }
};

export default action;
