import type { ImageWidget } from "apps/admin/widgets.ts";
import { AppContext } from "site/apps/site.ts";
import { deleteCookie, getCookies } from "std/http/cookie.ts";
import { verify } from "jwt";
import { getJwtCryptoKey } from "site/utils/jwtKey.ts";
import { redirect } from "@deco/deco";

export interface Props {
  logo?: ImageWidget;
  title?: string;
}
export default function Home(
  { title = "Sistema Benvenuto", logo = "" }: Props,
) {
  return (
    <header class="lg:container mx-auto md:mx-16 lg:mx-auto mt-8 md:mt-12 mb-28 text-xl md:text-base flex flex-col items-center justify-center">
      <div class="mb-10 md:mb-20 flex justify-center ">
        {logo
          ? <img class="object-cover w-96 mx-auto" src={logo} alt={title} />
          : (
            <div class="font-bold text-3xl lg:text-6xl leading-tight lg:leading-none xl:w-5/6 text-center">
              {title}
            </div>
          )}
      </div>

      <div class="flex flex-col items-center max-w-md">
        <a href="/tablemap" class="my-3 w-full">
          <button class="px-4 py-2 bg-blue-500 text-white rounded-lg text-2xl hover:bg-blue-600 w-full">
            Salão
          </button>
        </a>

        <a href="/tablemapeditor" class="my-3 w-full">
          <button class="px-4 py-2 bg-green-500 text-white rounded-lg text-2xl hover:bg-green-600 w-full">
            Editor
          </button>
        </a>

        <a class="my-3 w-full">
          <button class="px-4 py-2 bg-yellow-500 text-white rounded-lg text-2xl hover:bg-yellow-600 w-full">
            Configurações
          </button>
        </a>
        <a href="/api/auth/logout" class="my-3 w-full">
          <button class="px-4 py-2 bg-red-500 text-white rounded-lg text-2xl hover:bg-red-600 w-full">
            Sair
          </button>
        </a>
      </div>
    </header>
  );
}

export const loader = async (_props: Props, req: Request, ctx: AppContext) => {
  const cookies = getCookies(req.headers);
  const cookieName = "auth";
  const token = cookies[cookieName];
  try {
    console.log("home jwt secret: " + ctx?.jwtKey?.get());
    console.log("home upstash token: " + ctx?.upstashRedis?.token?.get());
    console.log("home upstash url: " + ctx?.upstashRedis?.url);

    const key = await getJwtCryptoKey(ctx?.jwtKey?.get());
    await verify(token, key);
    console.log("home logou");
  } catch (error) {
    const headers = new Headers();
    const url = new URL(req.url);
    deleteCookie(headers, "auth", { path: "/", domain: url.hostname });
    url.pathname = "/login";
    console.log("home deu ruim");
    console.log(error);
    console.log("Home Redireciona para:", url.toString());
    redirect(url.toString());
  }
  return _props;
};
