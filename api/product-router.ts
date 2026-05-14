import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products } from "@db/schema";
import { like, eq, and, or, desc, sql } from "drizzle-orm";

// Seed demo products if table is empty
const demoProducts = [
  {
    name: "Wireless Bluetooth Earbuds Pro",
    description: "Premium noise-cancelling earbuds with 40-hour battery life, touch controls, and IPX7 water resistance. Perfect for Egyptian commuters and gym-goers.",
    category: "Electronics",
    niche: "Audio & Tech",
    imageUrl: "/img-product-1.jpg",
    wholesalePriceEgp: "180",
    suggestedPriceEgp: "899",
    profitMargin: "80.0",
    demandScore: 92,
    competitionLevel: "medium" as const,
    trendDirection: "rising" as const,
    marketSize: "Large",
    targetAudience: "Young professionals, students, fitness enthusiasts aged 18-35 in Cairo and Alexandria",
    keywords: "bluetooth earbuds, wireless headphones, noise cancelling, affordable earbuds Egypt",
    aliexpressUrl: "https://www.aliexpress.com/item/earbuds",
    isTrending: true,
    isHot: true,
    sourcePlatform: "AliExpress",
  },
  {
    name: "Smart Fitness Watch Ultra",
    description: "Advanced fitness tracker with heart rate monitoring, blood oxygen sensor, sleep analysis, and 50+ sport modes. AMOLED display with Egyptian Arabic interface support.",
    category: "Electronics",
    niche: "Wearables",
    imageUrl: "/img-product-2.jpg",
    wholesalePriceEgp: "320",
    suggestedPriceEgp: "1599",
    profitMargin: "80.0",
    demandScore: 88,
    competitionLevel: "medium" as const,
    trendDirection: "rising" as const,
    marketSize: "Large",
    targetAudience: "Health-conscious individuals, fitness enthusiasts, tech-savvy millennials aged 22-40",
    keywords: "smart watch, fitness tracker, heart rate monitor, wearable Egypt",
    aliexpressUrl: "https://www.aliexpress.com/item/smartwatch",
    isTrending: true,
    isHot: false,
    sourcePlatform: "AliExpress",
  },
  {
    name: "20000mAh Fast Charge Power Bank",
    description: "Ultra-slim 20000mAh power bank with 22.5W fast charging, dual USB-C ports, LED display, and airplane-safe certification. Essential for Egypt's mobile-first market.",
    category: "Electronics",
    niche: "Mobile Accessories",
    imageUrl: "/img-product-3.jpg",
    wholesalePriceEgp: "145",
    suggestedPriceEgp: "725",
    profitMargin: "80.0",
    demandScore: 95,
    competitionLevel: "low" as const,
    trendDirection: "rising" as const,
    marketSize: "Very Large",
    targetAudience: "All mobile users, travelers, students, professionals who need reliable power on the go",
    keywords: "power bank, portable charger, fast charge, battery pack Egypt",
    aliexpressUrl: "https://www.aliexpress.com/item/powerbank",
    isTrending: true,
    isHot: true,
    sourcePlatform: "AliExpress",
  },
  {
    name: "Silicone Phone Mount for Car",
    description: "Universal car phone holder with 360-degree rotation, anti-slip silicone grip, and one-hand operation. Works with all smartphone sizes. High demand from Cairo drivers.",
    category: "Automotive",
    niche: "Car Accessories",
    imageUrl: "/img-product-1.jpg",
    wholesalePriceEgp: "45",
    suggestedPriceEgp: "225",
    profitMargin: "80.0",
    demandScore: 78,
    competitionLevel: "low" as const,
    trendDirection: "stable" as const,
    marketSize: "Medium",
    targetAudience: "Car owners, Uber drivers, delivery drivers aged 25-50 in urban Egypt",
    keywords: "car phone holder, phone mount, car accessories Egypt",
    aliexpressUrl: "https://www.aliexpress.com/item/phonemount",
    isTrending: false,
    isHot: false,
    sourcePlatform: "AliExpress",
  },
  {
    name: "LED Vanity Mirror with Touch Control",
    description: "Hollywood-style LED makeup mirror with 3 light modes, touch dimming, and 10x magnification detachable mirror. Trending among Egyptian beauty enthusiasts.",
    category: "Beauty",
    niche: "Beauty Tools",
    imageUrl: "/img-product-2.jpg",
    wholesalePriceEgp: "220",
    suggestedPriceEgp: "1100",
    profitMargin: "80.0",
    demandScore: 85,
    competitionLevel: "medium" as const,
    trendDirection: "rising" as const,
    marketSize: "Medium",
    targetAudience: "Women aged 18-45 interested in beauty, makeup, and home decor",
    keywords: "LED mirror, vanity mirror, makeup mirror, beauty tools Egypt",
    aliexpressUrl: "https://www.aliexpress.com/item/mirror",
    isTrending: true,
    isHot: false,
    sourcePlatform: "AliExpress",
  },
  {
    name: "Stainless Steel Vacuum Insulated Bottle",
    description: "Double-wall vacuum insulated water bottle keeps drinks cold 24h or hot 12h. BPA-free, leak-proof, available in trendy colors. Growing health-conscious market.",
    category: "Home & Kitchen",
    niche: "Drinkware",
    imageUrl: "/img-product-3.jpg",
    wholesalePriceEgp: "65",
    suggestedPriceEgp: "325",
    profitMargin: "80.0",
    demandScore: 72,
    competitionLevel: "low" as const,
    trendDirection: "stable" as const,
    marketSize: "Medium",
    targetAudience: "Students, gym-goers, office workers, eco-conscious consumers aged 16-40",
    keywords: "insulated bottle, vacuum flask, water bottle, eco friendly Egypt",
    aliexpressUrl: "https://www.aliexpress.com/item/bottle",
    isTrending: false,
    isHot: false,
    sourcePlatform: "AliExpress",
  },
];

