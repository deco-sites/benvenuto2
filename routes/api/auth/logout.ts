import { deleteCookie } from "https://deno.land/std@0.224.0/http/cookie.ts";

export function handler(req: Request): Response {

  const url = new URL(req.url);
  const headers = new Headers();
  console.log("ola");
  console.log(url.origin);

  // Delete the auth cookie
  deleteCookie(headers, "auth", { path: "/", domain: url.hostname});

  // Redirect user to login or home page after logout
  headers.set("Location", "/login");
  return new Response(null, {
    status: 302,          // HTTP status code for redirection
    headers,
  });
}