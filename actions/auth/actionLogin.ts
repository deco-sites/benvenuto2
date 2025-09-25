import { STATUS_CODE } from "$fresh/server.ts";
import { Redis } from "@upstash/redis";
import * as bcrypt from "bcrypt";
import { create, getNumericDate } from "jwt";
import { setCookie } from "std/http/cookie.ts";
import { getJwtCryptoKey } from "site/utils/jwtKey.ts";
import { JwtUserPayload, User, UserLogin } from "site/types/user.ts";
import type { AppContext } from "site/apps/site.ts";
import type { FetchResponse } from "site/types/FetchResponse.ts";
//import { redis } from "../../../utils/DBConnection.ts"; // Import Redis client

export interface Props {
  userProvided: UserLogin;
}

async function generateJwtToken(user: User, ctx: AppContext) {
  const key = await getJwtCryptoKey(ctx?.jwtKey?.get());

  const iat = getNumericDate(0);
  const exp = getNumericDate(60 * 60 * 24 * 180); // 180 dias
  const payload: JwtUserPayload = {
    email: user.email,
    company: user.company,
    branch: user.branch,
    iat,
    exp,
  };

  console.log("login cryptokey", key);
  const jwt = await create({ alg: "HS512", typ: "JWT" }, payload, key);
  console.log("login jwt", jwt);
  return jwt;
}

const action = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<FetchResponse> => {
  try {
    const user = props.userProvided;
    console.log("actionlogin user:", user);
    console.log("actionlogin url:", ctx.upstashRedis.url);
    console.log("actionlogin token:", ctx?.upstashRedis?.token?.get());
    console.log("Jwt secret string login:", ctx?.jwtKey?.get());

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

    const isValidPassword = bcrypt.compareSync(
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

    const token = await generateJwtToken(existingUser, ctx);
    const url = new URL(_req.url);
    setCookie(ctx.response.headers, {
      name: "auth",
      value: token,
      maxAge: 365 * 24 * 60 * 60, // 365 Days
      sameSite: "Lax",
      domain: url.hostname,
      path: "/",
      secure: true,
      httpOnly: true,
    });
    console.log("cookie");
    ctx.response.status = STATUS_CODE.OK;
    return {
      message: "Login successfully",
      status: ctx.response.status,
    };
  } catch (error) {
    console.error("Login error:", error);
    ctx.response.status = STATUS_CODE.InternalServerError;

    return {
      error: "Internal server error",
      message: error,
      status: STATUS_CODE.InternalServerError,
    };
  }
};

export default action;
