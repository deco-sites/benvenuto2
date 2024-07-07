import { useEffect, useRef, useState } from "preact/hooks";
import { Table } from "../../../static/MockedTableObject.tsx";
import MapTableOptions from "./ManagementTableOptions.tsx";

enum LabelOrientation {
  Left = "left",
  Right = "right",
  Top = "top",
}

export interface Props {
  tableInfo: Table;
  updateOccupiedState: (tableId: string, newOccupiedState: boolean) => void;
}

export default function GenericTable({
  tableInfo,
  updateOccupiedState,
}: Props) {
  const [isAvailable, setIsAvailable] = useState(!tableInfo?.occupied);
  const [isSelected, setIsSelected] = useState(false);
  const isInitialRender = useRef(true);
  const [hovered, setHovered] = useState(false);
  const [changeLabelOrientation, setChangeLabelOrientation] = useState<
    LabelOrientation
  >(
    LabelOrientation.Top,
  );

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    setIsSelected(false);
    setIsAvailable(!tableInfo.occupied);
  }, [tableInfo.occupied]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest(`#table-${tableInfo.id}`)) {
        console.log("clica fora");
        setIsSelected(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSelected]);

  useEffect(() => {
    if (
      tableInfo.rotation >= 45 && tableInfo.rotation <= 135
    ) {
      setChangeLabelOrientation(LabelOrientation.Left);
    } else if (tableInfo.rotation >= 225 && tableInfo.rotation <= 315) {
      setChangeLabelOrientation(LabelOrientation.Right);
    } else {
      setChangeLabelOrientation(LabelOrientation.Top);
    }
  }, [tableInfo]);

  const handleAvailableState = () => {
    setIsAvailable(!isAvailable);
    updateOccupiedState(tableInfo.id, !tableInfo.occupied);
  };

  const handleTableClick = () => {
    setIsSelected(!isSelected);
  };

  const getImageSource = () => {
    let imageSource = "/tables/tableGreen.png"; // Default source

    if (tableInfo.class == "models.SquareTable") {
      imageSource = isAvailable
        ? (isSelected || hovered
          ? "/tables/tableLightGreen.png"
          : "/tables/tableGreen.png")
        : (isSelected || hovered
          ? "/tables/tableLightYellow.png"
          : "/tables/tableRed.png");
    }
    return imageSource;
  };

  return (
    <div
      id={`table-${tableInfo.id}`}
      key={tableInfo.id}
      onClick={handleTableClick}
    >
      <div
        style={`width: 5%; height: auto; position: absolute; top: ${tableInfo.y}%; left: ${tableInfo.x}%; transform: rotate(${tableInfo.rotation}deg`}
      >
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
          }%; 
          transform:${
            changeLabelOrientation === LabelOrientation.Left
              ? "rotate(-90deg)"
              : changeLabelOrientation === LabelOrientation.Right
              ? "rotate(90deg)"
              : "none"
          }; margin-block-start: 0em; margin-block-end: 0em; font-weight: 500; text-align: center; z-index: 1; pointer-events: none;`}
        >
          {tableInfo.label}
        </p>
        <img
          src={getImageSource()}
          alt={`Table ${tableInfo.label}`}
          class="select-none"
          style={`width: 100%; max-width: 100%; height: auto; );`}
          draggable={false}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />
      </div>
      {isSelected &&
        (
          <MapTableOptions
            handleAvailableState={handleAvailableState}
            isAvailable={isAvailable}
            tableInfo={tableInfo}
            offsetX={0}
            offsetY={0.5}
          />
        )}
    </div>
  );
}
