import { TableMap } from "../static/MockedTableObject.tsx";

export interface Props {
  id: string;
}

const DATABASE_ID = "f08a462c-3847-4b91-b3bf-be75e67f2ab6";

export default async function loader(
  { id }: Props,
  _req: Request,
): Promise<TableMap> {
  const kv = await Deno.openKv(
    `https://api.deno.com/databases/${DATABASE_ID}/connect`,
  );

  const entry = await kv.get(["maps", "couve", "teste", id]);
  return JSON.parse(entry.value as string) as TableMap;
}
