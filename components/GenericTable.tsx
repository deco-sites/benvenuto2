import { useEffect, useRef, useState } from "preact/hooks";
import { Table } from "../static/MockedTableObject.tsx";

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

    if (tableInfo.class == "models.SquareTable") {
      imageSource = isAvailable
        ? (hovered ? "/tables/tableLightGreen.png" : "/tables/tableGreen.png")
        : (hovered ? "/tables/tableLightYellow.png" : "/tables/tableRed.png");
    } else {
      imageSource = isAvailable
        ? (hovered
          ? "/tables/segmentLightGreen.png"
          : "/tables/segmentGreen.png")
        : (hovered
          ? "/tables/segmentLightYellow.png"
          : "/tables/segmentRed.png");
    }
    return imageSource;
  };

  return (
    <div key={tableInfo.id} onClick={handleTableClick}>
      <h2
        style={`position: absolute; left: ${tableInfo.x}px; top: ${
          tableInfo.y - 30
        }px;`}
      >
        Table: {tableInfo.label}
      </h2>

      <img
        src={getImageSource()}
        alt={`Table ${tableInfo.label}`}
        style={`position: absolute; left: ${tableInfo.x}px; top: ${tableInfo.y}px; transform: rotate(-${tableInfo.rotation}deg);`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {isSelected &&
        (
          <button
            onClick={handleAvailableState}
            style={`position: absolute; left: ${tableInfo.x}px; top: ${
              tableInfo.y + 60
            }px;`}
          >
            {isAvailable ? "Ocupar" : "Desocupar"}
          </button>
        )}
    </div>
  );
}
