import { v as verifyAuthJWT } from "../../../chunks/jwt.js";
import { r as redirect } from "../../../chunks/index.js";
const load = async ({ cookies }) => {
  const token = cookies.get("authToken");
  if (!token) {
    throw redirect(301, "/register");
  }
  return verifyAuthJWT(token);
};
export {
  load
};
