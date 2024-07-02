interface EditorTableOptionsProps {
  setFocusToLabel: () => void;
  setRotateState: () => void;
  handleDeleteTable: () => void;
  tableInfo: { x: number; y: number };
  offsetX?: number;
  offsetY?: number;
}

export default function EditorTableOptions({
  setFocusToLabel,
  setRotateState,
  handleDeleteTable,
  tableInfo,
  offsetX = 0,
  offsetY = 0,
}: EditorTableOptionsProps) {
  return (
    <div
      class="text-[1.6vw] lg:text-[0.8vw] flex flex-col pt-[0.35rem] pb-[0.35rem] pl-1 pr-1 bg-white rounded-sm lg:rounded-md shadow-md"
      style={`z-index: 2; position: absolute; left: ${
        tableInfo.x + offsetX
      }%; top: ${tableInfo.y + 3.8 + offsetY}%;`}
    >
      <button
        onClick={() => setFocusToLabel()}
        class=" select-none p-1 flex items-center lg:rounded rounded-sm hover:bg-gray-200"
        style="height: auto;"
      >
        <span class="mr-2">✏️</span>
        {"Renomear"}
      </button>

      <button
        onClick={setRotateState}
        class=" select-none p-1 flex items-center lg:rounded rounded-sm hover:bg-gray-200"
        style="height: auto;"
      >
        <span class="mr-2">🔄</span>
        Rotacionar
      </button>

      <button
        onClick={handleDeleteTable}
        class=" select-none p-1 flex items-center lg:rounded rounded-sm hover:bg-gray-200"
        style="height: auto;"
      >
        <span class="mr-2">🗑️</span>
        {"Deletar"}
      </button>
    </div>
  );
}
