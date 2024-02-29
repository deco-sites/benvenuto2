import { ImageWidget } from "apps/admin/widgets.ts";
import EditorIsland from "../islands/Editor.tsx";
import { TableMap } from "../static/MockedTableObject.tsx";

export interface Props {
  tableMap: TableMap;
  backgroundImage?: ImageWidget;
  backgroundImageWidth?: string;
  backgroundImageHeight?: string;
}

export default function Editor({
  tableMap,
  backgroundImage,
  backgroundImageWidth,
  backgroundImageHeight
}: Props) {
  return <EditorIsland tableMap={tableMap} backgroundImage={backgroundImage} backgroundImageWidth={backgroundImageWidth} backgroundImageHeight= {backgroundImageHeight}/>;
}
