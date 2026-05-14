import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { productAnalyses } from "@db/schema";
import { eq } from "drizzle-orm";

const demoAnalyses: Record<number, {
  swotStrengths: string;
  swotWeaknesses: string;
  swotOpportunities: string;
  swotThreats: string;
  marketAnalysis: string;
  competitorAnalysis: string;
  customerPersona: string;
  pricingStrategy: string;
  riskAssessment: string;
  recommendationScore: number;
}> = {
  1: {
    swotStrengths: "Strong brand recognition in budget audio segment\nHigh demand among Egyptian youth\nExcellent profit margins (80%+)",
    swotWeaknesses: "Saturated market with many similar products\nQuality perception challenges for low-priced electronics",
    swotOpportunities: "Growing smartphone penetration in Egypt\nRising fitness culture post-pandemic\nSocial media influencer marketing potential",
    swotThreats: "Rapid technology obsolescence\nCompetition from established brands\nImport regulation changes",
    marketAnalysis: "The Egyptian wireless earbuds market is experiencing rapid growth with a CAGR of 15.2%. Young professionals in Cairo and Alexandria drive 65% of demand. Price sensitivity is high — products under EGP 1,000 capture 78% of sales volume.",
    competitorAnalysis: "Main competitors include generic AliExpress sellers and local brands like Soda and V-Good. Most competitors lack proper marketing and rely on price competition alone. Opportunity exists for branded positioning with Egyptian-market messaging.",
    customerPersona: "Age 18-30, lives in Cairo/Alexandria, active on TikTok and Instagram, price-sensitive but values style, uses earbuds for commuting, gym, and social media content creation.",
    pricingStrategy: "Recommended retail: EGP 899 (5x markup from EGP 180 wholesale). Position as premium budget option. Offer bundle deals at EGP 1,599 for two units. Flash sales at EGP 699 to drive urgency.",
    riskAssessment: "Low risk — established demand, proven product category. Monitor: customer complaints about battery life, return rates above 8%.",
    recommendationScore: 92,
  },
  2: {
    swotStrengths: "Growing health consciousness trend\nMultiple use cases (fitness + fashion + productivity)\nHigh social media shareability",
    swotWeaknesses: "Higher wholesale cost requires careful pricing\nTechnical support may be needed for setup",
    swotOpportunities: "Fitness influencer partnerships\nCorporate wellness programs\nIntegration with Egyptian health apps",
    swotThreats: "Apple/Samsung dominant in premium segment\nBattery technology limitations",
    marketAnalysis: "Wearables market in Egypt grew 40% YoY. Smartwatches under EGP 2,000 represent the sweet spot. Fitness tracking is the #1 desired feature among Egyptian consumers.",
    competitorAnalysis: "Xiaomi dominates the budget segment. Huawei has strong presence. Gap exists for a well-marketed mid-range option with localized features (Arabic support, prayer time notifications).",
    customerPersona: "Age 25-40, health-conscious, gym member or home fitness enthusiast, uses health apps, values data tracking, active on social media, income EGP 8,000-25,000/month.",
    pricingStrategy: "Retail at EGP 1,599 (5x markup). Position as affordable luxury. Include free fitness e-book. Limited edition colors at EGP 1,899.",
    riskAssessment: "Medium risk — higher investment per unit. Ensure supplier reliability and warranty policy. Target return rate below 5%.",
    recommendationScore: 88,
  },
  3: {
    swotStrengths: "Universal need — every smartphone user needs power\nLow competition in branded segment\nVery high demand score",
    swotWeaknesses: "Commoditized product category\nLow differentiation potential",
    swotOpportunities: "Egypt's frequent power outages drive demand\nTravel and tourism recovery post-COVID\nCo-branding with phone accessories",
    swotThreats: "Price-sensitive market\nCounterfeit products\nAirline restrictions on large batteries",
    marketAnalysis: "Power banks are the #1 most searched mobile accessory in Egypt. 20000mAh capacity is the most popular size. Fast charging (18W+) is now expected by 70% of consumers.",
    competitorAnalysis: "Baseus and Anker dominate premium segment. Huge gap in mid-range branded power banks. Most sellers offer generic unbranded units with no warranty.",
    customerPersona: "Age 16-45, all demographics, students, professionals, travelers, gamers. Everyone with a smartphone is a potential customer. Universal appeal.",
    pricingStrategy: "Retail at EGP 725 (5x markup). Flash sale at EGP 599. Bundle with charging cable at EGP 849. Volume discount: 3 for EGP 1,899.",
    riskAssessment: "Very low risk — proven demand, low wholesale cost, universal appeal. Best starter product for new dropshippers.",
    recommendationScore: 95,
  },
  4: {
    swotStrengths: "Low wholesale cost\nUniversal car compatibility\nSimple product — no learning curve",
    swotWeaknesses: "Low perceived value\nLimited upsell potential",
    swotOpportunities: "Rising car ownership in Egypt\nRideshare driver market (Uber/Careem)\nGift market potential",
    swotThreats: "Very low price point limits margins\nHigh competition from car accessory shops",
    marketAnalysis: "Car accessories market in Egypt is fragmented with few online-only brands. Rideshare drivers represent a captive audience of 200,000+ potential customers.",
    competitorAnalysis: "Local car accessory shops dominate. No strong online brand presence. Opportunity for targeted Facebook ads to driver communities.",
    customerPersona: "Car owners aged 25-50, Uber/Careem drivers, delivery drivers. Practical buyers who prioritize function over brand.",
    pricingStrategy: "Retail at EGP 225 (5x markup). Bundle with car charger at EGP 349. Target rideshare drivers with bulk pricing.",
    riskAssessment: "Low risk, low reward. Good as an upsell product or for building customer base. Not a primary revenue driver.",
    recommendationScore: 78,
  },
  5: {
    swotStrengths: "Strong visual appeal for social media\nGrowing beauty market in Egypt\nGift-friendly product",
    swotWeaknesses: "Fragile — shipping risks\nHigher wholesale cost",
    swotOpportunities: "Beauty influencer partnerships\nSalon and spa B2B sales\nWedding season demand spike",
    swotThreats: "Established beauty brands\nSeasonal demand fluctuations",
    marketAnalysis: "Egypt's beauty and personal care market is valued at $2.8B and growing. LED mirrors are trending on TikTok Egypt with 50M+ views. Urban women aged 18-35 are the core demographic.",
    competitorAnalysis: "Limited online competition. Most LED mirrors sold through physical beauty stores. Opportunity for social media-first marketing with unboxing videos.",
    customerPersona: "Women 18-35, beauty enthusiasts, makeup artists, social media content creators. Urban, middle to upper-middle income. Active on Instagram and TikTok.",
    pricingStrategy: "Retail at EGP 1,100 (5x markup). Position as affordable luxury. Free beauty tutorial e-book. Limited edition rose gold at EGP 1,299.",
    riskAssessment: "Medium risk — fragile product, higher investment. Ensure quality packaging. Good margins justify the risk.",
    recommendationScore: 85,
  },
  6: {
    swotStrengths: "Eco-friendly trend alignment\nLow wholesale cost\nRepeat purchase potential",
    swotWeaknesses: "Seasonal demand (summer peak)\nLow differentiation",
    swotOpportunities: "Growing environmental consciousness\nCorporate gifting market\nFitness and sports segments",
    swotThreats: "Plastic bottle price competition\nCounterfeit branded bottles",
    marketAnalysis: "Reusable bottle market growing 12% annually in Egypt. Health-conscious millennials and Gen Z driving demand. Corporate wellness programs increasingly include branded drinkware.",
    competitorAnalysis: "Fragmented market with no dominant brand. Local retailers sell basic options. Premium insulated segment is underserved online.",
    customerPersona: "Students, gym members, eco-conscious consumers, office workers. Age 16-35, urban, active lifestyle, values sustainability.",
    pricingStrategy: "Retail at EGP 325 (5x markup). Bundle with fitness accessories at EGP 499. Corporate bulk pricing available.",
    riskAssessment: "Low risk, steady demand. Good evergreen product for consistent sales.",
    recommendationScore: 72,
  },
};

async function ensureAnalysis(productId: number) {
  const db = getDb();
  const existing = await db
    .select()
    .from(productAnalyses)
    .where(eq(productAnalyses.productId, productId));

  if (existing.length === 0) {
    const demo = demoAnalyses[productId];
    if (demo) {
      await db.insert(productAnalyses).values({
        productId,
        ...demo,
      });
    }
  }
  return db
    .select()
    .from(productAnalyses)
    .where(eq(productAnalyses.productId, productId));
}

export const analysisRouter = createRouter({
  getByProductId: publicQuery
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      const results = await ensureAnalysis(input.productId);
      return results[0] ?? null;
    }),

  generate: publicQuery
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ input }) => {
      const results = await ensureAnalysis(input.productId);
      return results[0] ?? null;
    }),
});
