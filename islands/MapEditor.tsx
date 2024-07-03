import { useEffect, useRef, useState } from "preact/hooks";
import { Table, TableMap } from "../static/MockedTableObject.tsx";
import { Runtime } from "../runtime.ts";
import type { ImageWidget } from "apps/admin/widgets.ts";
import DraggableGenericTable from "../components/Editor/Tables/DraggableGenericTable.tsx";
import DraggableSegmentTable from "../components/Editor/Tables/DraggableSegmentTable.tsx";
import EditorSidebar from "../components/Editor/EditorSidebar.tsx";
import EditorTopBar from "../components/Editor/EditorTopBar.tsx";

import { v1 } from "https://deno.land/std@0.223.0/uuid/mod.ts";

export type Offset = {
  x: number;
  y: number;
};

export interface Props {
  tableMap: TableMap;
  backgroundImage?: ImageWidget;
}

export default function Editor({
  tableMap,
  backgroundImage = "",
}: Props) {
  const [tableMapSaved, setTableMapSaved] = useState<TableMap>(tableMap);
  const [draggedItem, setDraggedItem] = useState<Table | null>(null);
  const isInitialRender = useRef(true);
  const [moveUpDraggedTable, setMoveUpDraggedTable] = useState(false);
  const draggedItemOffset = useRef<Offset>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [sideBar, setSideBar] = useState(true);

  useEffect(() => {
    console.log("Requisita mapa no banco");

    const fetchGetData = async () => {
      try {
        const data: TableMap = await Runtime.invoke["deco-sites/benvenuto2"]
          .actions.actionGetMapFromKV({
            empresa: "couve",
            filial: "teste",
            id: "1",
          });

        setTableMapSaved({ tables: data.tables });
      } catch (error) {
        console.error("Erro ao obter os dados:", error);
      }
    };

    fetchGetData(); //Buscar os dados do mapa
  }, []);

  useEffect(() => {
    if (draggedItem && moveUpDraggedTable) {
      moveUpTable(draggedItem?.id);
    }
  }, [moveUpDraggedTable]);

  const fetchSetData = async (tableMap: TableMap) => {
    await Runtime.invoke["deco-sites/benvenuto2"].actions.actionSetMapToKV({
      empresa: "couve",
      filial: "teste",
      id: "1",
      mapJSON: JSON.stringify(tableMap),
    });
  };

  const HandleSaveNewMap = () => {
    console.log("Salva Table:", JSON.stringify(tableMapSaved));
    fetchSetData(tableMapSaved);
  };

  const HandleDeleteTable = (tableId: string) => {
    const savedTables = tableMapSaved.tables.filter((table) =>
      table.id !== tableId
    );
    setTableMapSaved({ tables: savedTables });
  };

  const setDraggedItemOffset = (offset: Offset) => {
    draggedItemOffset.current = offset;
  };

  function handleChangeLabel(id: string, newLabel: string) {
    const foundTable = tableMapSaved.tables.find((table) => table.id === id);

    if (foundTable) {
      const newItem: Table = {
        ...foundTable,
        label: newLabel,
      };
      filterAddTable(newItem);
    } else {
      console.error("Tabela não encontrada com o ID:", id);
    }
  }

  function handleChangeRotation(id: string, angle: number) {
    const foundTable = tableMapSaved.tables.find((table) => table.id === id);

    if (foundTable) {
      const newItem: Table = {
        ...foundTable,
        rotation: angle,
      };
      filterAddTable(newItem);
    } else {
      console.error("Tabela não encontrada com o ID:", id);
    }
  }
  function clamp(value: number, min: number = 0, max: number = 100): number {
    return Math.max(min, Math.min(max, value));
  }

  function handleOnDrop(event: DragEvent) {
    event.preventDefault();

    const model = event.dataTransfer?.getData("Model") as string;
    const updateTable = [...tableMapSaved.tables];

    const xPercentage = calculateCoordinates(event, "x");
    const yPercentage = calculateCoordinates(event, "y");

    if (model !== "") {
      console.log("New");
      const newItem: Table = {
        class: model,
        id: v1.generate() as string,
        label: "xx",
        rotation: 0,
        x: xPercentage,
        y: yPercentage,
        occupied: false,
        places: [],
      };
      updateTable.push(newItem);
      setTableMapSaved({ tables: updateTable });
    } else if (draggedItem !== null) {
      const foundTable = tableMapSaved.tables.find((table) =>
        table.id === draggedItem.id
      );

      if (foundTable) {
        const newItem: Table = {
          ...foundTable,
          x: xPercentage,
          y: yPercentage,
        };
        filterAddTable(newItem);
      }
    }
  }
  function handleTouchDrop(positionX: number, positionY: number) {
    const xPercentage = positionX;
    const yPercentage = positionY;

    if (draggedItem !== null) {
      const foundTable = tableMapSaved.tables.find((table) =>
        table.id === draggedItem.id
      );

      if (foundTable) {
        const newItem: Table = {
          ...foundTable,
          x: xPercentage,
          y: yPercentage,
        };
        filterAddTable(newItem);
      }
      setDraggedItem(null);
    }
  }

  function filterAddTable(newItem: Table | null) {
    if (newItem) {
      const savedTablesFiltered: Table[] = tableMapSaved.tables.filter((
        table,
      ) => table.id !== newItem.id);
      savedTablesFiltered.push(newItem);
      console.log(newItem);
      setTableMapSaved({ tables: savedTablesFiltered });
    }
  }

  function moveUpTable(id: string) {
    const foundTable = tableMapSaved.tables.find((table) => table.id === id);
    if (foundTable) {
      const savedTablesFiltered: Table[] = tableMapSaved.tables.filter((
        table,
      ) => table.id !== id);
      savedTablesFiltered.push(foundTable);
      console.log("moveup: ", foundTable);
      setTableMapSaved({ tables: savedTablesFiltered });
    } else {
      console.error("Tabela não encontrada com o ID:", id);
    }
  }

  function calculateCoordinates(event: DragEvent, type: string): number {
    if (type == "x") {
      const xPercentage = clamp(
        (event.clientX -
          containerRef.current!.getBoundingClientRect().left -
          draggedItemOffset.current.x) /
          containerRef.current!.offsetWidth * 100.0,
        0,
        100,
      );
      return xPercentage;
    } else {
      const yPercentage = clamp(
        (event.clientY -
          containerRef.current!.getBoundingClientRect().top -
          draggedItemOffset.current.y) /
          containerRef.current!.offsetHeight * 100,
        0,
        100,
      );
      return yPercentage;
    }
  }
  function calculateTouchCoordinates(event: TouchEvent, type: string): number {
    const touch = event.touches[0];
    if (type == "x") {
      const xPercentage = clamp(
        (touch.clientX -
          containerRef.current!.getBoundingClientRect().left -
          draggedItemOffset.current.x) /
          containerRef.current!.offsetWidth * 100.0,
        0,
        100,
      );
      return xPercentage;
    } else {
      const yPercentage = clamp(
        (touch.clientY -
          containerRef.current!.getBoundingClientRect().top -
          draggedItemOffset.current.y) /
          containerRef.current!.offsetHeight * 100,
        0,
        100,
      );
      return yPercentage;
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    //console.log("over");
  }

  return (
    <div class="relative select-none">
      <EditorTopBar
        HandleSaveNewMap={HandleSaveNewMap}
        setSideBar={setSideBar}
        sideBar={sideBar}
      />

      {sideBar && <EditorSidebar setDraggedItemOffset={setDraggedItemOffset} />}
      {backgroundImage && (
        <div
          id="img-div"
          class="w-full lg:w-1/2 max-w-full h-auto mx-auto relative border-2 border-black touch-none"
          ref={containerRef}
          onDrop={handleOnDrop}
          onDragOver={handleDragOver}
        >
          <img
            src={backgroundImage}
            alt="Your Image"
            draggable={false}
            class={`w-full select-none pointer-events-none user-drag-none`}
          />

          {...(tableMapSaved?.tables ?? [])
            .map((table) => (
              table.class === "models.SquareTable"
                ? (
                  <DraggableGenericTable
                    key={table.id}
                    tableInfo={table}
                    deleteTable={HandleDeleteTable}
                    setDraggedItem={setDraggedItem}
                    setDraggedItemOffset={setDraggedItemOffset}
                    handleChangeLabel={handleChangeLabel}
                    handleChangeRotation={handleChangeRotation}
                    calculateCoordinates={calculateCoordinates}
                    calculateTouchCoordinates={calculateTouchCoordinates}
                    setMoveUpDraggedTable={setMoveUpDraggedTable}
                    handleTouchDrop={handleTouchDrop}
                  />
                )
                : (
                  <DraggableSegmentTable
                    key={table.id}
                    tableInfo={table}
                    deleteTable={HandleDeleteTable}
                    setDraggedItem={setDraggedItem}
                    setDraggedItemOffset={setDraggedItemOffset}
                    handleChangeLabel={handleChangeLabel}
                    handleChangeRotation={handleChangeRotation}
                    calculateCoordinates={calculateCoordinates}
                    calculateTouchCoordinates={calculateTouchCoordinates}
                    setMoveUpDraggedTable={setMoveUpDraggedTable}
                    handleTouchDrop={handleTouchDrop}
                  />
                )
            ))}
        </div>
      )}
    </div>
  );
}
