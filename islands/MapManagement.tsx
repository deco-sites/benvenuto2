import { useSignal } from "@preact/signals";
import { useEffect, useRef, useState } from "preact/hooks";
import { TableMap } from "../static/MockedTableObject.tsx";
import GenericTable from "../components/TableMap/Tables/GenericTable.tsx";
import { Runtime } from "../runtime.ts";
import type { ImageWidget } from "apps/admin/widgets.ts";
import SegmentTable from "../components/TableMap/Tables/SegmentTable.tsx";
import TableMapTopBar from '../components/TableMap/ManagementTopBar.tsx';

export interface Props {
  tableMap: TableMap;
  backgroundImage?: ImageWidget;
}

export default function Editor({
  tableMap,
  backgroundImage = "",
}: Props) {
  const [tableMapUpdate, setTableMapUpdate] = useState<TableMap>(tableMap);
  const isInitialRender = useRef(true);

  useEffect(() => {
    console.log("Realiza evento");

    const eventSource = new EventSource(`/sse/tables`);
    eventSource.onerror = (err) => {
      console.log("Connection Error");
      eventSource.close();
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Evento table atualizada: " + JSON.stringify(data));
      setTableMapUpdate(data);
    };
  }, []);

  const fetchData = async (tableMap: TableMap) => {
    await Runtime.invoke["site"].actions.actionSetMapToKV({
      empresa: "couve",
      filial: "teste",
      id: "1",
      mapJSON: JSON.stringify(tableMap),
    });
  };

  const updateOccupiedState = (tableId: string, newOccupiedState: boolean) => {
    console.log("Table antes:", JSON.stringify(tableMapUpdate));

    const updatedTables = tableMapUpdate.tables.map((table) => {
      return table.id === tableId
        ? { ...table, occupied: newOccupiedState }
        : table;
    });

    const updatedTableMap = { ...tableMapUpdate, tables: updatedTables };

    fetchData(updatedTableMap);

    return updatedTableMap;
  };

  return (
    <div class="relative select-none">
      <TableMapTopBar/>
      {backgroundImage && (
        <div class="w-full lg:w-1/2 max-w-full h-auto mx-auto relative border-2 border-black ">
          <img
            src={backgroundImage}
            alt="Your Image"
            class={`w-full select-none pointer-events-none user-drag-none`}
          />

          {tableMapUpdate?.tables.map((table) => (
            table.class === "models.SquareTable"
              ? (
                <GenericTable
                  tableInfo={table}
                  updateOccupiedState={updateOccupiedState}
                />
              )
              : (
                <SegmentTable
                  tableInfo={table}
                  updateOccupiedState={updateOccupiedState}
                />
              )
          ))}
        </div>
      )}
    </div>
  );
}
