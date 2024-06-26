import { useEffect, useRef, useState } from "preact/hooks";
import { Table } from "../../../static/MockedTableObject.tsx";
import { Offset } from "../../../islands/MapEditor.tsx";
import SliderComponent from "./SliderComponent.tsx";
import EditorTableOptions from "./EditorTableOptions.tsx";

export interface Props {
  tableInfo: Table;
  deleteTable: (tableId: string) => void;
  setDraggedItem: (table: Table | null) => void;
  setDraggedItemOffset: (offset: Offset) => void;
  handleChangeLabel: (id: string, newLabel: string) => void;
  handleChangeRotation: (id: string, angle: number) => void;
}

export default function DraggableSegmentTable({
  tableInfo,
  deleteTable,
  setDraggedItem,
  setDraggedItemOffset,
  handleChangeLabel,
  handleChangeRotation,
}: Props) {
  const [isSelected, setIsSelected] = useState(false);
  const isInitialRender = useRef(true);
  const [hovered, setHovered] = useState(false);
  const [editLabel, setEditLabel] = useState(false);
  const [editRotation, setEditRotation] = useState(false);
  const [changeLabelOrientation, setChangeLabelOrientation] = useState(false);
  const [label, setLabel] = useState(tableInfo.label);
  const [rotation, setRotation] = useState(tableInfo.rotation);
  const [showSlider, setShowSlider] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rotation >= 95 && rotation <= 265) {
      setChangeLabelOrientation(true);
    } else {
      setChangeLabelOrientation(false);
    }
  }, [rotation]);

  useEffect(() => {
    if (tableInfo.rotation != rotation) {
      console.log(tableInfo.label, tableInfo.rotation, rotation);
      handleChangeRotation(tableInfo.id, rotation);
    }
  }, [editRotation]);

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
        setEditRotation(false);
        setShowSlider(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSelected]);

  useEffect(() => {
    if (editLabel) {
      (document.getElementById("labelInput") as HTMLInputElement)?.focus();
    }
  }, [editLabel]);

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
    let imageSource = "/tables/tableGreen.png"; // Default source
    imageSource = isSelected || hovered
      ? "/tables/segmentLightGreen.png"
      : "/tables/segmentGreen.png";
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
  }
  const setRotateState = () => {
    setShowSlider(true);
    setEditRotation(true);
  };
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRotation = Number((event.target as HTMLInputElement).value);
    setRotation(newRotation);
  };

  return (
    <div
      id={`table-${tableInfo.id}`}
      key={tableInfo.id}
      onClick={handleTableClick}
    >
      <div
        ref={containerRef}
        style={`width: 5.2%; height: auto; position: absolute; top: ${tableInfo.y}%; left: ${tableInfo.x}%;  transform: rotate(${
          editRotation
            ? rotation
            : (tableInfo.rotation != rotation)
            ? rotation
            : tableInfo.rotation
        }deg);`}
      >
        {editLabel
          ? (
            <input
              id="labelInput"
              class="text-[1.6vw] lg:text-[0.8vw] select-none lg:rounded-md rounded-sm"
              style={`width: 100%; max-width: 100%; height: 40; position: absolute; top: 30%; left: -5%; margin-block-start: 0em; margin-block-end: 0em; font-weight: 500; text-align: center; z-index: 1; ${
                changeLabelOrientation ? "transform: scale(-1, -1)" : "none"
              };`}
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
              style={`width: 100%; max-width: 100%; height: 40; position: absolute; top: ${
                changeLabelOrientation ? "35" : "30"
              }%; left: -5%; margin-block-start: 0em; margin-block-end: 0em; font-weight: 500; text-align: center; z-index: 1; pointer-events: none;
              ${changeLabelOrientation ? "transform: scale(-1, -1)" : "none"};`}
            >
              {tableInfo.label}
            </p>
          )}
        <img
          src={getImageSource()}
          alt={`Table ${tableInfo.label}`}
          style={`width: 100%; max-width: 100%; height: auto; transform: rotate(${0}deg);`}
          onMouseEnter={() => !editLabel && setHovered(true)}
          onMouseLeave={() => !editLabel && setHovered(false)}
          draggable
          onDragStart={(e) => handleDragStart(e, tableInfo)}
          onDragEnd={() => handleDragEnd()}
        />
      </div>
      {(isSelected && !editLabel && !editRotation) &&
        (
          <EditorTableOptions
            setFocusToLabel={setFocusToLabel}
            setRotateState={setRotateState}
            handleDeleteTable={handleDeleteTable}
            tableInfo={tableInfo}
            offsetX={0}
            offsetY={-0.3}
          />
        )}
      {showSlider && (
        <SliderComponent
          rotation={rotation}
          handleSliderChange={handleSliderChange}
          tableInfo={tableInfo}
          offsetX={0}
          offsetY={-1}
        />
      )}
    </div>
  );
}
