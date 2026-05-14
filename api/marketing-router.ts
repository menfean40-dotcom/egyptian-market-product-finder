import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { marketingHooks } from "@db/schema";
import { eq, and } from "drizzle-orm";

const demoHooks: Record<number, Array<{
  hookAngle: string;
  hookText: string;
  hookType: "emotional" | "urgency" | "social_proof" | "curiosity" | "fear" | "desire" | "value";
  targetPlatform: "facebook" | "instagram" | "tiktok" | "google" | "generic";
  estimatedCtr: string;
}>> = {
  1: [
    { hookAngle: "Price Shock Value", hookText: "Premium sound under EGP 900? We didn't believe it either until we tested these earbuds.", hookType: "curiosity", targetPlatform: "facebook", estimatedCtr: "3.2" },
    { hookAngle: "Commute Transformation", hookText: "Block out Cairo traffic noise and turn your daily commute into a concert hall.", hookType: "desire", targetPlatform: "facebook", estimatedCtr: "2.8" },
    { hookAngle: "Social Proof", hookText: "2,000+ Egyptians switched to these earbuds last month. Here's why:", hookType: "social_proof", targetPlatform: "instagram", estimatedCtr: "4.1" },
    { hookAngle: "FOMO Urgency", hookText: "Last batch sold out in 48 hours. Our new shipment just arrived — but it's going fast.", hookType: "urgency", targetPlatform: "tiktok", estimatedCtr: "5.5" },
    { hookAngle: "Comparison Hook", hookText: "Why pay EGP 3,000+ for AirPods when these deliver the same sound for a third of the price?", hookType: "value", targetPlatform: "facebook", estimatedCtr: "3.8" },
    { hookAngle: "Pain Point", hookText: "Tired of earbuds that die halfway through your day? These last 40 hours on one charge.", hookType: "fear", targetPlatform: "instagram", estimatedCtr: "2.9" },
  ],
  2: [
    { hookAngle: "Health Transformation", hookText: "What if your watch could predict health issues before they happen? This one tracks 8 vital metrics 24/7.", hookType: "curiosity", targetPlatform: "facebook", estimatedCtr: "3.5" },
    { hookAngle: "Lifestyle Upgrade", hookText: "From couch to 5K — the watch that holds your hand through every step of your fitness journey.", hookType: "emotional", targetPlatform: "instagram", estimatedCtr: "2.7" },
    { hookAngle: "TikTok Viral", hookText: "POV: You finally understand why you feel tired all the time (the data doesn't lie)", hookType: "curiosity", targetPlatform: "tiktok", estimatedCtr: "6.2" },
    { hookAngle: "Gift Angle", hookText: "The gift that says 'I care about your health' — without breaking the bank at EGP 1,599.", hookType: "emotional", targetPlatform: "facebook", estimatedCtr: "2.4" },
    { hookAngle: "Feature Highlight", hookText: "7-day battery + Arabic support + 50 sports = the smartest watch under EGP 2,000.", hookType: "value", targetPlatform: "google", estimatedCtr: "4.0" },
  ],
  3: [
    { hookAngle: "Pain Point", hookText: "Your phone dies at 3 PM every day. Your power bank dies at 4 PM. This one doesn't die.", hookType: "fear", targetPlatform: "facebook", estimatedCtr: "4.3" },
    { hookAngle: "Egypt-Specific", hookText: "Cairo power cut? Not your problem anymore. 20000mAh keeps you powered through any outage.", hookType: "urgency", targetPlatform: "tiktok", estimatedCtr: "5.8" },
    { hookAngle: "Value Proposition", hookText: "Charge your phone 5 times for less than EGP 150 per charge. The math just works.", hookType: "value", targetPlatform: "facebook", estimatedCtr: "3.1" },
    { hookAngle: "Social Proof", hookText: "5000+ sold in Egypt. 4.8/5 stars. The #1 rated power bank by Egyptian tech reviewers.", hookType: "social_proof", targetPlatform: "instagram", estimatedCtr: "3.6" },
    { hookAngle: "Universal Need", hookText: "If you own a smartphone, you need this. It's not optional — it's essential.", hookType: "desire", targetPlatform: "google", estimatedCtr: "2.9" },
  ],
};

async function ensureHooks(productId: number) {
  const db = getDb();
  const existing = await db
    .select()
    .from(marketingHooks)
    .where(eq(marketingHooks.productId, productId));

  if (existing.length === 0) {
    const demos = demoHooks[productId];
    if (demos) {
      for (const h of demos) {
        await db.insert(marketingHooks).values({
          productId,
          hookAngle: h.hookAngle,
          hookText: h.hookText,
          hookType: h.hookType,
          targetPlatform: h.targetPlatform,
          estimatedCtr: h.estimatedCtr,
        });
      }
    }
  }
}

export const marketingRouter = createRouter({
  getHooksByProductId: publicQuery
    .input(
      z.object({
        productId: z.number(),
        platform: z.enum(["facebook", "instagram", "tiktok", "google", "generic"]).optional(),
      })
    )
    .query(async ({ input }) => {
      await ensureHooks(input.productId);
      const db = getDb();
      if (input.platform) {
        return db
          .select()
          .from(marketingHooks)
          .where(
            and(
              eq(marketingHooks.productId, input.productId),
              eq(marketingHooks.targetPlatform, input.platform)
            )
          )
          .orderBy(marketingHooks.id);
      }
      return db
        .select()
        .from(marketingHooks)
        .where(eq(marketingHooks.productId, input.productId))
        .orderBy(marketingHooks.id);
    }),

  generateHooks: publicQuery
    .input(
      z.object({
        productId: z.number(),
        platform: z.enum(["facebook", "instagram", "tiktok", "google", "generic"]).default("facebook"),
        count: z.number().default(5),
      })
    )
    .mutation(async ({ input }) => {
      await ensureHooks(input.productId);
      const db = getDb();
      return db
        .select()
        .from(marketingHooks)
        .where(eq(marketingHooks.productId, input.productId))
        .limit(input.count);
    }),

  getAngles: publicQuery
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      await ensureHooks(input.productId);
      return {
        angles: [
          "Price comparison against premium brands",
          "Problem-solution (pain point relief)",
          "Social proof and testimonials",
          "Urgency and scarcity (limited stock)",
          "Lifestyle transformation",
          "Gift-giving angle",
          "Feature highlight and specification",
        ],
        insights: [
          "Egyptian consumers are highly price-sensitive but value quality",
          "Social proof (reviews, sold count) dramatically increases conversion",
          "Free delivery is a strong motivator in the Egyptian market",
          "Cash on delivery preference — mention COD availability",
          "Arabic language support increases trust and engagement",
        ],
      };
    }),
});
