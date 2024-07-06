import { TableMap } from "site/static/MockedTableObject.tsx";

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

  const kv = await Deno.openKv();
  const entry = await kv.get(["maps", empresa, filial, id]);
  console.log("Pegando mapa do banco " + ["maps", empresa, filial, id]);

  return JSON.parse(entry.value as string);
};

export default action;
