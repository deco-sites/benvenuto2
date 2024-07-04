import { useState } from "preact/hooks";
import { PositionXY } from "deco-sites/benvenuto2/islands/MapEditor.tsx";

export interface Props {
  sideBarItemModel: string;
  imagePreviewPosition: PositionXY;
}

export default function DraggableGenericTable({
  sideBarItemModel,
  imagePreviewPosition,
}: Props) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const getImageSource = () => {
    let imageSource = "/tables/tableGreen.png"; // Default source

    if (sideBarItemModel == "models.SquareTable") {
      imageSource = "/tables/tableGreen.png";
    } else if (sideBarItemModel == "models.SegmentTable") {
      imageSource = "/tables/segmentGreen.png";
    }
    return imageSource;
  };

  const getWidth = () => {
    let width = 1; // Default source

    if (sideBarItemModel == "models.SquareTable") {
      width = 5;
    } else if (sideBarItemModel == "models.SegmentTable") {
      width = 5.2;
    }
    return width;
  };

  return (
    <div
      style={`width: ${getWidth()}%; height: auto; touch-none position: absolute; top: ${imagePreviewPosition.y}%; left: ${imagePreviewPosition.x}%;`}
    >
      <img
        src={getImageSource()}
        alt={`New Table`}
        class={`w-full select-none pointer-events-none user-drag-none`}
      />
    </div>
  );
}
