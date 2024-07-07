import { PositionXY } from "../../islands/MapEditor.tsx";
import { useState } from "preact/hooks";
import { imagePreviewPosition } from "deco-sites/benvenuto2/utils/imagePreviewPosition.ts";

export interface Props {
  setDraggedItemOffset: (offset: PositionXY) => void;
  setSideBarItemModel: (model: string) => void;
  setIsSideBarTouch: (value: boolean) => void;
  calculateTouchCoordinates(event: TouchEvent, type: string): number;
  calculateCoordinates(event: DragEvent, type: string): number;
  handleTouchDrop(xPercentage: number, yPercentage: number): void;
}

export default function EditorSidebar({
  setDraggedItemOffset,
  setSideBarItemModel,
  calculateTouchCoordinates,
  calculateCoordinates,
  handleTouchDrop,
  setIsSideBarTouch,
}: Props) {
  type Item = {
    id: number;
    model: string;
    imageUrl: string;
    text: string;
  };

  const items: Item[] = [
    {
      id: 1,
      model: "models.SquareTable",
      imageUrl: "/tables/tableGreen.png",
      text: "Item 1",
    },
    {
      id: 2,
      model: "models.RoundTable",
      imageUrl: "/tables/segmentGreen.png",
      text: "Item 2",
    },
  ];
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDragStart = (e: DragEvent, item: Item) => {
    console.log("Drag Start:", item.model);
    setIsSideBarTouch(false);
    setDraggedItemOffset({ x: e.offsetX, y: e.offsetY });
    setSideBarItemModel(item.model);

    const crt =  document.createElement('div');
    crt.style.position = "absolute";
    crt.style.top = "-9000px";
    crt.style.left = "-9000px";

    e.dataTransfer?.setDragImage(crt, 0, -9000);
  };
  const handleDragMove = (e: DragEvent) => {
    const newX = calculateCoordinates(e, "x");
    const newY = calculateCoordinates(e, "y");
    imagePreviewPosition.value = { x: newX, y: newY };
    setPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    console.log("Drag End:", position.x, position.y);
    imagePreviewPosition.value = { x: 0, y: -9999 };
    handleTouchDrop(position.x, position.y);
  };

  const handleTouchStart = (item: Item) => {
    setIsSideBarTouch(true);
    setSideBarItemModel(item.model);
    console.log("Touch Start:", item.model);
  };
  const handleTouchMove = (touchEvent: TouchEvent) => {
    const newX = calculateTouchCoordinates(touchEvent, "x");
    const newY = calculateTouchCoordinates(touchEvent, "y");
    imagePreviewPosition.value = { x: newX, y: newY };
    setPosition({ x: newX, y: newY });
    console.log("Touch Move:", newX, newY);
  };

  const handleTouchEnd = () => {
    console.log("Touch End:", position.x, position.y);
    imagePreviewPosition.value = { x: 0, y: -9999 };
    handleTouchDrop(position.x, position.y);
  };

  return (
    <div
      className="absolute left-0 w-[7%] lg:w-[3.3%] h-auto top-[48px] bg-white overflow-y-auto  border-solid border-r-2 border-b-2 border-gray-300 rounded-br-md z-10 touch-none"
      style="z-index: 3"
      onDragOver={(event) => event.preventDefault()}
    >
      <div className="h-[10%]">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-1 pt-2 pb-3"
          >
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDrag={(e) => handleDragMove(e)}
              onDragEnd={() => handleDragEnd()}
              onTouchStart={() => handleTouchStart(item)}
              onTouchMove={(e) => handleTouchMove(e)}
              onTouchEnd={handleTouchEnd}
              className="w-full h-auto py-1 px-1 hover:bg-gray-200 hover:rounded touch-none user-drag-none select-none"
            >
              <img
                src={item.imageUrl}
                alt={item.text}
                className="w-full h-auto select-none pointer-events-none user-drag-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
