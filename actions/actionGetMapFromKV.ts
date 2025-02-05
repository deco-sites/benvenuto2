import { TableMap } from "site/static/MockedTableObject.tsx";

export interface Props {
  empresa: string;
  filial: string;
  id: string;
}

const DATABASE_ID = "f08a462c-3847-4b91-b3bf-be75e67f2ab6";

const action = async (
  props: Props,
  _req: Request,
): Promise<TableMap> => {
  
  const {
    empresa,
    filial,
    id,
  } = props;

  const kv = await Deno.openKv(
    `https://api.deno.com/databases/${DATABASE_ID}/connect`,
  );
  const entry = await kv.get(["maps", empresa, filial, id]);
  console.log("Pegando mapa do banco " + ["maps", empresa, filial, id]);

  return JSON.parse(entry.value as string);
};

export default action;
