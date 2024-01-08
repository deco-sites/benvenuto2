import { TableMap, tableMapData } from "../static/MockedTableObject.tsx";

export interface Props {
  id?: string;
}

export default function loader(
  { id }: Props,
  _req: Request,
): TableMap {
  return tableMapData;
}
