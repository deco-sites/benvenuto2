// import { GzipStream } from "https://deno.land/x/compress@v0.4.4/mod.ts";
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
  try {
    const { email, id, mapJSON } = props;

    const tableMaps = actors.proxy<ActorTable>("ActorTable").id(
      `maps_${email}_${id}`,
    );

    const parsedMap = JSON.parse(mapJSON); // Tenta fazer o parse do JSON
    const result = await tableMaps.saveTableMap(parsedMap); // Salva no banco

    console.log("Result:", result);
    console.log("Map JSON Parsed:", parsedMap);
  } catch (error) {
    console.error("Error in action:", error);
  }
};

export default action;

