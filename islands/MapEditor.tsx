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
  const [draggedItem, setDraggedItem] = useState<Table | null>(null);
  const isInitialRender = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);

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

  function handleOnDrop(event: DragEvent) {
    event.preventDefault();

    const model = event.dataTransfer?.getData("Model") as string;
    const updatedTables = [...tableMapUpdate.tables];

    if (model !== "") {
      console.log("New");
      const newItem: Table = {
        class: model,
        id: 50,
        label: "XX",
        rotation: 0,
        x: calculateCoordinates(event, "x"),
        y: calculateCoordinates(event, "y"),
        occupied: false,
        places: [],
      };
      updatedTables.push(newItem);
      setTableMapUpdate({ tables: updatedTables });
    } else if (draggedItem !== null) {
      const newItem: Table = {
        ...draggedItem,
        x: calculateCoordinates(event, "x"),
        y: calculateCoordinates(event, "y"),
      };
      filterTable(newItem);
    }
    console.log("Novas mesas:", JSON.stringify(updatedTables));
  }

  function filterTable(newItem: Table) {
    let updatedTablesFiltered: Table[] = tableMapUpdate.tables;
    const isUpdatedTables = tableMapUpdate.tables.some((table) =>
      table.id === newItem.id
    );
    if (isUpdatedTables) {
      updatedTablesFiltered = tableMapUpdate.tables.filter((table) =>
        table.id !== newItem.id
      );
    } else {
      const savedTablesFiltered: Table[] = tableMapSaved.tables.filter((
        table,
      ) => table.id !== newItem.id);
      setTableMapSaved({ tables: savedTablesFiltered });
    }
    updatedTablesFiltered.push(newItem);
    setTableMapUpdate({ tables: updatedTablesFiltered });
  }

  function calculateCoordinates(event: DragEvent, type: string): number {
    if (type == "x") {
      return (event.clientX -
        containerRef.current!.getBoundingClientRect().left) /
        containerRef.current!.offsetWidth * 100;
    } else {
      return (event.clientY -
        containerRef.current!.getBoundingClientRect().top) /
        containerRef.current!.offsetHeight * 100;
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    console.log("over");
  }

  return (
    <div class="relative">
      <div class="flex justify-center font-bold text-3xl lg:text-5xl leading-tight lg:leading-none text-center lg:mt-2 lg:mb-2 ">
        {"Map Editor"}
      </div>
      <EditorSidebar />
      {backgroundImage && (
        <div
          class="w-full lg:w-1/2 max-w-full h-auto mx-auto relative border-2 border-black "
          ref={containerRef}
          onDrop={handleOnDrop}
          onDragOver={handleDragOver}
        >
          <img
            src={backgroundImage}
            alt="Your Image"
            draggable={false}
            class={`w-full select-none`}
          />

          {[...(tableMapSaved?.tables ?? []), ...tableMapUpdate?.tables]
            .map((table) => (
              table.class === "models.SquareTable"
                ? (
                  <DraggableGenericTable
                    key={table.id}
                    tableInfo={table}
                    deleteTable={HandleDeleteTable}
                    setDraggedItem={setDraggedItem}
                  />
                )
                : (
                  <DraggableSegmentTable
                    key={table.id}
                    tableInfo={table}
                    deleteTable={HandleDeleteTable}
                    setDraggedItem={setDraggedItem}
                  />
                )
            ))}
        </div>
      )}
    </div>
  );
}
