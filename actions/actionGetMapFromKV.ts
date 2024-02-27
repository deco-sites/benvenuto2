export interface Props {
  empresa: string;
  id: string;
}

const action = async (
  props: Props,
  _req: Request,
): Promise<void> => {
  const {
    empresa,
    id,
  } = props;

  const kv = await Deno.openKv();
  const entry = await kv.get(["maps", empresa, id]);
  console.log("Pegando mapa do banco " + ["maps", empresa, id]);

  return JSON.parse(entry.value as string);
};

export default action;
