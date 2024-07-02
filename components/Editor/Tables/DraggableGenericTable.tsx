import { useEffect, useRef, useState } from "preact/hooks";
import { Table } from "../../../static/MockedTableObject.tsx";
import { Offset } from "../../../islands/MapEditor.tsx";
import SliderComponent from "./SliderComponent.tsx";
import EditorTableOptions from "./EditorTableOptions.tsx";
//import BorderColorSharpIcon from '@mui/icons-material/BorderColorSharp';

enum LabelOrientation {
  Left = "left",
  Right = "right",
  Top = "top",
}

export interface Props {
  tableInfo: Table;
  deleteTable: (tableId: string) => void;
  setDraggedItem: (table: Table | null) => void;
  setDraggedItemOffset: (offset: Offset) => void;
  handleChangeLabel: (id: string, newLabel: string) => void;
  handleChangeRotation: (id: string, angle: number) => void;
  calculateCoordinates(event: DragEvent, type: string): number;
}

export default function DraggableGenericTable({
  tableInfo,
  deleteTable,
  setDraggedItem,
  setDraggedItemOffset,
  handleChangeLabel,
  handleChangeRotation,
  calculateCoordinates,
}: Props) {
  const [isSelected, setIsSelected] = useState(false);
  const isInitialRender = useRef(true);
  const [hovered, setHovered] = useState(false);
  const [editLabel, setEditLabel] = useState(false);
  const [editRotation, setEditRotation] = useState(false);
  const [position, setPosition] = useState({ x: tableInfo.x, y: tableInfo.y });
  const isDragged = useRef(false);
  const [changeLabelOrientation, setChangeLabelOrientation] = useState<
    LabelOrientation
  >(
    LabelOrientation.Top,
  );

  const [label, setLabel] = useState(tableInfo.label);
  const [rotationAngle, setRotationAngle] = useState(tableInfo.rotation);
  const [rotation, setRotation] = useState(tableInfo.rotation);
  const [showSlider, setShowSlider] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      rotation >= 45 && rotation <= 135
    ) {
      setChangeLabelOrientation(LabelOrientation.Left);
    } else if (rotation >= 225 && rotation <= 315) {
      setChangeLabelOrientation(LabelOrientation.Right);
    } else {
      setChangeLabelOrientation(LabelOrientation.Top);
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

    // Event listener for clicks outside the component
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
    setIsSelected(true);
  };

  const handleDeleteTable = () => {
    deleteTable(tableInfo.id);
  };

  const getImageSource = () => {
    let imageSource = "/tables/tableGreen.png"; // Default source

    if (tableInfo.class == "models.SquareTable") {
      imageSource = isSelected || hovered
        ? "/tables/tableLightGreen.png"
        : "/tables/tableGreen.png";
    }
    return imageSource;
  };

  const handleDragStart = (e: DragEvent, tableInfo: Table) => {


    const offX = containerRef.current?.offsetWidth ?? 0;
    const offY = containerRef.current?.offsetHeight ?? 0;

    setDraggedItemOffset({ x: offX/2, y: offY/2 });
    setDraggedItem(tableInfo);


    const targetImg = document.getElementById("img-div") as HTMLElement;

    const targetElement = containerRef.current as HTMLElement;

    const crt = targetElement.cloneNode(true) as HTMLElement;
    const specificImg = crt.querySelector("img") as HTMLElement;


    crt.style.zIndex = "-5";
    crt.style.width = "0%";
    specificImg.style.transform = `rotate(${rotation}deg)`;
    specificImg.style.display = "hidden";
    crt.style.borderStyle = "solid"; // Set the border style
    crt.style.borderColor = "blue";
    crt.style.borderWidth = "1px";
    crt.style.position = "absolute";
    crt.style.display = "hidden";

    crt.style.top = "-2000px";
    crt.style.left = "-2000px";
    targetImg.appendChild(crt);   

    e.dataTransfer?.setDragImage(crt, 0, 0);

    setTimeout(() => {
      targetImg.removeChild(crt);
    }, 0);
  };

  function handleDragEnd() {
    setDraggedItem(null);
  }

  function handleOnDrag(e: DragEvent) {
    //console.log(calculateCoordinates(e, "x"));
    const newX = calculateCoordinates(e, "x");
    const newY =calculateCoordinates(e, "y");
    setPosition({ x: newX, y: newY });
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
        id={`table-${tableInfo.id}-inner`}
        ref={containerRef}
        style={`width: 5%; height: auto; position: absolute; top: ${position.y}%; left: ${position.x}%; transform: rotate(${
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
              style={`width: 100%; max-width: 100%; height: 40; position: absolute; top: ${
                changeLabelOrientation === LabelOrientation.Left
                  ? "30"
                  : changeLabelOrientation === LabelOrientation.Right
                  ? "30"
                  : "20"
              }%; left: ${
                changeLabelOrientation === LabelOrientation.Left
                  ? "-10"
                  : changeLabelOrientation === LabelOrientation.Right
                  ? "0"
                  : "-5"
              }%;
              margin-block-start: 0em; margin-block-end: 0em; font-weight: 500; text-align: center; z-index: 1;
              transform:${
                changeLabelOrientation === LabelOrientation.Left
                  ? "rotate(-90deg)"
                  : changeLabelOrientation === LabelOrientation.Right
                  ? "rotate(90deg)"
                  : "none"
              }`}
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
                changeLabelOrientation === LabelOrientation.Left
                  ? "30"
                  : changeLabelOrientation === LabelOrientation.Right
                  ? "30"
                  : "20"
              }%; left: ${
                changeLabelOrientation === LabelOrientation.Left
                  ? "-10"
                  : changeLabelOrientation === LabelOrientation.Right
                  ? "0"
                  : "-5"
              }%; margin-block-start: 0em; margin-block-end: 0em; font-weight: 500; text-align: center; z-index: 1; pointer-events: none;
              transform:${
                changeLabelOrientation === LabelOrientation.Left
                  ? "rotate(-90deg)"
                  : changeLabelOrientation === LabelOrientation.Right
                  ? "rotate(90deg)"
                  : "none"
              }
              `}
            >
              {tableInfo.label}
            </p>
          )}
        <img
          id={tableInfo.label}
          src={getImageSource()}
          alt={`Table ${tableInfo.label}`}
          draggable
          onDragStart={(e) => handleDragStart(e, tableInfo)}
          onDrag={(e) => handleOnDrag(e)}
          onDragEnd={() => handleDragEnd()}
          style={`width: 100%; max-width: 100%; height: auto;);`}
          onMouseEnter={() => !editLabel && setHovered(true)}
          onMouseLeave={() => !editLabel && setHovered(false)}
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
            offsetY={0.5}
          />
        )}
      {showSlider && (
        <SliderComponent
          rotation={rotation}
          handleSliderChange={handleSliderChange}
          tableInfo={tableInfo}
          offsetX={0}
          offsetY={0}
        />
      )}
    </div>
  );
}
