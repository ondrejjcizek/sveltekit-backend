import { e as error } from "./index2.js";
import * as jose from "jose";
const JWT_SECRET = "f4fa1fea012ebf095e876168d0c6388b24e0708269987421bba0b31c3f717737";
const createAuthJWT = async (data) => {
  const jwt = await new jose.SignJWT(data).setProtectedHeader({ alg: "HS256" }).sign(new TextEncoder().encode(JWT_SECRET));
  return jwt;
};
const verifyAuthJWT = async (token) => {
  try {
    const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return payload;
  } catch {
    throw error(401, "invalid or missing JWT, you are not logged in");
  }
};
export {
  createAuthJWT as c,
  verifyAuthJWT as v
};
