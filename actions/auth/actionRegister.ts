import { STATUS_CODE } from "$fresh/server.ts";
import { Redis } from "@upstash/redis";
import * as bcrypt from "bcrypt";
import { User } from "site/types/user.ts";
import { AppContext } from "site/apps/site.ts";
import type { FetchResponse } from "site/types/FetchResponse.ts";

export interface Props {
  userProvided: User,
}

const action = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<FetchResponse> => {
  try {
    const redis = new Redis({
      url: ctx.upstashRedis.url,
      token: ctx?.upstashRedis?.token?.get() ?? undefined,
    });

    // Check if the username already exists in Redis
    const existingUser = await redis.exists(`${props.userProvided.email}`);

    if (existingUser) {
      ctx.response.status = STATUS_CODE.OK;
      return {
        error: "This email is already in use...",
        status: STATUS_CODE.Forbidden,
      };
    } else {
      const salt = await bcrypt.genSalt(8);
      const hashedPassword = await bcrypt.hash(props.userProvided.password, salt);
      props.userProvided.password = hashedPassword;

      await redis.set(props.userProvided.email, JSON.stringify(props.userProvided));

      ctx.response.status = STATUS_CODE.Created;
      return {
        message: "Registered successfully",
        status: STATUS_CODE.Created,
      };
    }

  } catch (error) {
    console.error("Registration error:", error);
    ctx.response.status = STATUS_CODE.InternalServerError;
    return {
      error: "Internal server error",
      status: STATUS_CODE.InternalServerError,
    };
  }
};

export default action;
