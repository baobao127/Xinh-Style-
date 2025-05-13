import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real, primaryKey, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  fullName: text("full_name"),
  phone: text("phone"),
  address: text("address"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  phone: true,
  address: true,
});

// Product Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
  description: true,
  image: true,
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: real("price").notNull(),
  salePrice: real("sale_price"),
  discount: integer("discount"),
  inStock: boolean("in_stock").default(true),
  categoryId: integer("category_id").references(() => categories.id),
  images: jsonb("images").$type<string[]>(),
  colors: jsonb("colors").$type<string[]>(),
  sizes: jsonb("sizes").$type<string[]>(),
  featured: boolean("featured").default(false),
  newArrival: boolean("new_arrival").default(false),
  flashSale: boolean("flash_sale").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  slug: true,
  description: true,
  price: true,
  salePrice: true,
  discount: true,
  inStock: true,
  categoryId: true,
  images: true,
  colors: true,
  sizes: true,
  featured: true,
  newArrival: true,
  flashSale: true,
});

// Collections table
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
});

export const insertCollectionSchema = createInsertSchema(collections).pick({
  name: true,
  slug: true,
  description: true,
  image: true,
});

// Collection Products (many-to-many)
export const collectionProducts = pgTable("collection_products", {
  collectionId: integer("collection_id").references(() => collections.id),
  productId: integer("product_id").references(() => products.id),
}, (t) => ({
  pk: primaryKey(t.collectionId, t.productId),
}));

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  status: text("status").default("pending"),
  total: real("total").notNull(),
  paymentMethod: text("payment_method").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  contactPhone: text("contact_phone").notNull(),
  contactName: text("contact_name").notNull(),
  couponCode: text("coupon_code"),
  couponDiscount: real("coupon_discount").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  total: true,
  paymentMethod: true,
  shippingAddress: true,
  contactPhone: true,
  contactName: true,
  couponCode: true,
  couponDiscount: true,
});

// Order Items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
  size: text("size"),
  color: text("color"),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  quantity: true,
  price: true,
  size: true,
  color: true,
});

// Wishlists table
export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id").references(() => products.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWishlistSchema = createInsertSchema(wishlists).pick({
  userId: true,
  productId: true,
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id").references(() => products.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  userId: true,
  productId: true,
  rating: true,
  comment: true,
});

// Coupons table
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  discount: real("discount").notNull(),
  isPercentage: boolean("is_percentage").default(true),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  active: boolean("active").default(true),
  minOrder: real("min_order").default(0),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0),
});

export const insertCouponSchema = createInsertSchema(coupons).pick({
  code: true,
  discount: true,
  isPercentage: true,
  startDate: true,
  endDate: true,
  active: true,
  minOrder: true,
  maxUses: true,
});

// User Browsing History table
export const browsingHistory = pgTable("browsing_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id").references(() => products.id),
  viewedAt: timestamp("viewed_at").defaultNow(),
});

export const insertBrowsingHistorySchema = createInsertSchema(browsingHistory).pick({
  userId: true,
  productId: true,
});

// Flash Sale table
export const flashSales = pgTable("flash_sales", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  active: boolean("active").default(true),
});

export const insertFlashSaleSchema = createInsertSchema(flashSales).pick({
  name: true,
  startDate: true,
  endDate: true,
  active: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Collection = typeof collections.$inferSelect;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Wishlist = typeof wishlists.$inferSelect;
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;

export type BrowsingHistory = typeof browsingHistory.$inferSelect;
export type InsertBrowsingHistory = z.infer<typeof insertBrowsingHistorySchema>;

export type FlashSale = typeof flashSales.$inferSelect;
export type InsertFlashSale = z.infer<typeof insertFlashSaleSchema>;
