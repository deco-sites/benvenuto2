interface EditorTopBarProps {
  HandleSaveNewMap: () => void;
  setSideBar: (value: boolean) => void;
  sideBar: boolean;
}

export default function EditorSidebar({
  HandleSaveNewMap,
  setSideBar,
  sideBar,
}: EditorTopBarProps) {
  return (
    <>
      <div className="flex justify-start items-center lg:mt-0 lg:mb-1 bg-white h-12 border-b-2 border-gray-300 shadow-md z-20">
        <button
          className="select-none bg-white text-black font-semibold rounded h-full w-[5.5rem] text-2xl hover:bg-gray-300"
          onClick={() => setSideBar(!sideBar)}
        >
          Mesas
        </button>
        <div className="h-[60%] border-r-2 border-black mx-2"></div>
        <p className="select-none font-bold text-3xl lg:text-3xl leading-tight lg:leading-none p-2 text-black">
          {"Editor do Mapa"}
        </p>
      </div>
      <div className="absolute top-0 right-0 mt-2 mr-2">
        <button
          className="select-none px-4 py-1 bg-blue-500 text-white rounded h-8"
          onClick={HandleSaveNewMap}
        >
          Salvar
        </button>
      </div>
    </>
  );
}
