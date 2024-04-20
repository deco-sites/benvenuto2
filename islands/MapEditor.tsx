import { useEffect, useRef, useState } from "preact/hooks";
import { Table, TableMap } from "../static/MockedTableObject.tsx";
import { Runtime } from "../runtime.ts";
import type { ImageWidget } from "apps/admin/widgets.ts";
import DraggableGenericTable from "../components/tableTypes/draggable/DraggableGenericTable.tsx";
import DraggableSegmentTable from "../components/tableTypes/draggable/DraggableSegmentTable.tsx";
import EditorSidebar from "deco-sites/benvenuto2/components/EditorSidebar.tsx";

export interface Props {
  tableMap: TableMap;
  backgroundImage?: ImageWidget;
}

export default function Editor({
  tableMap,
  backgroundImage = "",
}: Props) {
  const [tableMapSaved, setTableMapSaved] = useState<TableMap>(tableMap);
  const [tableMapUpdate, setTableMapUpdate] = useState<TableMap>({
    tables: [],
  });
  const [deletedTables, setDeletedTables] = useState<number[]>([]);
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

      // Filter out tables with IDs listed in deletedTables
      const tableMapSavedFiltered = data.tables.filter((table: Table) =>
        !deletedTables.includes(table.id)
      );

      console.log("Evento table atualizada: " + JSON.stringify(data));
      // Update tableMapSaved with the filtered tables
      setTableMapSaved({ tables: tableMapSavedFiltered });
    };
  }, []);

  const OnDropAddTable = (table: Table) => {
    console.log("Adicionada Table:", table.id, table.class, table.label);

    tableMapUpdate.tables.push(table);
  };

  const HandleDeleteTable = (tableId: number) => {
    const tableToDeleteUpdated = tableMapUpdate.tables.find((table) =>
      table.id === tableId
    );
    if (tableToDeleteUpdated) {
      const updatedTables = tableMapUpdate.tables.filter((table) =>
        table.id !== tableId
      );
      setTableMapUpdate({ tables: updatedTables });
    } else {
      setDeletedTables((
        prevDeletedTables,
      ) => [...prevDeletedTables, tableId]);
      const savedTables = tableMapSaved.tables.filter((table) =>
        table.id !== tableId
      );
      setTableMapSaved({ tables: savedTables });
    }
  };

  const HandleSaveNewMap = () => {
    const newTableMap: TableMap = {
      tables: [...tableMapUpdate.tables, ...tableMapSaved.tables],
    };

    console.log("Salva Table:", JSON.stringify(newTableMap));
    fetchData(newTableMap);
  };

  const fetchData = async (tableMap: TableMap) => {
    await Runtime.invoke["deco-sites/benvenuto2"].actions.actionSetMapToKV({
      empresa: "couve",
      filial: "teste",
      id: "1",
      mapJSON: JSON.stringify(tableMap),
    });
  };

  return (
    <div class="relative">
      <div class="flex justify-center font-bold text-3xl lg:text-5xl leading-tight lg:leading-none text-center lg:mt-2 lg:mb-2 ">
        {"Map Editor"}
      </div>
      <EditorSidebar />
      {backgroundImage && (
        <div class="w-full lg:w-1/2 max-w-full h-auto mx-auto relative border-2 border-black ">
          <img
            src={backgroundImage}
            alt="Your Image"
            class={`w-full `}
          />

          {tableMapSaved?.tables.map((table) => (
            table.class === "models.SquareTable"
              ? (
                <DraggableGenericTable
                  tableInfo={table}
                  deleteTable={HandleDeleteTable}
                />
              )
              : (
                <DraggableSegmentTable
                  tableInfo={table}
                  deleteTable={HandleDeleteTable}
                />
              )
          ))}
        </div>
      )}
    </div>
  );
}