async function seedProducts() {
  const db = getDb();
  const existing = await db.select().from(products);
  if (existing.length === 0) {
    for (const p of demoProducts) {
      await db.insert(products).values(p);
    }
  }
}

export const productRouter = createRouter({
  search: publicQuery
    .input(
      z.object({
        query: z.string().optional(),
        category: z.string().optional(),
        niche: z.string().optional(),
        minDemandScore: z.number().optional(),
        maxCompetition: z.enum(["low", "medium", "high"]).optional(),
        isTrending: z.boolean().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      await seedProducts();
      const db = getDb();
      const conditions = [];

      if (input.query) {
        conditions.push(
          or(
            like(products.name, `%${input.query}%`),
            like(products.description, `%${input.query}%`),
            like(products.keywords, `%${input.query}%`)
          )
        );
      }
      if (input.category) {
        conditions.push(eq(products.category, input.category));
      }
      if (input.niche) {
        conditions.push(eq(products.niche, input.niche));
      }
      if (input.minDemandScore) {
        conditions.push(sql`${products.demandScore} >= ${input.minDemandScore}`);
      }
      if (input.maxCompetition) {
        conditions.push(eq(products.competitionLevel, input.maxCompetition));
      }
      if (input.isTrending !== undefined) {
        conditions.push(eq(products.isTrending, input.isTrending));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const results = await db
        .select()
        .from(products)
        .where(where)
        .orderBy(desc(products.demandScore))
        .limit(input.limit)
        .offset(input.offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(where);

      return {
        products: results,
        total: countResult[0]?.count ?? 0,
      };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      await seedProducts();
      const db = getDb();
      const result = await db
        .select()
        .from(products)
        .where(eq(products.id, input.id));
      return result[0] ?? null;
    }),

  getTrending: publicQuery
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      await seedProducts();
      const db = getDb();
      return db
        .select()
        .from(products)
        .where(eq(products.isTrending, true))
        .orderBy(desc(products.demandScore))
        .limit(input.limit);
    }),

  getHot: publicQuery
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      await seedProducts();
      const db = getDb();
      return db
        .select()
        .from(products)
        .where(eq(products.isHot, true))
        .orderBy(desc(products.demandScore))
        .limit(input.limit);
    }),

  discover: publicQuery
    .input(
      z.object({
        category: z.string().optional(),
        budget: z.number().optional(),
        niche: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await seedProducts();
      const db = getDb();
      const conditions = [];
      if (input.category) conditions.push(eq(products.category, input.category));
      if (input.niche) conditions.push(eq(products.niche, input.niche));
      if (input.budget) {
        conditions.push(sql`${products.wholesalePriceEgp} <= ${input.budget}`);
      }
      const where = conditions.length > 0 ? and(...conditions) : undefined;
      return db
        .select()
        .from(products)
        .where(where)
        .orderBy(desc(products.demandScore))
        .limit(10);
    }),

  getCategories: publicQuery.query(async () => {
    await seedProducts();
    const db = getDb();
    const result = await db
      .selectDistinct({ category: products.category })
      .from(products);
    return result.map((r) => r.category).filter(Boolean);
  }),

  getNiches: publicQuery.query(async () => {
    await seedProducts();
    const db = getDb();
    const result = await db
      .selectDistinct({ niche: products.niche })
      .from(products);
    return result.map((r) => r.niche).filter(Boolean);
  }),
});
