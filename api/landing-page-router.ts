import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { landingPages } from "@db/schema";
import { eq } from "drizzle-orm";

const demoLandingPages: Record<number, {
  title: string;
  slug: string;
  headline: string;
  subheadline: string;
  productDescription: string;
  featuresJson: string;
  testimonialsJson: string;
  faqJson: string;
  pricingDisplay: string;
  originalPrice: string;
  salePrice: string;
  discountPercentage: number;
  ctaText: string;
  ctaColor: string;
  template: "modern" | "minimal" | "bold" | "elegant";
}> = {
  1: {
    title: "Bluetooth Earbuds Pro — Premium Sound Under EGP 900",
    slug: "bluetooth-earbuds-pro",
    headline: "Premium Wireless Sound, Egyptian Price",
    subheadline: "Experience studio-quality audio with 40-hour battery, noise cancelling & IPX7 waterproofing",
    productDescription: "Introducing the Bluetooth Earbuds Pro — engineered for Egypt's music lovers, commuters, and fitness enthusiasts. With active noise cancellation that blocks out Cairo's bustle, 40 hours of total battery life, and an IPX7 waterproof rating that handles any workout, these earbuds deliver premium performance at a price that makes sense.",
    featuresJson: JSON.stringify([
      { icon: "Headphones", title: "Active Noise Cancellation", description: "Block out traffic, crowds, and noise. Focus on what matters." },
      { icon: "Battery", title: "40-Hour Battery Life", description: "8 hours per charge + 32 more from the case. A full week of use." },
      { icon: "Droplets", title: "IPX7 Waterproof", description: "Gym sweat, rain, or accidental splashes — no problem." },
      { icon: "Touchpad", title: "Touch Controls", description: "Play, pause, skip, and answer calls with a simple tap." },
      { icon: "Mic", title: "Crystal Clear Calls", description: "Dual microphones with noise reduction for clear conversations." },
      { icon: "Truck", title: "Free Delivery Egypt", description: "Free shipping to Cairo, Alexandria, and all governorates." },
    ]),
    testimonialsJson: JSON.stringify([
      { name: "Ahmed M.", location: "Cairo", text: "Best earbuds I've owned. The noise cancelling is amazing on the metro. Battery lasts forever!" },
      { name: "Sara K.", location: "Alexandria", text: "Bought these for the gym and now I use them everywhere. Great value for money." },
      { name: "Omar H.", location: "Giza", text: "Sound quality rivals earbuds that cost 3x more. Fast delivery too. Highly recommend!" },
    ]),
    faqJson: JSON.stringify([
      { q: "How long does shipping take?", a: "We deliver within 3-5 business days to Cairo and Alexandria, and 5-7 days to other governorates." },
      { q: "Is there a warranty?", a: "Yes! Every pair comes with a 12-month warranty against manufacturing defects." },
      { q: "Will these work with my iPhone/Android?", a: "Absolutely. Our earbuds use standard Bluetooth 5.2 and work with all smartphones, tablets, and laptops." },
      { q: "Can I use just one earbud at a time?", a: "Yes! Both earbuds work independently. Use either one for calls or both for stereo music." },
    ]),
    pricingDisplay: "sale",
    originalPrice: "1299",
    salePrice: "899",
    discountPercentage: 31,
    ctaText: "Order Now — Free Delivery",
    ctaColor: "#9D8CFF",
    template: "modern",
  },
  2: {
    title: "Smart Fitness Watch Ultra — Your Health Coach",
    slug: "smart-fitness-watch-ultra",
    headline: "Your Personal Health Coach on Your Wrist",
    subheadline: "Heart rate, blood oxygen, sleep tracking & 50+ sports — all-day battery, AMOLED display",
    productDescription: "Meet the Smart Fitness Watch Ultra — the most advanced health wearable designed for Egyptian lifestyles. Track your heart rate during intense Cairo workouts, monitor blood oxygen levels, analyze sleep quality, and choose from 50+ sport modes. The stunning AMOLED display with Egyptian Arabic interface support makes health tracking effortless.",
    featuresJson: JSON.stringify([
      { icon: "Heart", title: "Heart Rate Monitor", description: "24/7 continuous heart rate tracking with abnormal alerts." },
      { icon: "Wind", title: "Blood Oxygen (SpO2)", description: "Monitor oxygen saturation levels anytime, anywhere." },
      { icon: "Moon", title: "Sleep Analysis", description: "Track deep sleep, light sleep, and REM cycles nightly." },
      { icon: "Activity", title: "50+ Sport Modes", description: "From running to swimming to yoga — track every workout." },
      { icon: "Smartphone", title: "AMOLED Display", description: "Vibrant always-on display with Arabic language support." },
      { icon: "BatteryMedium", title: "7-Day Battery", description: "A full week of use on a single charge." },
    ]),
    testimonialsJson: JSON.stringify([
      { name: "Nour A.", location: "New Cairo", text: "Finally a smartwatch that supports Arabic! The sleep tracking helped me improve my rest quality." },
      { name: "Karim S.", location: "6th of October", text: "Battery life is incredible. I charge it once a week. The fitness modes are comprehensive." },
      { name: "Laila F.", location: "Mansoura", text: "Best gift I bought for my husband. He uses it for running and it's very accurate." },
    ]),
    faqJson: JSON.stringify([
      { q: "Is it compatible with iPhone and Android?", a: "Yes! Works seamlessly with both iOS and Android via our free app." },
      { q: "Can I wear it while swimming?", a: "Yes, it's IP68 water-resistant rated for swimming and showering." },
      { q: "Does it support Arabic language?", a: "Absolutely. The interface fully supports Egyptian Arabic with right-to-left layout." },
      { q: "What's the return policy?", a: "30-day money-back guarantee. No questions asked." },
    ]),
    pricingDisplay: "sale",
    originalPrice: "2299",
    salePrice: "1599",
    discountPercentage: 30,
    ctaText: "Get Yours — Limited Stock",
    ctaColor: "#9D8CFF",
    template: "modern",
  },
  3: {
    title: "20000mAh Power Bank — Never Run Out of Power",
    slug: "power-bank-20000mah",
    headline: "Power That Keeps Up With Egypt",
    subheadline: "20000mAh capacity, 22.5W fast charging, dual USB-C — the essential mobile accessory",
    productDescription: "Power through Cairo's longest days with our 20000mAh Fast Charge Power Bank. Featuring 22.5W fast charging, dual USB-C ports for simultaneous device charging, and an LED display that shows exact remaining power. Airplane-safe certification means you're covered whether commuting across town or flying abroad.",
    featuresJson: JSON.stringify([
      { icon: "Zap", title: "22.5W Fast Charging", description: "Charge your phone from 0 to 50% in just 30 minutes." },
      { icon: "BatteryFull", title: "20000mAh Capacity", description: "Charge most smartphones 4-5 times on a single charge." },
      { icon: "Usb", title: "Dual USB-C Ports", description: "Charge two devices simultaneously at full speed." },
      { icon: "Plane", title: "Airplane Safe", description: "Certified for carry-on luggage on all airlines." },
      { icon: "Gauge", title: "LED Power Display", description: "Know exactly how much power remains at a glance." },
      { icon: "Shield", title: "Multi-Protection", description: "Overcharge, overheat, and short-circuit protection built-in." },
    ]),
    testimonialsJson: JSON.stringify([
      { name: "Mohamed R.", location: "Cairo", text: "During power outages, this is a lifesaver. Charges my phone and tablet multiple times." },
      { name: "Fatima Z.", location: "Port Said", text: "Slim design fits easily in my bag. Fast charging really works — no more waiting hours." },
      { name: "Youssef T.", location: "Aswan", text: "Took it on a Nile cruise. Kept 3 phones charged for the entire trip. Amazing!" },
    ]),
    faqJson: JSON.stringify([
      { q: "How many times can it charge my phone?", a: "Most smartphones get 4-5 full charges. iPhones typically get 5-6 charges." },
      { q: "Is it allowed on airplanes?", a: "Yes! It's within the 100Wh limit for carry-on luggage on all airlines." },
      { q: "Does it support fast charging for Samsung/iPhone?", a: "Yes, it supports PD, QC3.0, and AFC protocols for all major brands." },
      { q: "How long does the power bank take to recharge?", a: "With a fast charger (18W+), it fully recharges in about 6-7 hours." },
    ]),
    pricingDisplay: "sale",
    originalPrice: "999",
    salePrice: "725",
    discountPercentage: 27,
    ctaText: "Order Now — Free Shipping",
    ctaColor: "#9D8CFF",
    template: "modern",
  },
};

async function ensureLandingPage(productId: number) {
  const db = getDb();
  const existing = await db
    .select()
    .from(landingPages)
    .where(eq(landingPages.productId, productId));

  if (existing.length === 0) {
    const demo = demoLandingPages[productId];
    if (demo) {
      await db.insert(landingPages).values({
        productId,
        ...demo,
      });
    }
  }
  return db
    .select()
    .from(landingPages)
    .where(eq(landingPages.productId, productId));
}

export const landingPageRouter = createRouter({
  getByProductId: publicQuery
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      const results = await ensureLandingPage(input.productId);
      return results[0] ?? null;
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db
        .select()
        .from(landingPages)
        .where(eq(landingPages.slug, input.slug));
      return results[0] ?? null;
    }),

  generate: publicQuery
    .input(
      z.object({
        productId: z.number(),
        template: z.enum(["modern", "minimal", "bold", "elegant"]).default("modern"),
      })
    )
    .mutation(async ({ input }) => {
      const results = await ensureLandingPage(input.productId);
      return results[0] ?? null;
    }),
});
