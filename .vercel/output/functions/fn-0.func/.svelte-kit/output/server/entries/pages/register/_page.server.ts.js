import { d as db, u as usersTable } from "../../../chunks/db.js";
import { c as createAuthJWT } from "../../../chunks/jwt.js";
import bcrypt from "bcrypt";
import { r as redirect } from "../../../chunks/index2.js";
const load = async ({ cookies }) => {
  const token = cookies.get("authToken");
  if (token) {
    throw redirect(301, "/");
  }
};
const actions = {
  default: async ({ cookies, request }) => {
    const formData = await request.formData();
    const email = formData.get("email") || "";
    const password = formData.get("password") || "";
    const first_name = formData.get("first_name") || "";
    const last_name = formData.get("last_name") || "";
    const hash = bcrypt.hashSync(password?.toString(), 10);
    const newUser = await db.insert(usersTable).values({
      first_name: first_name.toString(),
      last_name: last_name.toString(),
      email: email.toString(),
      password: hash
    });
    const token = await createAuthJWT({
      firstName: first_name.toString(),
      lastName: last_name.toString(),
      email: email.toString(),
      id: parseInt(newUser.insertId)
    });
    cookies.set("authToken", token, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30
    });
    throw redirect(301, "/");
  }
};
export {
  actions,
  load
};
