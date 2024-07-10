//import { GzipStream } from "https://deno.land/x/compress@v0.4.4/mod.ts";

export interface Props {
  empresa: string;
  filial: string;
  id: string;
  mapJSON: string;
}

const DATABASE_ID = "2f0c2673-1eb4-407c-a605-b6914df02ae1";

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

  const kv = await Deno.openKv(
    `https://api.deno.com/databases/${DATABASE_ID}/connect`,
  );
  console.log(
    "Recebido em " + ["maps", empresa, filial, id] + " o JSON: ",
    mapJSON,
  );
  const result = await kv.set(["maps", empresa, filial, id], mapJSON);
  console.log(
    "Salvando no banco " + ["maps", empresa, filial, id] + " :",
    result,
  );
  return;
};

export default action;
