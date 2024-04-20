import { useEffect, useRef, useState } from "preact/hooks";
import { Table } from "../../../static/MockedTableObject.tsx";

export interface Props {
  tableInfo: Table;
  deleteTable: (tableId: number) => void;
}

export default function DraggableSegmentTable({
  tableInfo,
  deleteTable,
}: Props) {
  const [isSelected, setIsSelected] = useState(false);
  const isInitialRender = useRef(true);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
  }, [tableInfo.occupied]);

  const handleTableClick = () => {
    setIsSelected(!isSelected);
  };

  const handleDeleteTable = () => {
    deleteTable(tableInfo.id);
  };

  const getImageSource = () => {
    let imageSource = "/tables/segmentGreen.png"; // Default source
    return imageSource;
  };

  return (
    <div
      key={tableInfo.id}
      onClick={handleTableClick}
    >
      <div
        style={`width: 5%; height: auto; position: absolute; top: ${tableInfo.y}%; left: ${tableInfo.x}%;`}
      >
        <p
          class="text-[1.6vw] lg:text-[0.8vw]"
          style="width: 100%; max-width: 100%; height: 40; position: absolute; top: 20%; left: -5%; margin-block-start: 0em; margin-block-end: 0em; font-weight: 500; text-align: center; z-index: 1; pointer-events: none;"
        >
          0{tableInfo.label}D
        </p>
        <img
          src={getImageSource()}
          alt={`Table ${tableInfo.label}`}
          style={`width: 100%; max-width: 100%; height: auto; transform: rotate(-${tableInfo.rotation}deg);`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />
      </div>
      {isSelected &&
        (
          <button
            onClick={handleDeleteTable}
            class="text-[1.6vw] lg:text-[0.8vw]"
            style={`position: absolute; left: ${tableInfo.x}%; top: ${
              tableInfo.y + 3.8
            }%; height: auto;`}
          >
            {"Excluir"}
          </button>
        )}
    </div>
  );
}
