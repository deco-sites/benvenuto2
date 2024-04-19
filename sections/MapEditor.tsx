import { ImageWidget } from "apps/admin/widgets.ts";
import MapEditorIsland from "../islands/MapEditor.tsx";
import { TableMap } from "../static/MockedTableObject.tsx";

export interface Props {
  tableMap: TableMap;
  backgroundImage?: ImageWidget;
  backgroundImageWidth?: string;
  backgroundImageHeight?: string;
}

export default function Editor({
  tableMap,
  backgroundImage
}: Props) {
  return <MapEditorIsland tableMap={tableMap} backgroundImage={backgroundImage} />;
}
