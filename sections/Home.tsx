import type { ImageWidget } from "apps/admin/widgets.ts";

export interface Props {
  logo?: ImageWidget;
  title?: string;
}

export default function Home({
  title = "Sistema Benvenuto",
  logo = "",
}: Props) {
  return (
    <header class="lg:container mx-auto md:mx-16 lg:mx-auto mt-8 md:mt-12 mb-28 text-xl md:text-base flex flex-col items-center justify-center">
      <div class="mb-10 md:mb-20 flex justify-center ">
        {logo
          ? (
            <img
              class="object-cover w-96 mx-auto"
              src={logo}
              alt={title}
            />
          )
          : (
            <div class="font-bold text-3xl lg:text-6xl leading-tight lg:leading-none xl:w-5/6 text-center">
              {title}
            </div>
          )}
      </div>

      <div class="flex flex-col items-center max-w-md">
        <a href="/table" class="my-3 w-full">
          <button class="px-4 py-2 bg-blue-500 text-white rounded-lg text-2xl hover:bg-blue-600 w-full">
            Recepção
          </button>
        </a>

        <a class="my-3 w-full">
          <button class="px-4 py-2 bg-green-500 text-white rounded-lg text-2xl hover:bg-green-600 w-full">
            Salão
          </button>
        </a>

        <a class="my-3 w-full">
          <button class="px-4 py-2 bg-yellow-500 text-white rounded-lg text-2xl hover:bg-yellow-600 w-full">
            Configurações
          </button>
        </a>
      </div>
    </header>
  );
}
