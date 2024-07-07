import { useEffect, useRef, useState } from "preact/hooks";
import { Table } from "../../../static/MockedTableObject.tsx";
import MapTableOptions from "./ManagementTableOptions.tsx";

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
  const [changeLabelOrientation, setChangeLabelOrientation] = useState(false);

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
      if (isSelected && !target.closest(`#table-${tableInfo.id}`)) {
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
    if (tableInfo.rotation >= 95 && tableInfo.rotation <= 265) {
      setChangeLabelOrientation(true);
    } else {
      setChangeLabelOrientation(false);
    }
  }, [tableInfo]);

  const handleAvailableState = () => {
    setIsSelected(!isSelected);
    setIsAvailable(!isAvailable);
    updateOccupiedState(tableInfo.id, !tableInfo.occupied);
  };

  const handleTableClick = () => {
    setIsSelected(!isSelected);
  };

  const getImageSource = () => {
    let imageSource = "/tables/tableGreen.png"; // Default source
    imageSource = isAvailable
      ? (isSelected || hovered
        ? "/tables/segmentLightGreen.png"
        : "/tables/segmentGreen.png")
      : (isSelected || hovered
        ? "/tables/segmentLightYellow.png"
        : "/tables/segmentRed.png");
    return imageSource;
  };

  return (
    <div
      id={`table-${tableInfo.id}`}
      key={tableInfo.id}
    >
      <div
        onClick={handleTableClick}
        style={`width: 5.2%; height: auto; position: absolute; top: ${tableInfo.y}%; left: ${tableInfo.x}%; transform: rotate(${tableInfo.rotation}deg);`}
      >
        <p
          class="text-[1.6vw] lg:text-[0.8vw] select-none"
          style={`width: 100%; max-width: 100%; height: auto; position: absolute; top: ${
            changeLabelOrientation ? "35" : "30"
          }%; left: -5%; 
          ${
            changeLabelOrientation ? "transform: scale(-1, -1)" : "none"
          }; margin-block-start: 0em; margin-block-end: 0em; font-weight: 500; text-align: center; z-index: 1; pointer-events: none;`}
        >
          {tableInfo.label}
        </p>
        <img
          src={getImageSource()}
          alt={`Table ${tableInfo.label}`}
          class="select-none"
          style={`width: 100%; max-width: 100%; height: auto; `}
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
            offsetY={-0.5}
          />
        )}
    </div>
  );
}
