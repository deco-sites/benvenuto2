//import { GzipStream } from "https://deno.land/x/compress@v0.4.4/mod.ts";
export interface Props {
  empresa: string;
  id: string;
  mapJSON: string;
}

const action = async (
  props: Props,
  _req: Request,
): Promise<void> => {
  const {
    empresa,
    id,
    mapJSON,
  } = props;

  const kv = await Deno.openKv();

  const result = await kv.set(["maps", empresa, id], mapJSON);
  console.log("Salvando no banco " + ["maps", empresa, id] + " :", result);
  return;
};

export default action;
