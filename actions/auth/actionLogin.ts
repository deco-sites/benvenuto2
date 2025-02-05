import { STATUS_CODE } from "$fresh/server.ts";
import { Redis } from "@upstash/redis";
import * as bcrypt from "bcrypt";
import { create } from "jwt";
import { setCookie } from "std/http/cookie.ts";
import { jwtKey } from "site/utils/jwtKey.ts";
import { JwtUserPayload, User, UserLogin } from "site/types/user.ts";
import type { AppContext } from "site/apps/site.ts";
import type { FetchResponse } from "site/types/FetchResponse.ts";
//import { redis } from "../../../utils/DBConnection.ts"; // Import Redis client

export interface Props {
  userProvided: UserLogin;
}

let payload: JwtUserPayload = {
  email: "",
  company: "",
  branch: "",
  iat: 0,
  exp: 0,
};

async function generateJwtToken(user: User) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 30 * 24 * 60 * 60; // 30 days
  payload = {
    email: user.email,
    company: user.company,
    branch: user.branch,
    iat,
    exp,
  };

  const key = jwtKey.value;

  const jwt = await create({ alg: "HS512", typ: "JWT" }, { payload }, key);
  return jwt;
}

const action = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<FetchResponse> => {
  try {
    const user = props.userProvided;
    console.log(user);
    const redis = new Redis({
      url: ctx.upstashRedis.url,
      token: ctx?.upstashRedis?.token?.get() ?? undefined,
    });

    // Check if the username already exists in Redis
    const existingUser = await redis.get(user.email) as User;
    if (!existingUser) {
      ctx.response.status = STATUS_CODE.OK;
      ctx.response.headers.set("Content-Type", "application/json");
      return {
        error: "User not found...",
        status: STATUS_CODE.NotFound,
      };
    }

    const isValidPassword = await bcrypt.compareSync(
      user.password,
      existingUser.password,
    );
    if (!isValidPassword) {
      ctx.response.status = STATUS_CODE.OK;
      ctx.response.headers.set("Content-Type", "application/json");
      return {
        error: "Invalid username or password",
        status: STATUS_CODE.Unauthorized,
      };
    }

    const token = await generateJwtToken(existingUser);
    const url = new URL(_req.url);
    setCookie(ctx.response.headers, {
      name: "auth",
      value: token,
      maxAge: 30 * 24 * 60 * 60, // 30 Days
      sameSite: "Lax",
      domain: url.hostname,
      path: "/",
      secure: true,
      httpOnly: true,
    });

    ctx.response.headers.set("Location", "/");
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.status = STATUS_CODE.OK;

    return {
      message: "Login successfully",
      payload: payload,
      status: ctx.response.status,
    };
  } catch (error) {
    console.error("Login error:", error);
    ctx.response.status = STATUS_CODE.InternalServerError;

    return {
      error: "Internal server error",
      status: STATUS_CODE.InternalServerError,
    };
  }
};

export default action;
