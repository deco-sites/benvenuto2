export default function EditorSidebar() {
  return (
    <>
      <div className="flex justify-start items-center lg:mt-0 lg:mb-1 bg-white h-12 border-b-2 border-gray-300 shadow-md z-20">
        <a href="/" class="w-auto h-full">
          <button className="select-none bg-white text-black font-semibold rounded h-full w-[5.5rem] text-2xl hover:bg-gray-300">
            Início
          </button>
        </a>

        <div className="h-[60%] border-r-2 border-black mx-2" />

        <p className="select-none font-bold text-3xl lg:text-3xl leading-tight lg:leading-none p-2 text-black">
          {"Mapa de Mesas"}
        </p>
      </div>
    </>
  );
}
