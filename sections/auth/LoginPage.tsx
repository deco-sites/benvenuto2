import LoginPageIsland from "site/islands/auth/LoginPage.tsx";
import { getCookies } from "std/http/cookie.ts";
import { verify } from "jwt";
import { getJwtCryptoKey } from "site/utils/jwtKey.ts";
import type { AppContext } from "site/apps/site.ts";
import { redirect } from "@deco/deco";

export default function LoginPage() {
  return <LoginPageIsland />;
}
export const loader = async (
  _props: unknown,
  req: Request,
  ctx: AppContext,
) => {
  const cookies = getCookies(req.headers);
  const cookieName = "auth";
  const token = cookies[cookieName];
  try {
    const key = await getJwtCryptoKey(ctx?.jwtKey?.get());
    await verify(token, key);
    console.log("Loginpage foi");
  } catch (error) {
    //Stays at login page
    console.log("Loginpage erro");
    console.log(error);
    return _props;
  }

  const url = new URL(req.url);
  url.pathname = "/";
  console.log("Login Redireciona para:", url.toString());
  redirect(url.toString());

  return _props;
};
