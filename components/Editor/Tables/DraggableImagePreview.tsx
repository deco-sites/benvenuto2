import { useRef } from "preact/hooks";
import { PositionXY } from "deco-sites/benvenuto2/islands/MapEditor.tsx";

export interface Props {
  sideBarItemModel: string;
  imagePreviewPosition: PositionXY;
}

export default function DraggableGenericTable({
  sideBarItemModel,
  imagePreviewPosition,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const getImageSource = () => {
    let imageSource = "/tables/tableGreen.png";

    if (sideBarItemModel == "models.SquareTable") {
      imageSource = "/tables/tableGreen.png";
    } else if (sideBarItemModel == "models.SegmentTable") {
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
  //Offset para drag do editorsidebar, porém, o handle drop não tem a informação do offset para droppar na mesma posicao do item dragggado
  const getOffset = (type: string) => {
    if (type == "x") {
      const offX = containerRef.current?.offsetWidth ?? 0;
      return offX;
    } else {
      const offY = containerRef.current?.offsetHeight ?? 0;
      return offY;
    }
  };

  return (
    <div
      ref={containerRef}
      class={`touch-none`}
      style={`width: ${getWidth()}%; height: auto; position: absolute; top: ${imagePreviewPosition.y}%; left: ${imagePreviewPosition.x}%;`}
    >
      <img
        src={getImageSource()}
        alt={`New Table`}
        class={`w-full select-none pointer-events-none user-drag-none`}
      />
    </div>
  );
}
