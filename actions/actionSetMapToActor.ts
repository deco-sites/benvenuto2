//import { GzipStream } from "https://deno.land/x/compress@v0.4.4/mod.ts";
import { actors } from "@deco/actors/proxy";
import type { ActorTable } from "../actors/ActorTable.ts";

export interface Props {
  email: string;
  id: string;
  mapJSON: string;
}

const action = async (
  props: Props,
  _req: Request,
): Promise<void> => {
  const {
    email,
    id,
    mapJSON,
  } = props;

  const tableMaps = actors.proxy<ActorTable>("ActorTable").id(
    `maps_${email}_${id}`,
  );
  const result = await tableMaps.saveTableMap(JSON.parse(mapJSON));
  console.log(result);

  return;
};

export default action;
