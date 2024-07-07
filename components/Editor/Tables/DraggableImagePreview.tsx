import { useEffect, useRef, useState } from "preact/hooks";
import { PositionXY } from "deco-sites/benvenuto2/islands/MapEditor.tsx";
import { imagePreviewPosition } from "deco-sites/benvenuto2/utils/imagePreviewPosition.ts";

export interface Props {
  sideBarItemModel: string;
  isSideBarTouch: boolean;
  setDraggedItemOffset: (offset: PositionXY) => void;
}

export default function DraggableImagePreview({
  sideBarItemModel,
  setDraggedItemOffset,
  isSideBarTouch,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const offX = useRef<number>(0);
  const offY = useRef<number>(0);

  useEffect(() => {
    if (isSideBarTouch) {
      console.log(offY.current);
      offX.current = containerRef.current?.offsetWidth ?? 0;
      offY.current = containerRef.current?.offsetHeight ?? 0;
      setDraggedItemOffset({ x: offX.current / 2, y: offY.current * 1.6 });
    }
  }, [sideBarItemModel]);

  const getImageSource = () => {
    let imageSource = "/tables/tableGreen.png";

    if (sideBarItemModel == "models.SquareTable") {
      imageSource = "/tables/tableGreen.png";
    } else if (sideBarItemModel == "models.RoundTable") {
      imageSource = "/tables/segmentGreen.png";
    }
    return imageSource;
  };

  const getWidth = () => {
    let width = 1;

    if (sideBarItemModel == "models.SquareTable") {
      width = 5;
    } else if (sideBarItemModel == "models.RoundTable") {
      width = 5.2;
    }
    return width;
  };

  return (
    <div
      ref={containerRef}
      class={`touch-none`}
      style={`width: ${getWidth()}%; height: auto; position: absolute; top: ${imagePreviewPosition.value.y}%; left: ${imagePreviewPosition.value.x}%;`}
    >
      <img
        src={getImageSource()}
        alt={`New Table`}
        class={`w-full select-none pointer-events-none user-drag-none`}
      />
    </div>
  );
}
