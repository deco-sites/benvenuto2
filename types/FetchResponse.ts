import { JwtUserPayload } from "site/types/user.ts";

export interface FetchResponse {
  error?: string;
  message?: string;
  payload?: JwtUserPayload;
  status?: number;
}
