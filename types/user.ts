import type { Payload } from "jwt";

export interface User {
  company: string;
  branch: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface JwtUserPayload extends Payload {
  email: string;
  company: string;
  branch: string;
  iat: number;
  exp: number;
}