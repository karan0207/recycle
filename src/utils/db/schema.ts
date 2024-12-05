import {
  integer,
  varchar,
  pgTable,
  serial,
  text,
  timestamp,
  jsonb,
  boolean,
} from 'drizzle-orm/pg-core';

export const Users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const Reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => Users.id)
    .notNull(),
  location: text('location').notNull(),
  wasteType: varchar('waste_type', { length: 255 }).notNull(),
  amount: varchar('amount', { length: 255 }).notNull(),
  imageUrl: text('image_url'),
  verificationResults: jsonb('verification_result'),
  status: varchar('status', { length: 255 }).notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  collectorId: integer('collector_id').references(() => Users.id),
});

export const Rewards = pgTable('rewards', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => Users.id)
    .notNull(),
  points: integer('points').notNull().default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isAvialable: boolean('is_available').notNull().default(true),
  description: text('description'),
  name: varchar('name', { length: 255 }).notNull(),
  collectionInfo: text('collection_info').notNull(),
});

