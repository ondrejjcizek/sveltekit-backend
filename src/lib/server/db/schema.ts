import { sqliteTable, int, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const userTable = sqliteTable('user', {
	id: text('id').primaryKey().notNull(),
	userName: text('username'),
	email: text('email').unique(),
	githubId: int('github_id').unique(),
	isAdmin: int('admin', { mode: 'boolean' }).default(false),
	stripeId: text('stripe_id')
});

export const sessionTable = sqliteTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: int('expires').notNull()
});

export const userRelation = relations(userTable, ({ many }) => ({
	sessions: many(sessionTable)
}));

export const sessionRelation = relations(sessionTable, ({ one }) => ({
	user: one(userTable, {
		fields: [sessionTable.userId],
		references: [userTable.id]
	})
}));
