import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";
import { verify } from "jwt";
import { getJwtCryptoKey } from "site/utils/jwtKey.ts";
import { JwtUserPayload } from "site/types/user.ts";
import type { AppContext } from "site/apps/site.ts";

export const handler: Handlers<unknown, AppContext> = {
  async GET(req) {
    const cookies = getCookies(req.headers);
    const token = cookies["auth"];
    console.log("route user_info key:", Deno.env.get("JWT_PRIVATE_KEY"));
    const jwtKey = Deno.env.get("JWT_PRIVATE_KEY");
    const jwtCryptoKey = await getJwtCryptoKey(jwtKey);

    try {
      // Verify the JWT
      const payload = await verify(token, jwtCryptoKey);
      const userInfo = payload as unknown as JwtUserPayload;

      // Respond with user info
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
  },
};
