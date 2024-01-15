import { TableMap } from "../static/MockedTableObject.tsx";

export interface Props {
  id: string;
}

export default async function loader(
  { id }: Props,
  _req: Request,
): Promise<TableMap> {
  const kv = await Deno.openKv();

  const entry = await kv.get(["maps", "couve", id]);
  return JSON.parse(entry.value as string) as TableMap;
}
