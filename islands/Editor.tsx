import { useSignal } from "@preact/signals";
import { useEffect, useRef, useState } from "preact/hooks";
import { TableMap } from "../static/MockedTableObject.tsx";
import GenericTable from "../components/GenericTable.tsx";
import { Runtime } from "../runtime.ts";

export interface Props {
  tableMap: TableMap;
}

export default function Editor({
  tableMap,
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
    <div>
      <header class="lg:container mx-auto md:mx-16 lg:mx-auto mt-8 md:mt-12 mb-28 text-xl md:text-base flex flex-col items-center justify-center">
        <div class="mb-10 md:mb-20 flex justify-center ">
          <div class="font-bold text-3xl lg:text-6xl leading-tight lg:leading-none xl:w-5/6 text-center">
            {"Editor"}
          </div>
        </div>
      </header>

      <div>
        {tableMapUpdate.tables.map((table) => (
          <GenericTable
            tableInfo={table}
            updateOccupiedState={updateOccupiedState}
          />
        ))}
      </div>

      {/*Signal*/}
      <div class="p-2">
        <button onClick={() => countSignal.value--}>
          -
        </button>
        <span class="p-1">Signal: {countSignal}</span>
        <button onClick={() => countSignal.value++}>
          +
        </button>
      </div>

      {/*useState*/}
      <div class="p-2">
        <button onClick={() => setcountState(countState - 1)}>
          -
        </button>
        <span class="p-1">useState: {countState}</span>
        <button onClick={() => setcountState(countState + 1)}>
          +
        </button>
      </div>
    </div>
  );
}