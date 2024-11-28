import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { Redis } from "@upstash/redis";
import * as bcrypt from "bcrypt";
import { User } from "site/types/user.ts";

export const handler: Handlers = {
  async POST(req, _) {
    try {
      const user = await req.json() as User;

      const redis = new Redis({
        url: Deno.env.get("UPSTASH_REDIS_REST_URL")!,
        token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN")!,
      });

      // Check if the username already exists in Redis
      const existingUser = await redis.exists(`${user.email}`);

      if (existingUser) {
        return new Response(
          JSON.stringify({
            error: "This email is already in use...",
          }),
          {
            status: STATUS_CODE.Forbidden,
          },
        );
      } else {
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;

        await redis.set(user.email, JSON.stringify(user));
      }
      return new Response(
        JSON.stringify({
          message: "Registered successfully",
        }),
        {
          status: STATUS_CODE.Created,
        },
      );
    } catch (error) {
      return new Response(error);
    }
  },
};
