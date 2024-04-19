import { useEffect, useRef, useState } from "preact/hooks";
import { Table } from "../../static/MockedTableObject.tsx";

export interface Props {
  tableInfo: Table;
  updateOccupiedState: (tableId: number, newOccupiedState: boolean) => void;
}

export default function GenericTable({
  tableInfo,
  updateOccupiedState,
}: Props) {
  const [isAvailable, setIsAvailable] = useState(!tableInfo?.occupied);
  const [isSelected, setIsSelected] = useState(false);
  const isInitialRender = useRef(true);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    setIsAvailable(!tableInfo.occupied);
  }, [tableInfo.occupied]);

  const handleAvailableState = () => {
    setIsAvailable(!isAvailable);
    updateOccupiedState(tableInfo.id, !tableInfo.occupied);
  };

  const handleTableClick = () => {
    setIsSelected(!isSelected);
  };

  const getImageSource = () => {
    let imageSource = "/tables/tableGreen.png"; // Default source
    imageSource = isAvailable
      ? (hovered ? "/tables/segmentLightGreen.png" : "/tables/segmentGreen.png")
      : (hovered ? "/tables/segmentLightYellow.png" : "/tables/segmentRed.png");
    return imageSource;
  };

  return (
    <div
      key={tableInfo.id}
      onClick={handleTableClick}
    >
      <div
        style={`width: 6%; height: auto; border: 2px solid blue; position: absolute; top: ${tableInfo.y}%; left: ${tableInfo.x}%;`}
      >
        <p
          class="text-[1.6vw] lg:text-[0.8vw]"
          style="width: 100%; max-width: 100%; height: auto; position: absolute; top: 30%; left: -5%; margin-block-start: 0em; margin-block-end: 0em; font-weight: 500; text-align: center; z-index: 1; pointer-events: none;"
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
            onClick={handleAvailableState}
            class="text-[1.6vw] lg:text-[0.8vw]"
            style={`position: absolute; left: ${tableInfo.x}%; top: ${
              tableInfo.y + 2.8
            }%;`}
          >
            {isAvailable ? "Ocupar" : "Desocupar"}
          </button>
        )}
    </div>
  );
}
