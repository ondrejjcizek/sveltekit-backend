import { connect } from "@planetscale/database";
import { d as private_env } from "./shared-server.js";
import { relations } from "drizzle-orm";
import { mysqlTable, varchar, serial, text, boolean, int } from "drizzle-orm/mysql-core";
const contact = mysqlTable("contact", {
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).primaryKey()
});
const usersTable = mysqlTable("users", {
  id: serial("id").primaryKey(),
  first_name: varchar("first_name", { length: 255 }).notNull(),
  last_name: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull()
});
const todosTable = mysqlTable("todos", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  completed: boolean("completed").notNull(),
  user_id: int("user_id").notNull()
});
const usersTableRelations = relations(usersTable, ({ many }) => ({
  todos: many(todosTable)
}));
const todosTableRelations = relations(todosTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [todosTable.user_id],
    references: [usersTable.id]
  })
}));
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  contact,
  todosTable,
  todosTableRelations,
  usersTable,
  usersTableRelations
}, Symbol.toStringTag, { value: "Module" }));
const connection = connect({
  host: private_env.DATABASE_HOST,
  username: private_env.DATABASE_USERNAME,
  password: private_env.DATABASE_PASSWORD
});
const db = drizzle(connection, { schema });
export {
  db as d,
  todosTable as t,
  usersTable as u
};
