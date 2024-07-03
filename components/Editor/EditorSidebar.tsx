import { Offset } from "../../islands/MapEditor.tsx";

export interface Props {
  setDraggedItemOffset: (offset: Offset) => void;
}

export default function EditorSidebar({
  setDraggedItemOffset,
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

  const handleDragStart = (e: DragEvent, item: Item) => {
    setDraggedItemOffset({ x: e.offsetX, y: e.offsetY });
    e.dataTransfer?.setData("Model", item.model);
  };

  return (
    <div
      className="absolute left-0 w-[7%] lg:w-[3.3%] h-auto top-[48px] bg-white overflow-y-auto  border-solid border-r-2 border-b-2 border-gray-300 rounded-br-md z-10"
      style="z-index: 3"
      onDragOver={(event) => event.preventDefault()}
    >
      <div className="h-[10%]">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-1 pt-2 pb-3"
          >
            <img
              src={item.imageUrl}
              alt={item.text}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              className="w-full h-auto py-1 px-1 hover:bg-gray-200 hover:rounded select-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
