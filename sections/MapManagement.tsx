import { ImageWidget } from "apps/admin/widgets.ts";
import MapManagementIsland from "../islands/MapManagement.tsx";
import { AppContext } from "site/apps/site.ts";
import { deleteCookie, getCookies } from "std/http/cookie.ts";
import { verify } from "jwt";
import { getJwtCryptoKey } from "site/utils/jwtKey.ts";
import { redirect } from "@deco/deco";
import { JwtUserPayload } from "site/types/user.ts";

export interface Props {
  backgroundImage?: ImageWidget;
  jwtPayload: JwtUserPayload;
}

export default function Editor({ backgroundImage, jwtPayload }: Props) {
  return <MapManagementIsland backgroundImage={backgroundImage} jwtPayload={jwtPayload} />;
}
export async function loader(
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<Props> {
  const cookies = getCookies(req.headers);
  const cookieName = "auth";
  const token = cookies[cookieName];
  try {
    const key = await getJwtCryptoKey(ctx?.jwtKey?.get());
    const jwtPayload = await verify<JwtUserPayload>(token, key);
    console.log("Loader MapEditor Payload:", jwtPayload);
    return { ...props, jwtPayload };
  } catch (error) {
    console.log("Erro Editor:", error);
    const headers = new Headers();
    const url = new URL(req.url);
    deleteCookie(headers, "auth", { path: "/", domain: url.hostname });
    url.pathname = "/login";
    redirect(url.toString());
    return props as never;
  }
}
