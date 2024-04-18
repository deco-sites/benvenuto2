import { useSignal } from "@preact/signals";
import { useEffect, useRef, useState } from "preact/hooks";
import { TableMap } from "../static/MockedTableObject.tsx";
import GenericTable from "../components/GenericTable.tsx";
import { Runtime } from "../runtime.ts";
import type { ImageWidget } from "apps/admin/widgets.ts";
import SegmentTable from "deco-sites/benvenuto2/components/SegmentTable.tsx";

export interface Props {
  tableMap: TableMap;
  backgroundImage?: ImageWidget;
  backgroundImageWidth?: string;
  backgroundImageHeight?: string;
}

export default function Editor({
  tableMap,
  backgroundImage = "",
  backgroundImageWidth = "100%",
  backgroundImageHeight = "auto",
}: Props) {
  const countSignal = useSignal(0);
  const [countState, setcountState] = useState(0);
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
    await Runtime.invoke["deco-sites/benvenuto2"].actions.actionSetMapToKV({
      empresa: "couve",
      filial: "teste",
      id: "1",
      mapJSON: JSON.stringify(tableMap),
    });
  };

  const updateOccupiedState = (tableId: number, newOccupiedState: boolean) => {
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
    <div class="relative">
      <div class="flex justify-center font-bold text-3xl lg:text-5xl leading-tight lg:leading-none text-center lg:mt-2 lg:mb-2 ">
        {"Editor"}
      </div>
      {backgroundImage && (
        <div class="w-full lg:w-1/2 max-w-full h-auto mx-auto relative border-2 border-black ">
          <img
            src={backgroundImage}
            alt="Your Image"
            class={`w-full `}
          />

          {tableMapUpdate.tables.map((table) => (
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

      {
        /*
      <div class="p-2">
        <button onClick={() => countSignal.value--}>-</button>
        <span class="p-1">Signal: {countSignal}</span>
        <button onClick={() => countSignal.value++}>+</button>
      </div>

      <div class="p-2">
        <button onClick={() => setcountState(countState - 1)}>-</button>
        <span class="p-1">useState: {countState}</span>
        <button onClick={() => setcountState(countState + 1)}>+</button>
      </div>
      */
      }
    </div>
  );
}
