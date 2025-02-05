import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";
import { verify } from "jwt";
import { jwtKey } from "site/utils/jwtKey.ts";
import { JwtUserPayload } from "site/types/user.ts";

const key = jwtKey.value;

export const handler: Handlers = {
  async GET(req, _) {
    const cookies = getCookies(req.headers);
    const token = cookies["auth"];

    try {
      // Verify the JWT
      const payload = await verify(token, key);
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
