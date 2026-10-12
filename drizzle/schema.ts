import { date, index, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const organizations = mysqlTable("organizations", {
  id: int("id").autoincrement().primaryKey(),
  ownerUserId: int("ownerUserId").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 96 }).notNull().unique(),
  logoUrl: text("logoUrl"),
  brandColor: varchar("brandColor", { length: 16 }).default("#c7f36b").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ ownerIdx: index("organizations_owner_idx").on(table.ownerUserId) }));

export const members = mysqlTable("members", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  memberId: varchar("memberId", { length: 48 }).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  photoUrl: text("photoUrl"),
  tier: varchar("tier", { length: 80 }).default("Full member").notNull(),
  status: mysqlEnum("status", ["active", "expiring", "pending", "paused"]).default("pending").notNull(),
  joinedAt: date("joinedAt"),
  expiresAt: date("expiresAt"),
  deliveryAddress: json("deliveryAddress"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ orgIdx: index("members_org_idx").on(table.organizationId), memberIdIdx: index("members_member_id_idx").on(table.memberId) }));

export const cardDesigns = mysqlTable("cardDesigns", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  version: varchar("version", { length: 20 }).default("1.0").notNull(),
  brandColor: varchar("brandColor", { length: 16 }).default("#c7f36b").notNull(),
  logoUrl: text("logoUrl"),
  frontLayout: json("frontLayout").notNull(),
  backLayout: json("backLayout"),
  isDefault: int("isDefault").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ orgIdx: index("card_designs_org_idx").on(table.organizationId) }));

export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  memberId: int("memberId"),
  applicantName: varchar("applicantName", { length: 160 }).notNull(),
  applicantEmail: varchar("applicantEmail", { length: 320 }).notNull(),
  status: mysqlEnum("status", ["submitted", "needs_update", "approved", "rejected"]).default("submitted").notNull(),
  reviewNote: text("reviewNote"),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
}, table => ({ orgIdx: index("applications_org_idx").on(table.organizationId), statusIdx: index("applications_status_idx").on(table.status) }));

export const membershipCards = mysqlTable("membershipCards", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  memberId: int("memberId").notNull(),
  designId: int("designId").notNull(),
  qrPayload: varchar("qrPayload", { length: 500 }).notNull(),
  frontAssetUrl: text("frontAssetUrl"),
  backAssetUrl: text("backAssetUrl"),
  productionStatus: mysqlEnum("productionStatus", ["draft", "ready", "in_production", "printed", "shipped", "delivered"]).default("draft").notNull(),
  issuedAt: timestamp("issuedAt"),
  expiresAt: date("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ orgIdx: index("membership_cards_org_idx").on(table.organizationId), memberIdx: index("membership_cards_member_idx").on(table.memberId) }));

export const fulfillmentOrders = mysqlTable("fulfillmentOrders", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  orderNumber: varchar("orderNumber", { length: 48 }).notNull(),
  memberIds: json("memberIds").notNull(),
  shippingAddress: json("shippingAddress").notNull(),
  status: mysqlEnum("status", ["queued", "in_production", "shipped", "delivered", "exception"]).default("queued").notNull(),
  printerProvider: varchar("printerProvider", { length: 80 }),
  courierProvider: varchar("courierProvider", { length: 80 }),
  trackingNumber: varchar("trackingNumber", { length: 120 }),
  shipmentStatus: varchar("shipmentStatus", { length: 80 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ orgIdx: index("fulfillment_orders_org_idx").on(table.organizationId), orderNumberIdx: index("fulfillment_orders_number_idx").on(table.orderNumber) }));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Member = typeof members.$inferSelect;
export type CardDesign = typeof cardDesigns.$inferSelect;
export type MembershipCard = typeof membershipCards.$inferSelect;
export type FulfillmentOrder = typeof fulfillmentOrders.$inferSelect;
