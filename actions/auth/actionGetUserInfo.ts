import { STATUS_CODE } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";
import { verify } from "jwt";
import { getJwtCryptoKey } from "site/utils/jwtKey.ts";
import { JwtUserPayload } from "site/types/user.ts";
import type { AppContext } from "site/apps/site.ts";

export interface Props {}

const action = async (
  _props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<Response> => {
  const cookies = getCookies(_req.headers);
  const token = cookies["auth"];

  try {
    // Verify the JWT
    const jwtKey = await ctx?.jwtKey?.get();
    const jwtCryptoKey = await getJwtCryptoKey(jwtKey);
    const payload = await verify(token, jwtCryptoKey);
    const userInfo = payload as unknown as JwtUserPayload;

    return new Response(
      JSON.stringify(userInfo),
      {
        status: STATUS_CODE.OK,
      },
    );
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return new Response(
      JSON.stringify({
        error: "Invalid token",
      }),
      {
        status: STATUS_CODE.Unauthorized,
      },
    );
  }
};

export default action;
