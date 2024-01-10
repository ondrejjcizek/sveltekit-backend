import { mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users', {
	id: serial('id').primaryKey(),
	first_name: varchar('first_name', { length: 255 }).notNull(),
	last_name: varchar('last_name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	password: varchar('password', { length: 255 }).notNull()
});
