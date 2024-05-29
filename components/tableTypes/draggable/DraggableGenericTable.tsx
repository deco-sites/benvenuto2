import { useEffect, useRef, useState } from "preact/hooks";
import { Table } from "../../../static/MockedTableObject.tsx";
import { Offset } from "../../../islands/MapEditor.tsx";
import SliderComponent from "./SliderComponent.tsx";

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
}

export default function DraggableGenericTable({
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
    setDraggedItemOffset({ x: e.offsetX, y: e.offsetY });
    setDraggedItem(tableInfo);
    /*
    console.log(rotation);

    const targetImg = document.getElementById("img-div") as HTMLElement;

    const targetElement = containerRef.current as HTMLElement;

    const crt = targetElement.cloneNode(true) as HTMLElement;
    const specificImg = crt.querySelector("img") as HTMLElement;

    //crt.style.backgroundColor = "red";
    crt.style.zIndex = "5";
    //crt.style.width = "5%";
    specificImg.style.transform = `rotate(${rotationAngle}deg)`;
   // crt.style.borderStyle = "solid"; // Set the border style
   // crt.style.borderColor = "blue";
    //crt.style.borderWidth = "1px";
    crt.style.position = "absolute";

    crt.style.top = "200px";
    crt.style.left = "100px";
    targetImg.appendChild(crt);

    console.log("id", crt.id);
    console.log("color", crt.style.color);
    console.log("transform", crt.style.transform);
    console.log("width", crt.style.width);
    console.log("height", crt.style.height);
    console.log("border", crt.style.borderStyle);
    console.log("borderColor", crt.style.borderColor);
    console.log("borderWidth", crt.style.borderWidth);

    e.dataTransfer?.setDragImage(crt, e.offsetX, e.offsetY);*/
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
        id={`table-${tableInfo.id}-inner`}
        ref={containerRef}
        style={`width: 5%; height: auto; position: absolute; top: ${tableInfo.y}%; left: ${tableInfo.x}%; transform: rotate(${
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
              class="text-[1.6vw] lg:text-[0.8vw] select-none rounded-md"
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
          style={`width: 100%; max-width: 100%; height: auto;);`}
          onMouseEnter={() => !editLabel && setHovered(true)}
          onMouseLeave={() => !editLabel && setHovered(false)}
          draggable
          onDragStart={(e) => handleDragStart(e, tableInfo)}
          onDragEnd={() => handleDragEnd()}
        />
      </div>
      {(isSelected && !editLabel && !editRotation) &&
        (
          <div
            class="text-[1.6vw] lg:text-[0.8vw] flex flex-col pt-[0.35rem] pb-[0.35rem] pl-1 pr-1 bg-white rounded-md shadow-md"
            style={`z-index: 2; position: absolute; left: ${tableInfo.x}%; top: ${
              tableInfo.y + 3.8
            }%;`}
          >
            <button
              onClick={() => setFocusToLabel()}
              class=" select-none p-1 flex items-center rounded hover:bg-gray-200"
              style="height: auto;"
            >
              <span class="mr-2">✏️</span>
              {"Renomear"}
            </button>

            <button
              onClick={setRotateState}
              class=" select-none p-1 flex items-center rounded hover:bg-gray-200"
              style="height: auto;"
            >
              <span class="mr-2">🔄</span>
              Rotacionar
            </button>

            <button
              onClick={handleDeleteTable}
              class=" select-none p-1 flex items-center rounded hover:bg-gray-200"
              style="height: auto;"
            >
              <span class="mr-2">🗑️</span>
              {"Deletar"}
            </button>
          </div>
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
