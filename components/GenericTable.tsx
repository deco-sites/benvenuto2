import { useSignal } from "@preact/signals";
import { useState } from "preact/hooks";
import { Table } from "../static/MockedTableObject.tsx";

export interface Props {
  tableInfo: Table;
}

export default function GenericTable({
  tableInfo,
}: Props) {
  const countSignal = useSignal(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSelected, setIsSelected] = useState(false);

  const handleAvailableState = () => {
    setIsAvailable(!isAvailable);
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
