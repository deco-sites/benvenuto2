import { deleteCookie, getCookies } from "std/http/cookie.ts";
import { verify } from "jwt";
import { FreshContext } from "$fresh/server.ts";
import { jwtKey } from "site/utils/jwtKey.ts";

export async function handler(req: Request, ctx: FreshContext) {
  const cookieName = "auth";
  const cookies = getCookies(req.headers);
  const token = cookies[cookieName];
  const url = new URL(req.url);

  if (token) {
    try {
      // Verify the token with the stable key
      await verify(token, jwtKey.value);

      // If token is valid, redirect away from non-protected routes like /login or /register
      const nonProtectedRoutes = ["/login", "/register"];
      if (nonProtectedRoutes.includes(url.pathname)) {
        url.pathname = "/";
        return new Response(null, {
          status: 302,
          headers: { "Location": url.toString() },
        });
      }
    } catch (error) {
      console.error("Invalid token:", error);

      // Prepare headers and delete the cookie
      const headers = new Headers();
      deleteCookie(headers, "auth", { path: "/", domain: url.hostname });

      // Redirect to /login with the updated headers (cookie deleted)
      url.pathname = "/login";
      headers.set("Location", url.toString());

      return new Response(null, {
        status: 302,
        headers,
      });
    }
  } else {
    // No token: Redirect to login if trying to access protected routes
    const protectedRoutes = ["/", "/tablemap", "/tablemapeditor"];
    if (protectedRoutes.includes(url.pathname)) {
      url.pathname = "/login";
      return new Response(null, {
        status: 302,
        headers: { "Location": url.toString() },
      });
    }
  }

  return await ctx.next();
}
