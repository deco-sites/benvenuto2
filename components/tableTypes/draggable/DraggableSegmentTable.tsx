import { useEffect, useRef, useState } from "preact/hooks";
import { Table } from "../../../static/MockedTableObject.tsx";
import { Offset } from "../../../islands/MapEditor.tsx";

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
  const [rotationAngle, setRotationAngle] = useState(tableInfo.rotation);
  const prevRotationAngleRef = useRef(rotationAngle);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateRotation = (event: MouseEvent) => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;
        const centerY = containerRect.top + containerRect.height / 2;

        const dx = event.clientX - centerX;
        const dy = event.clientY - centerY;

        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        // Offset the rotation by the initial rotation of the component
        const initialRotation = tableInfo.rotation || 0;

        const newAngle = angle;
        const prevAngle = prevRotationAngleRef.current;
        //console.log("current:", newAngle, "previous:", prevAngle);

        // Calculate the absolute difference between newAngle and prevAngle
        let diff = Math.abs(newAngle - prevAngle);

        // If the difference is more than 180 degrees, adjust it to be the smaller angle
        if (diff > 180) {
          diff = 360 - diff;
        }
        //console.log(newAngle);
        // Check if the adjusted difference is still greater than or equal to 30 degrees
        if (diff >= 1) {
          setRotationAngle(angle - 20);
          prevRotationAngleRef.current = angle - 20;
          if (newAngle >= 110 || newAngle <= -80) {
            setChangeLabelOrientation(true);
          } else {
            setChangeLabelOrientation(false);
          }
        }
      }
    };
    if (editRotation) {
      document.addEventListener("mousemove", updateRotation);
    } else if (tableInfo.rotation != rotationAngle) {
      handleChangeRotation(tableInfo.id, rotationAngle);
    }

    return () => {
      document.removeEventListener("mousemove", updateRotation);
    };
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

  useEffect(() => {
    if (tableInfo.rotation >= 110 || tableInfo.rotation <= -80) {
      setChangeLabelOrientation(true);
    } else {
      setChangeLabelOrientation(false);
    }
  }, []);

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
  function setRotateState() {
    setEditRotation(true);
  }

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
            ? rotationAngle
            : (tableInfo.rotation != rotationAngle)
            ? rotationAngle
            : tableInfo.rotation
        }deg);`}
      >
        {editLabel
          ? (
            <input
              id="labelInput"
              class="text-[1.6vw] lg:text-[0.8vw] select-none"
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
          <>
            <button
              onClick={handleDeleteTable}
              class="text-[1.6vw] lg:text-[0.8vw] select-none "
              style={`z-index: 2; position: absolute; left: ${tableInfo.x}%; top: ${
                tableInfo.y + 2.6
              }%; height: auto; `}
            >
              {"Excluir"}
            </button>
            <button
              onClick={() => setFocusToLabel()}
              class="text-[1.6vw] lg:text-[0.8vw] select-none"
              style={`z-index: 2; position: absolute; left: ${tableInfo.x}%; top: ${
                tableInfo.y + 4.0
              }%; height: auto;`}
            >
              {"Renomear"}
            </button>
            <button
              onClick={() => setRotateState()}
              class="text-[1.6vw] lg:text-[0.8vw] select-none"
              style={`z-index: 2; position: absolute; left: ${tableInfo.x}%; top: ${
                tableInfo.y + 5.4
              }%; height: auto;`}
            >
              {"Rotacionar"}
            </button>
          </>
        )}
    </div>
  );
}
