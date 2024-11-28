import { TableMap } from "site/static/MockedTableObject.tsx";
import { actors } from "@deco/actors/proxy";
import type { ActorTable } from "../actors/ActorTable.ts";

export interface Props {
  email: string;
  id: string;
}

const action = async (
  props: Props,
  _req: Request,
): Promise<TableMap> => {
  const {
    email,
    id
  } = props;

  const tableMaps = actors.proxy<ActorTable>("ActorTable").id(
    `maps_${email}_${id}`,
  );

  const tableMap = await tableMaps.getTableMap();

  return tableMap as TableMap;
};

export default action;
