import { useEffect, useRef, useState } from "preact/hooks";
import { Table } from "../../../static/MockedTableObject.tsx";
import { Offset } from "../../../islands/MapEditor.tsx";

export interface Props {
  tableInfo: Table;
  deleteTable: (tableId: string) => void;
  setDraggedItem: (table: Table | null) => void;
  setDraggedItemOffset: (offset: Offset) => void;
  handleChangeLabel: (id: string, newLabel: string) => void;
}

export default function DraggableSegmentTable({
  tableInfo,
  deleteTable,
  setDraggedItem,
  setDraggedItemOffset,
  handleChangeLabel,
}: Props) {
  const [isSelected, setIsSelected] = useState(false);
  const isInitialRender = useRef(true);
  const [hovered, setHovered] = useState(false);
  const [editLabel, setEditLabel] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest(`#table-${tableInfo.id}`)) {
        setIsSelected(false);
        setEditLabel(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSelected]);

  const handleLabelChange = (newLabel: string) => {
    if (newLabel != "" && newLabel != tableInfo.label) {
      console.log("change Label");
      handleChangeLabel(tableInfo.id, newLabel);
    }
  };

  const handleTableClick = () => {
    setIsSelected(true);
  };

  const handleDeleteTable = () => {
    deleteTable(tableInfo.id);
  };

  const getImageSource = () => {
    let imageSource = "/tables/segmentGreen.png"; // Default source
    return imageSource;
  };

  const handleDragStart = (e: DragEvent, tableInfo: Table) => {
    setDraggedItemOffset({ x: e.offsetX, y: e.offsetY });
    setDraggedItem(tableInfo);
  };

  function handleDragEnd() {
    setDraggedItem(null);
  }

  function setFocusToLabel() {
    setEditLabel(true);
    (document.getElementById("labelInput") as HTMLInputElement)?.focus();
  }

  return (
    <div
      id={`table-${tableInfo.id}`}
      key={tableInfo.id}
      onClick={handleTableClick}
    >
      <div
        style={`width: 5%; height: auto; position: absolute; top: ${tableInfo.y}%; left: ${tableInfo.x}%;`}
      >
        {editLabel
          ? (
            <input
              id="labelInput"
              class="text-[1.6vw] lg:text-[0.8vw] select-none"
              style="width: 100%; max-width: 100%; height: 40; position: absolute; top: 20%; left: -5%; margin-block-start: 0em; margin-block-end: 0em; font-weight: 500; text-align: center; z-index: 1;"
              type="text"
              placeholder={tableInfo.label}
              value={label}
              onBlur={(e) =>
                handleLabelChange((e.target as HTMLInputElement).value)}
              onChange={(e) => setLabel((e.target as HTMLInputElement).value)}
            />
          )
          : (
            <p
              class="text-[1.6vw] lg:text-[0.8vw] select-none"
              style="width: 100%; max-width: 100%; height: 40; position: absolute; top: 20%; left: -5%; margin-block-start: 0em; margin-block-end: 0em; font-weight: 500; text-align: center; z-index: 1; pointer-events: none;"
            >
              {tableInfo.label}
            </p>
          )}
        <img
          src={getImageSource()}
          alt={`Table ${tableInfo.label}`}
          style={`width: 100%; max-width: 100%; height: auto; transform: rotate(-${tableInfo.rotation}deg);`}
          onMouseEnter={() => !editLabel && setHovered(true)}
          onMouseLeave={() => !editLabel && setHovered(false)}
          draggable
          onDragStart={(e) => handleDragStart(e, tableInfo)}
          onDragEnd={() => handleDragEnd()}
        />
      </div>
      {isSelected &&
        (
          <>
            <button
              onClick={handleDeleteTable}
              class="text-[1.6vw] lg:text-[0.8vw] select-none"
              style={`z-index: 2; position: absolute; left: ${tableInfo.x}%; top: ${
                tableInfo.y + 2.8
              }%; height: auto;`}
            >
              {"Excluir"}
            </button>
            <button
              onClick={() => setFocusToLabel()}
              class="text-[1.6vw] lg:text-[0.8vw] select-none"
              style={`z-index: 2; position: absolute; left: ${tableInfo.x}%; top: ${
                tableInfo.y + 4
              }%; height: auto;`}
            >
              {"Renomear"}
            </button>
          </>
        )}
    </div>
  );
}
