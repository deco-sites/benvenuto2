import { ImageWidget } from "apps/admin/widgets.ts";
import MapManagementIsland from "../islands/MapManagement.tsx";

export interface Props {
  backgroundImage?: ImageWidget;
}

export default function Editor({
  backgroundImage,
}: Props) {
  return <MapManagementIsland backgroundImage={backgroundImage} />;
}
