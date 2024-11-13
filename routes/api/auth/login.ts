import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { Redis } from "@upstash/redis";
import * as bcrypt from "bcrypt";
import { create } from "jwt";
import { setCookie } from "std/http/cookie.ts";
//import { redis } from "../../../utils/DBConnection.ts"; // Import Redis client

interface User {
  _id: string;
  company: string;
  branch: string;
  email: string;
  password: string;
}
async function generateJwtToken(user: User) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 30 * 24 * 60 * 60; // 30 days
  const payload = {
    id: user._id,
    email: user.email,
    iat,
    exp,
  };

  const key = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"],
  );

  const jwt = await create({ alg: "HS512", typ: "JWT" }, { payload }, key);
  return jwt;
}

export const handler: Handlers = {
  async POST(req, _) {
    try {
      const user = await req.json() as User;

      const redis = new Redis({
        url: Deno.env.get("UPSTASH_REDIS_REST_URL")!,
        token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN")!,
      });

      // Check if the username already exists in Redis
      const existingUser = await redis.get(user.email) as User;
      if (!existingUser) {
        return new Response(
          JSON.stringify({
            error: "User not found...",
          }),
          {
            status: STATUS_CODE.NotFound,
          },
        );
      }
      const isValidPassword = await bcrypt.compareSync(
        user.password,
        existingUser.password,
      );
      if (!isValidPassword) {
        return new Response(
          JSON.stringify({
            error: "Invalid username or password",
          }),
          {
            status: STATUS_CODE.Unauthorized,
          },
        );
      }

      const token = await generateJwtToken(existingUser);
      const headers = new Headers();
      const url = new URL(req.url);
      setCookie(headers, {
        name: "auth",
        value: token,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Days
        sameSite: "Lax",
        domain: url.hostname,
        path: "/",
        secure: true,
        httpOnly: true,
      });

      headers.set("Location", "/");
      headers.set("Content-Type", "application/json");
      return new Response(
        JSON.stringify({
          message: "Login successfully",
          token: token,
        }),
        {
          status: 200,
          headers: headers,
        },
      );
    } catch (error) {
      return new Response(error);
    }
  },
};
