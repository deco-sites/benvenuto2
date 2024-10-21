import { useEffect, useState } from "preact/hooks";
import { TableMap } from "../static/MockedTableObject.tsx";
import GenericTable from "../components/TableMap/Tables/GenericTable.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import SegmentTable from "../components/TableMap/Tables/SegmentTable.tsx";
import TableMapTopBar from "../components/TableMap/ManagementTopBar.tsx";
import { actors } from "@deco/actors/proxy";
import type { ActorTable } from "../actors/ActorTable.ts";

export interface Props {
  backgroundImage?: ImageWidget;
}

export default function Editor({
  backgroundImage = "",
}: Props) {
  const [tableMapUpdate, setTableMapUpdate] = useState<TableMap>({
    tables: [],
  });

  const actorKey = {
    empresa: "couve",
    filial: "teste",
    id: "1",
  };

  const tableMaps = actors.proxy<ActorTable>("ActorTable").id(
    `maps_${actorKey.empresa}_${actorKey.filial}_${actorKey.id}`,
  );

  useEffect(() => {
    const fetchTableMap = async () => {
      try {
        const tableMap = await tableMaps.getTableMap();
        console.log("Get:", typeof tableMap, tableMap);
        setTableMapUpdate(tableMap);
      } catch (error) {
        console.error("Erro ao buscar o mapa de tabelas:", error);
      }
    };

    fetchTableMap();
  }, []);

  useEffect(() => {
    console.log("Realiza evento");
    const watchTableMaps = async () => {
      for await (const event of await tableMaps.watch()) {
        console.log("Evento:", event);
        setTableMapUpdate(event); // Update count on new event
      }
    };
    watchTableMaps();
  }, []);

  const fetchData = async (tableMap: TableMap) => {
    console.log("save:", tableMap);
    await tableMaps.saveTableMap(tableMap);
  };

  const updateOccupiedState = (tableId: string, newOccupiedState: boolean) => {
    //console.log("Table antes:", JSON.stringify(tableMapUpdate));

    const updatedTables = tableMapUpdate?.tables.map((table) => {
      return table.id === tableId
        ? { ...table, occupied: newOccupiedState }
        : table;
    });
    if (updatedTables) {
      const updatedTableMap = { ...tableMapUpdate, tables: updatedTables };
      setTableMapUpdate(updatedTableMap);
      fetchData(updatedTableMap);
    }
  };

  return (
    <div class="relative select-none">
      <TableMapTopBar />
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
