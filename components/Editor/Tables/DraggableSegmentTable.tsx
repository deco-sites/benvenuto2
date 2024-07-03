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
  setMoveUpDraggedTable: (value: boolean) => void;
  handleChangeLabel: (id: string, newLabel: string) => void;
  handleChangeRotation: (id: string, angle: number) => void;
  calculateCoordinates(event: DragEvent, type: string): number;
  calculateTouchCoordinates(event: TouchEvent, type: string): number;
  handleTouchDrop(event: TouchEvent): void;
}

export default function DraggableSegmentTable({
  tableInfo,
  deleteTable,
  setDraggedItem,
  setDraggedItemOffset,
  setMoveUpDraggedTable,
  handleChangeLabel,
  handleChangeRotation,
  calculateCoordinates,
  calculateTouchCoordinates,
  handleTouchDrop,
}: Props) {
  const [isSelected, setIsSelected] = useState(false);
  const isInitialRender = useRef(true);
  const [hovered, setHovered] = useState(false);
  const [editLabel, setEditLabel] = useState(false);
  const [editRotation, setEditRotation] = useState(false);
  const [position, setPosition] = useState({ x: tableInfo.x, y: tableInfo.y });
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
    if (newLabel != tableInfo.label) {
      handleChangeLabel(tableInfo.id, newLabel);
    }
  };

  const handleTableClick = () => {
    setIsSelected(!isSelected);
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

  const setLabelValue = (e: Event) => {
    setLabel((e.target as HTMLInputElement).value);
    handleLabelChange((e.target as HTMLInputElement).value);
  };

  const setRotateState = () => {
    setShowSlider(true);
    setEditRotation(true);
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRotation = Number((event.target as HTMLInputElement).value);
    setRotation(newRotation);
  };

  const handleDragStart = (e: DragEvent, tableInfo: Table) => {
    const offX = containerRef.current?.offsetWidth ?? 0;
    const offY = containerRef.current?.offsetHeight ?? 0;

    setDraggedItemOffset({ x: offX / 2, y: offY });
    setDraggedItem(tableInfo);
    if (!editRotation) {
      setMoveUpDraggedTable(true);
    }
    setIsSelected(false);
    setShowSlider(false);
    setEditRotation(false);

    const crt = (containerRef.current as HTMLElement).cloneNode(
      true,
    ) as HTMLElement;
    crt.style.position = "absolute";
    crt.style.top = "-6000px";
    crt.style.left = "-6000px";

    e.dataTransfer?.setDragImage(crt, 0, -9000);
  };

  function handleOnDrag(e: DragEvent) {
    const newX = calculateCoordinates(e, "x");
    const newY = calculateCoordinates(e, "y");
    setPosition({ x: newX, y: newY });
  }

  function handleDragEnd() {
    setDraggedItem(null);
    setMoveUpDraggedTable(false);
  }

  const handleTouchStart = (tableInfo: Table) => {
    const offX = containerRef.current?.offsetWidth ?? 0;
    const offY = containerRef.current?.offsetHeight ?? 0;

    setDraggedItemOffset({ x: offX / 2, y: offY });
    setDraggedItem(tableInfo);
    if (!editRotation) {
      setMoveUpDraggedTable(true);
    }
    setIsSelected(false);
    setShowSlider(false);
    setEditRotation(false);
  };

  function handleTouchMove(e: TouchEvent) {
    const newX = calculateTouchCoordinates(e, "x");
    const newY = calculateTouchCoordinates(e, "y");
    setPosition({ x: newX, y: newY });
  }

  function handleTouchDragEnd(event: TouchEvent) {
    setDraggedItem(null);
    setMoveUpDraggedTable(false);
    handleTouchDrop(event);
  }

  return (
    <div
      id={`table-${tableInfo.id}`}
      key={tableInfo.id}
    >
      <div
        ref={containerRef}
        style={`width: 5.2%; height: auto; position: absolute; top: ${position.y}%; left: ${position.x}%;  transform: rotate(${
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
              onBlur={() => setEditLabel(false)}
              onChange={(e) => setLabelValue(e)}
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
        <div
          draggable
          onTouchStart={() => handleTouchStart(tableInfo)}
          onTouchMove={(e) => handleTouchMove(e)}
          onTouchEnd={(e) => handleTouchDragEnd(e)}
          onDragStart={(e) => handleDragStart(e, tableInfo)}
          onDrag={(e) => handleOnDrag(e)}
          onDragEnd={() => handleDragEnd()}
          onMouseEnter={() => !editLabel && setHovered(true)}
          onMouseLeave={() => !editLabel && setHovered(false)}
          onClick={handleTableClick}
          class={`cursor-move touch-none`}
        >
          <img
            id={tableInfo.label}
            src={getImageSource()}
            alt={`Table ${tableInfo.label}`}
            class={`w-full select-none pointer-events-none user-drag-none`}
          />
        </div>
      </div>
      {(isSelected && !editLabel && !editRotation) &&
        (
          <EditorTableOptions
            setFocusToLabel={() => {
              setEditLabel(true);
              setIsSelected(false);
            }}
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
