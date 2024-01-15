import { useSignal } from "@preact/signals";
import { useState } from "preact/hooks";
import { Runtime } from "../runtime.ts";
import { TableMap } from "../static/MockedTableObject.tsx";
import  GenericTable  from "../components/GenericTable.tsx";

export interface Props {
  tableMap: TableMap;
}

export default function Editor({
  tableMap,
}: Props) {
  const countSignal = useSignal(0);
  const [countState, setcountState] = useState(0);

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
        {tableMap.tables.map((table) => <GenericTable tableInfo={table} />)}
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
