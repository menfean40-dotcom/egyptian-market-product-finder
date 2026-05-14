import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  boolean,
  bigint,
  decimal,
} from "drizzle-orm/mysql-core";

// ─── Users (OAuth) ───────────────────────────────────────────
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("union_id", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  subscriptionTier: mysqlEnum("subscription_tier", ["free", "starter", "pro", "agency"]).default("free").notNull(),
  searchesRemaining: int("searches_remaining").default(10).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("last_sign_in_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Local Users (Username/Password) ─────────────────────────
export const localUsers = mysqlTable("local_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  displayName: varchar("display_name", { length: 255 }),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  subscriptionTier: mysqlEnum("subscription_tier", ["free", "starter", "pro", "agency"]).default("free").notNull(),
  searchesRemaining: int("searches_remaining").default(10).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type LocalUser = typeof localUsers.$inferSelect;
export type InsertLocalUser = typeof localUsers.$inferInsert;

// ─── Products ────────────────────────────────────────────────
export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  niche: varchar("niche", { length: 100 }),
  imageUrl: varchar("image_url", { length: 512 }),
  wholesalePriceEgp: decimal("wholesale_price_egp", { precision: 10, scale: 2 }),
  suggestedPriceEgp: decimal("suggested_price_egp", { precision: 10, scale: 2 }),
  profitMargin: decimal("profit_margin", { precision: 5, scale: 2 }),
  demandScore: int("demand_score"),
  competitionLevel: mysqlEnum("competition_level", ["low", "medium", "high"]).default("medium"),
  trendDirection: mysqlEnum("trend_direction", ["rising", "stable", "declining"]).default("stable"),
  marketSize: varchar("market_size", { length: 50 }),
  targetAudience: text("target_audience"),
  keywords: text("keywords"),
  aliexpressUrl: varchar("aliexpress_url", { length: 512 }),
  amazonEgyptUrl: varchar("amazon_egypt_url", { length: 512 }),
  nooragoUrl: varchar("noorago_url", { length: 512 }),
  isTrending: boolean("is_trending").default(false),
  isHot: boolean("is_hot").default(false),
  sourcePlatform: varchar("source_platform", { length: 50 }),
  userId: bigint("user_id", { mode: "number", unsigned: true }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// ─── Product Analyses ────────────────────────────────────────
export const productAnalyses = mysqlTable("product_analyses", {
  id: serial("id").primaryKey(),
  productId: bigint("product_id", { mode: "number", unsigned: true }).notNull(),
  swotStrengths: text("swot_strengths"),
  swotWeaknesses: text("swot_weaknesses"),
  swotOpportunities: text("swot_opportunities"),
  swotThreats: text("swot_threats"),
  marketAnalysis: text("market_analysis"),
  competitorAnalysis: text("competitor_analysis"),
  customerPersona: text("customer_persona"),
  pricingStrategy: text("pricing_strategy"),
  riskAssessment: text("risk_assessment"),
  recommendationScore: int("recommendation_score"),
  aiGenerated: boolean("ai_generated").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type ProductAnalysis = typeof productAnalyses.$inferSelect;
export type InsertProductAnalysis = typeof productAnalyses.$inferInsert;

// ─── Ad Creatives ────────────────────────────────────────────
export const adCreatives = mysqlTable("ad_creatives", {
  id: serial("id").primaryKey(),
  productId: bigint("product_id", { mode: "number", unsigned: true }).notNull(),
  creativeType: mysqlEnum("creative_type", ["image", "video_script", "headline", "body_copy", "call_to_action"]).notNull(),
  title: varchar("title", { length: 255 }),
  content: text("content"),
  imageUrl: varchar("image_url", { length: 512 }),
  headline: varchar("headline", { length: 255 }),
  bodyCopy: text("body_copy"),
  callToAction: varchar("call_to_action", { length: 100 }),
  targetPlatform: mysqlEnum("target_platform", ["facebook", "instagram", "tiktok", "google", "generic"]).default("facebook"),
  aiGenerated: boolean("ai_generated").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AdCreative = typeof adCreatives.$inferSelect;
export type InsertAdCreative = typeof adCreatives.$inferInsert;

// ─── Landing Pages ───────────────────────────────────────────
export const landingPages = mysqlTable("landing_pages", {
  id: serial("id").primaryKey(),
  productId: bigint("product_id", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  headline: varchar("headline", { length: 255 }),
  subheadline: varchar("subheadline", { length: 255 }),
  heroImageUrl: varchar("hero_image_url", { length: 512 }),
  productDescription: text("product_description"),
  featuresJson: text("features_json"),
  testimonialsJson: text("testimonials_json"),
  faqJson: text("faq_json"),
  pricingDisplay: varchar("pricing_display", { length: 50 }),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }),
  discountPercentage: int("discount_percentage"),
  ctaText: varchar("cta_text", { length: 100 }),
  ctaColor: varchar("cta_color", { length: 20 }),
  template: mysqlEnum("template", ["modern", "minimal", "bold", "elegant"]).default("modern"),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  aiGenerated: boolean("ai_generated").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type LandingPage = typeof landingPages.$inferSelect;
export type InsertLandingPage = typeof landingPages.$inferInsert;

// ─── Marketing Hooks ─────────────────────────────────────────
export const marketingHooks = mysqlTable("marketing_hooks", {
  id: serial("id").primaryKey(),
  productId: bigint("product_id", { mode: "number", unsigned: true }).notNull(),
  hookAngle: varchar("hook_angle", { length: 255 }),
  hookText: text("hook_text"),
  hookType: mysqlEnum("hook_type", ["emotional", "urgency", "social_proof", "curiosity", "fear", "desire", "value"]).default("emotional"),
  targetPlatform: mysqlEnum("target_platform", ["facebook", "instagram", "tiktok", "google", "generic"]).default("facebook"),
  estimatedCtr: decimal("estimated_ctr", { precision: 5, scale: 2 }),
  aiGenerated: boolean("ai_generated").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type MarketingHook = typeof marketingHooks.$inferSelect;
export type InsertMarketingHook = typeof marketingHooks.$inferInsert;

// ─── Pricing Calculations ────────────────────────────────────
export const pricingCalculations = mysqlTable("pricing_calculations", {
  id: serial("id").primaryKey(),
  productId: bigint("product_id", { mode: "number", unsigned: true }),
  userId: bigint("user_id", { mode: "number", unsigned: true }),
  wholesalePriceEgp: decimal("wholesale_price_egp", { precision: 10, scale: 2 }).notNull(),
  shippingCostEgp: decimal("shipping_cost_egp", { precision: 10, scale: 2 }).default("0"),
  packagingCostEgp: decimal("packaging_cost_egp", { precision: 10, scale: 2 }).default("0"),
  platformFeesEgp: decimal("platform_fees_egp", { precision: 10, scale: 2 }).default("0"),
  marketingCostEgp: decimal("marketing_cost_egp", { precision: 10, scale: 2 }).default("0"),
  totalCostEgp: decimal("total_cost_egp", { precision: 10, scale: 2 }).notNull(),
  markupMultiplier: decimal("markup_multiplier", { precision: 5, scale: 2 }).notNull().default("5.00"),
  suggestedPriceEgp: decimal("suggested_price_egp", { precision: 10, scale: 2 }).notNull(),
  profitPerUnitEgp: decimal("profit_per_unit_egp", { precision: 10, scale: 2 }).notNull(),
  profitMarginPercent: decimal("profit_margin_percent", { precision: 5, scale: 2 }).notNull(),
  breakevenUnits: int("breakeven_units"),
  monthlyRevenueProjection: decimal("monthly_revenue_projection", { precision: 12, scale: 2 }),
  monthlyProfitProjection: decimal("monthly_profit_projection", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PricingCalculation = typeof pricingCalculations.$inferSelect;
export type InsertPricingCalculation = typeof pricingCalculations.$inferInsert;

// ─── Messages (Contact) ──────────────────────────────────────
export const messages = mysqlTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
