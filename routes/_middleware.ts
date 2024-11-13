import { getCookies } from "https://deno.land/std@0.205.0/http/cookie.ts";
import { decode } from "https://deno.land/x/djwt@v3.0.1/mod.ts";
import { FreshContext } from "$fresh/server.ts";

export async function handler(req: Request, ctx: FreshContext) {
  const cookieName = "auth";
  const cookies = getCookies(req.headers);
  const token = cookies[cookieName];
  const url = new URL(req.url); // the pathname will be the path the user visit
  if (token) {
    // first verify the token
    const verifyToken = await decode(token);
    if (verifyToken) {
      const nonProtectedRoutes = ["/login", "/register"];
      if (nonProtectedRoutes.includes(url.pathname)) {
        url.pathname = "/";
        return Response.redirect(url);
      }
    }
  } else {
    const protectedRoutes = ["/", "/tablemap", "/tablemapeditor"]; // you can add all of your protected routes here with APIS
    if (protectedRoutes.includes(url.pathname)) {
      url.pathname = "/login";
      return Response.redirect(url);
    }
  }

  return await ctx.next();
}