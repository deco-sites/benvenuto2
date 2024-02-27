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
  console.log("mesa: " + tableInfo.id + ", occupied: " + tableInfo.occupied);
  console.log("isavailible: " + isAvailable);

    // Update isAvailable state when tableInfo.occupied changes
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
    // Set isSelected to false when the table is clicked
    setIsSelected(!isSelected);
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
        src={isAvailable ? "/tables/greenTable.png" : "/tables/redTable.png"}
        alt={`Table ${tableInfo.label}`}
        style={`position: absolute; left: ${tableInfo.x}px; top: ${tableInfo.y}px; transform: rotate(-${tableInfo.rotation}deg);`}
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
