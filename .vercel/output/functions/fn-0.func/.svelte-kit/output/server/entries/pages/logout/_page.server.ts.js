import { r as redirect } from "../../../chunks/index2.js";
const load = async ({ cookies }) => {
  cookies.set("authToken", "", {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
  });
  throw redirect(302, "/login");
};
export {
  load
};
