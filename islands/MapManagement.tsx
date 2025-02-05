import { useEffect, useState } from "preact/hooks";
import { TableMap } from "../static/MockedTableObject.tsx";
import GenericTable from "../components/TableMap/Tables/GenericTable.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import SegmentTable from "../components/TableMap/Tables/SegmentTable.tsx";
import TableMapTopBar from "../components/TableMap/ManagementTopBar.tsx";
import { actors } from "@deco/actors/proxy";
import type { ActorTable } from "../actors/ActorTable.ts";
import { JwtUserPayload } from "site/types/user.ts";

export interface IActorTable {
  saveTableMap(newTable: TableMap): Promise<void>;
  getTableMap(): Promise<TableMap>;
  watch(): Promise<AsyncIterableIterator<TableMap>>;
}
console.log("Actorkey1");
export interface Props {
  backgroundImage?: ImageWidget;
}

export default function Editor({
  backgroundImage = "",
}: Props) {
  const [tableMapUpdate, setTableMapUpdate] = useState<TableMap>({
    tables: [],
  });
  const [actorKey, setActorKey] = useState<JwtUserPayload | null>(null);

  let tableMapsActor: IActorTable | null = null;
  console.log("Actorkey2");
  if (actorKey) {
    console.log("Actorkey:", actorKey);
    console.log(`maps_${actorKey.email}_1`);
    console.log("Actor:", tableMapsActor);
    tableMapsActor = actors.proxy<ActorTable>("ActorTable").id(
      `maps_${actorKey.email}_1`,
    );
    console.log("Actor:", tableMapsActor);
  }

  useEffect(() => {
    const savedUserInfo = localStorage.getItem("userInfo");
    console.log("localstorage info", savedUserInfo);
    if (savedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(savedUserInfo) as JwtUserPayload;
        setActorKey(parsedUserInfo);
      } catch (error) {
        console.error("Erro ao parsear informações do usuário:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!actorKey || !tableMapsActor) return;

    const fetchTableMap = async () => {
      try {
        const tableMap = await tableMapsActor?.getTableMap();
        console.log("Get:", typeof tableMap, tableMap);
        if (tableMap) {
          setTableMapUpdate(tableMap);
        }
      } catch (error) {
        console.error("Erro ao buscar o mapa de tabelas:", error);
      }
    };

    fetchTableMap();
  }, [actorKey]);

  useEffect(() => {
    if (!actorKey || !tableMapsActor) return;

    console.log("Realiza evento");
    const watchTableMaps = async () => {
      for await (const event of await tableMapsActor!.watch()) {
        console.log("Evento:", event);
        setTableMapUpdate(event);
      }
    };
    watchTableMaps();
  }, [actorKey]);

  const fetchData = async (tableMap: TableMap) => {
    if (!actorKey || !tableMapsActor) return;
    console.log("save:", tableMap);
    await tableMapsActor.saveTableMap(tableMap);
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
    <div class="relative select-none bg-gray-100">
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
