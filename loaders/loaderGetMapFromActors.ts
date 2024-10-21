import { TableMap } from "../static/MockedTableObject.tsx";
import { actors } from "@deco/actors/proxy";
import type { ActorTable } from "../actors/ActorTable.ts";

export interface Props {
  empresa: string;
  filial: string;
  id: string;
}

export default async function loader(
  { empresa, filial, id }: Props,
  _req: Request,
): Promise<TableMap> {
  const tableMaps = actors.proxy<ActorTable>("ActorTable").id(
    `maps_${empresa}_${filial}_${id}`,
  );

  const tableMap = await tableMaps.getTableMap();

  return tableMap as TableMap;
}
