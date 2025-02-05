import { deleteCookie } from "https://deno.land/std@0.224.0/http/cookie.ts";

const action = (
  _req: Request,
): Response => {
  const url = new URL(_req.url);
  const headers = new Headers();

  deleteCookie(headers, "auth", { path: "/", domain: url.hostname });

  headers.set("Location", "/login");

  return new Response(null, {
    status: 302,
    headers,
  });
};

export default action;
