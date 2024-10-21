import { ImageWidget } from "apps/admin/widgets.ts";
import MapEditorIsland from "../islands/MapEditor.tsx";

export interface Props {
  backgroundImage?: ImageWidget;
}

export default function MapEditor({
  backgroundImage,
}: Props) {
  return (
    <MapEditorIsland backgroundImage={backgroundImage} />
  );
}

