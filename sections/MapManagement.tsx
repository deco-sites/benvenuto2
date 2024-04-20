import { ImageWidget } from "apps/admin/widgets.ts";
import MapManagementIsland from "../islands/MapManagement.tsx";
import { TableMap } from "../static/MockedTableObject.tsx";

export interface Props {
  tableMap: TableMap;
  backgroundImage?: ImageWidget;
}

export default function Editor({
  tableMap,
  backgroundImage,
}: Props) {
  return <MapManagementIsland tableMap={tableMap} backgroundImage={backgroundImage} />;
}
