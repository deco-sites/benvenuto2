import { useEffect, useState } from "preact/hooks";
import { TableMap } from "../static/MockedTableObject.tsx";
import GenericTable from "../components/TableMap/Tables/GenericTable.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";
import SegmentTable from "../components/TableMap/Tables/SegmentTable.tsx";
import TableMapTopBar from "../components/TableMap/ManagementTopBar.tsx";
import { JwtUserPayload } from "site/types/user.ts";
import { invoke } from "site/runtime.ts";

export interface Props {
  backgroundImage?: ImageWidget;
  jwtPayload: JwtUserPayload;
}

export default function MapManagementIsland({
  backgroundImage = "",
  jwtPayload,
}: Props) {
  const [tableMapUpdate, setTableMapUpdate] = useState<TableMap>({
    tables: [],
  });

  const [userInfo, setUserInfo] = useState<JwtUserPayload>(jwtPayload);

  useEffect(() => {
    console.log("Requisita mapa do redis");
    if (!userInfo) return;
    const fetchGetData = async () => {
      try {
        const redisTableMap: TableMap = await invoke.site.actions
          .actionGetMapFromRedis({
            id: userInfo?.email,
          });

        setTableMapUpdate({ tables: redisTableMap.tables });
      } catch (error) {
        console.error("Erro ao buscar o mapa de mesas:", error);
      }
    };

    fetchGetData();
  }, [userInfo]);

  /*useEffect(() => {
    if (!userInfo || !tableMapsActor) return;

    console.log("Realiza evento");
    const watchTableMaps = async () => {
      for await (const event of await tableMapsActor!.watch()) {
        console.log("Evento:", event);
        setTableMapUpdate(event);
      }
    };
    watchTableMaps();
  }, [userInfo]);*/

  useEffect(() => {
    if (!userInfo?.email) return;
    console.log("Realiza evento");

    const eventSource = new EventSource(
      `/sse/tablesredis?email=${encodeURIComponent(userInfo.email)}`,
    );

    eventSource.onopen = () => console.log("SSE connection established.");

    eventSource.onmessage = (event) => {
      try {
        console.log("Evento table atualizada1: " + event.data);
        const data = JSON.parse(event.data);
        console.log("Evento table stringfy: " + JSON.stringify(data));
        setTableMapUpdate(data);
      } catch (error) {
        console.error("Error SSE data:", error);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Connection Error:", err);
    };

    return () => {
      console.log("Closing SSE connection.");
      eventSource.close();
    };
  }, [userInfo]);

  const fetchData = async (tableMap: TableMap) => {
    if (!userInfo) return;
    console.log("save:", tableMap);
    await invoke.site.actions.actionSetMapToRedis({
      id: userInfo?.email,
      mapJSON: JSON.stringify(tableMap),
    });
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
