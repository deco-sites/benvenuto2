import { TableMap } from "../static/MockedTableObject.tsx";

export interface Props {
  id: string;
}

const DATABASE_ID = "2f0c2673-1eb4-407c-a605-b6914df02ae1"

export default async function loader(
  { id }: Props,
  _req: Request,
): Promise<TableMap> {
  const kv = await Deno.openKv(`https://api.deno.com/databases/${DATABASE_ID}/connect`);

  const entry = await kv.get(["maps", "couve", "teste", id]);
  return JSON.parse(entry.value as string) as TableMap;
}
