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

export interface JwtUserPayload {
  company: string;
  branch: string;
  email: string;
  iat: number;
  exp: number;
}
