import { d as db, t as todosTable } from "../../chunks/db.js";
import { eq } from "drizzle-orm";
import { v as verifyAuthJWT } from "../../chunks/jwt.js";
import { r as redirect } from "../../chunks/index2.js";
const load = async ({ cookies }) => {
  const token = cookies.get("authToken");
  if (!token) {
    throw redirect(301, "/login");
  }
  const userPayload = await verifyAuthJWT(token);
  const todos = await db.select({
    completed: todosTable.completed,
    description: todosTable.description,
    title: todosTable.title,
    id: todosTable.id
  }).from(todosTable).where(eq(todosTable.user_id, userPayload.id));
  return { todos, userPayload };
};
const actions = {
  delete: async ({ request, cookies }) => {
    const formData = await request.formData();
    const id = formData.get("id") || "";
    const token = cookies.get("authToken");
    if (!token) {
      throw redirect(301, "/login");
    }
    await verifyAuthJWT(token);
    await db.delete(todosTable).where(eq(todosTable.id, parseInt(id.toString())));
    return { success: true };
  },
  complete: async ({ request, cookies }) => {
    const formData = await request.formData();
    const id = formData.get("id") || "";
    const token = cookies.get("authToken");
    if (!token) {
      throw redirect(301, "/login");
    }
    await verifyAuthJWT(token);
    await db.update(todosTable).set({ completed: true }).where(eq(todosTable.id, parseInt(id.toString())));
    return { success: true };
  },
  create: async ({ request, cookies }) => {
    const formData = await request.formData();
    const title = formData.get("title") || "";
    const description = formData.get("description") || "";
    if (description === "" || title === "") {
      return { success: false };
    }
    const token = cookies.get("authToken");
    if (!token) {
      throw redirect(301, "/login");
    }
    const userPayload = await verifyAuthJWT(token);
    await db.insert(todosTable).values({
      title: title.toString(),
      description: description.toString(),
      user_id: userPayload.id,
      completed: false
    });
    return { success: true };
  }
};
export {
  actions,
  load
};
