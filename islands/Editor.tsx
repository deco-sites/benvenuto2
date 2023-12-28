import { tableMapData } from "../static/MockedTableObject.tsx";
import { useSignal } from "@preact/signals";
import { useState } from "preact/hooks";

export interface Props {
  title?: string;
}

export default function Editor({
  title = "Editor",
}: Props) {
  const countSignal = useSignal(0);
  const [countState, setcountState] = useState(0);

  return (
    <div>
      <header class="lg:container mx-auto md:mx-16 lg:mx-auto mt-8 md:mt-12 mb-28 text-xl md:text-base flex flex-col items-center justify-center">
        <div class="mb-10 md:mb-20 flex justify-center ">
          <div class="font-bold text-3xl lg:text-6xl leading-tight lg:leading-none xl:w-5/6 text-center">
            {title}
          </div>
        </div>
      </header>

      <div>
        {tableMapData.tables.map((table) => (
          <div key={table.id}>
            <h2
              style={`position: absolute; left: ${table.x}px; top: ${
                table.y - 30
              }px;`}
            >
              Table: {table.label}
            </h2>

            <img
              src="/tables/greenTable.png"
              alt={`Table ${table.label}`}
              style={`position: absolute; left: ${table.x}px; top: ${table.y}px; transform: rotate(-${table.rotation}deg);`}
            />
            {
              /*<div>
              {table.places.map((place) => <p key={place.id}>{place.label}</p>)}
        </div>*/
            }
          </div>
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
