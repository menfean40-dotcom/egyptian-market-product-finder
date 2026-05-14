import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { adCreatives } from "@db/schema";
import { eq, and } from "drizzle-orm";

const demoCreatives: Record<number, Array<{
  creativeType: "image" | "video_script" | "headline" | "body_copy" | "call_to_action";
  title?: string;
  content?: string;
  headline?: string;
  bodyCopy?: string;
  callToAction?: string;
  targetPlatform: "facebook" | "instagram" | "tiktok" | "google" | "generic";
}>> = {
  1: [
    { creativeType: "headline", headline: "Premium Sound Under EGP 900? Yes, It's Real!", bodyCopy: "Experience studio-quality audio with our Bluetooth Earbuds Pro. 40-hour battery, noise cancelling, and waterproof design — all at a price that makes sense for Egypt.", callToAction: "Shop Now — Limited Stock", targetPlatform: "facebook" },
    { creativeType: "headline", headline: "Your Commute Just Got an Upgrade", bodyCopy: "Block out Cairo traffic noise with premium noise-cancelling earbuds. Touch controls, 40h battery, IPX7 waterproof. Free delivery across Egypt.", callToAction: "Order Now", targetPlatform: "instagram" },
    { creativeType: "headline", headline: "Egypt's Best-Selling Earbuds Are Back in Stock", bodyCopy: "Over 2,000 happy customers can't be wrong. Premium sound, budget price. 30-day money-back guarantee.", callToAction: "Get Yours Today", targetPlatform: "tiktok" },
    { creativeType: "image", title: "Ad Creative 1", targetPlatform: "facebook" },
    { creativeType: "image", title: "Ad Creative 2", targetPlatform: "instagram" },
    { creativeType: "image", title: "Ad Creative 3", targetPlatform: "tiktok" },
    { creativeType: "video_script", content: "Hook (0-3s): Close-up of earbuds case opening with satisfying click\nProblem (3-8s): Split screen — frustrated person with wired earbuds vs. happy user with wireless\nSolution (8-15s): Product showcase with feature callouts — 40h battery, noise cancelling, waterproof\nSocial Proof (15-20s): User testimonials with 5-star ratings\nCTA (20-25s): Price reveal EGP 899 + 'Limited Time' urgency banner\nOutro (25-30s): Logo + website + 'Free Shipping Egypt'", targetPlatform: "tiktok" },
  ],
  2: [
    { creativeType: "headline", headline: "Your Personal Health Coach on Your Wrist", bodyCopy: "Track heart rate, blood oxygen, sleep quality, and 50+ sports. The Smart Fitness Watch Ultra puts pro-level health monitoring within reach.", callToAction: "Discover More", targetPlatform: "facebook" },
    { creativeType: "headline", headline: "Fitness Goals? Meet Your New Partner", bodyCopy: "From the gym to the office, this smartwatch tracks everything that matters. AMOLED display, 7-day battery, Egyptian Arabic support.", callToAction: "Shop the Ultra", targetPlatform: "instagram" },
    { creativeType: "image", title: "Smart Watch Ad 1", targetPlatform: "facebook" },
    { creativeType: "image", title: "Smart Watch Ad 2", targetPlatform: "instagram" },
    { creativeType: "video_script", content: "Hook (0-3s): Wrist shot — watch face glowing with health metrics\nProblem (3-8s): 'How do you know if your workout is actually working?'\nFeatures (8-18s): Heart rate, SpO2, sleep tracking, 50 sports — fast cuts with energetic music\nTransformation (18-23s): Before/after fitness journey montage\nOffer (23-28s): EGP 1,599 + free fitness guide\nCTA (28-30s): 'Swipe up to order'", targetPlatform: "tiktok" },
  ],
  3: [
    { creativeType: "headline", headline: "Never Run Out of Battery Again", bodyCopy: "20000mAh of power in your pocket. Fast charge any device, anywhere. The #1 must-have accessory every Egyptian smartphone user needs.", callToAction: "Get Power Now", targetPlatform: "facebook" },
    { creativeType: "headline", headline: "Cairo's Power Cuts? Not Your Problem", bodyCopy: "22.5W fast charging, 20000mAh capacity, dual USB-C. Keep your phone, tablet, and earbuds charged through any outage.", callToAction: "Buy Now — EGP 725", targetPlatform: "tiktok" },
    { creativeType: "image", title: "Power Bank Ad 1", targetPlatform: "facebook" },
    { creativeType: "image", title: "Power Bank Ad 2", targetPlatform: "instagram" },
    { creativeType: "image", title: "Power Bank Ad 3", targetPlatform: "tiktok" },
    { creativeType: "video_script", content: "Hook (0-3s): Phone battery at 1% — dramatic music\nProblem (3-7s): Power outage scene, frustrated user\nSolution (7-15s): Power bank reveal — slim, stylish, powerful. Feature highlights with text overlays\nDemonstration (15-20s): Charging 3 devices simultaneously\nSocial Proof (20-24s): '5000+ sold in Egypt' badge\nCTA (24-30s): EGP 725 + free delivery + flash sale countdown", targetPlatform: "facebook" },
  ],
};

async function ensureCreatives(productId: number) {
  const db = getDb();
  const existing = await db
    .select()
    .from(adCreatives)
    .where(eq(adCreatives.productId, productId));

  if (existing.length === 0) {
    const demos = demoCreatives[productId];
    if (demos) {
      for (const c of demos) {
        await db.insert(adCreatives).values({
          productId,
          creativeType: c.creativeType,
          title: c.title ?? null,
          content: c.content ?? null,
          headline: c.headline ?? null,
          bodyCopy: c.bodyCopy ?? null,
          callToAction: c.callToAction ?? null,
          targetPlatform: c.targetPlatform,
        });
      }
    }
  }
}

export const creativeRouter = createRouter({
  getByProductId: publicQuery
    .input(
      z.object({
        productId: z.number(),
        type: z.enum(["image", "video_script", "headline", "body_copy", "call_to_action"]).optional(),
      })
    )
    .query(async ({ input }) => {
      await ensureCreatives(input.productId);
      const db = getDb();
      if (input.type) {
        return db
          .select()
          .from(adCreatives)
          .where(
            and(
              eq(adCreatives.productId, input.productId),
              eq(adCreatives.creativeType, input.type)
            )
          )
          .orderBy(adCreatives.id);
      }
      return db
        .select()
        .from(adCreatives)
        .where(eq(adCreatives.productId, input.productId))
        .orderBy(adCreatives.id);
    }),

  generateCopy: publicQuery
    .input(
      z.object({
        productId: z.number(),
        platform: z.enum(["facebook", "instagram", "tiktok", "google", "generic"]).default("facebook"),
      })
    )
    .mutation(async ({ input }) => {
      await ensureCreatives(input.productId);
      const db = getDb();
      return db
        .select()
        .from(adCreatives)
        .where(
          and(
            eq(adCreatives.productId, input.productId),
            eq(adCreatives.targetPlatform, input.platform),
            eq(adCreatives.creativeType, "headline")
          )
        );
    }),

  generateVideoScript: publicQuery
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ input }) => {
      await ensureCreatives(input.productId);
      const db = getDb();
      const results = await db
        .select()
        .from(adCreatives)
        .where(
          and(
            eq(adCreatives.productId, input.productId),
            eq(adCreatives.creativeType, "video_script")
          )
        );
      return results[0] ?? null;
    }),
});
