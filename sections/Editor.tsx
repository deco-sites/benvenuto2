import EditorIsland from "../islands/Editor.tsx";
import { TableMap } from "../static/MockedTableObject.tsx";

export interface Props {
  tableMap: TableMap;
}

export default function Editor({
  tableMap,
}: Props) {
  return <EditorIsland tableMap={tableMap}/>;
}
