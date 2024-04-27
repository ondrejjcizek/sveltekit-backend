import { d as db, u as usersTable } from "../../../chunks/db.js";
import { eq } from "drizzle-orm";
import { c as createAuthJWT } from "../../../chunks/jwt.js";
import bcrypt from "bcrypt";
import { r as redirect, e as error } from "../../../chunks/index.js";
const load = async ({ cookies }) => {
  const token = cookies.get("authToken");
  if (token && token !== "") {
    throw redirect(301, "/");
  }
};
const actions = {
  default: async ({ cookies, request }) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    if (!email || !password) {
      throw error(400, "must provide an email and password");
    }
    const user = await db.select({
      email: usersTable.email,
      password: usersTable.password,
      first_name: usersTable.first_name,
      last_name: usersTable.last_name,
      id: usersTable.id
    }).from(usersTable).where(eq(usersTable.email, email.toString())).limit(1);
    if (user.length === 0) {
      throw error(404, "user account not found");
    }
    const passwordIsRight = await bcrypt.compare(password.toString(), user[0].password);
    if (!passwordIsRight) {
      throw error(400, "incorrect password...");
    }
    const token = await createAuthJWT({
      firstName: user[0].first_name,
      lastName: user[0].last_name,
      email: user[0].email,
      id: user[0].id
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
