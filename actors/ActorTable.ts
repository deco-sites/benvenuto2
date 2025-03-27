import { Actor, ActorState } from "@deco/actors";
import { WatchTarget } from "@deco/actors/watch";
import { TableMap } from "../static/MockedTableObject.tsx";


export class ActorTable {
    private tableMap: TableMap;
    private watchTarget = new WatchTarget<TableMap>();

    constructor(protected state: ActorState) {
        this.tableMap = {
            tables: [],
        };
        state.blockConcurrencyWhile(async () => {
            this.tableMap =
                await this.state.storage.get<TableMap>("table_map") ??
                    this.tableMap;
        });
    }

    async saveTableMap(newTable: TableMap): Promise<void> {
        this.tableMap = newTable;
        await this.state.storage.put("table_map", newTable);
        this.watchTarget.notify(newTable);
    }

    getTableMap(): TableMap {
        return this.tableMap;
    }

    watch(): AsyncIterableIterator<TableMap> {
        return this.watchTarget.subscribe();
    }
}
