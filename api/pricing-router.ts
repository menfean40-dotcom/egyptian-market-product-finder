import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { pricingCalculations } from "@db/schema";
import { desc } from "drizzle-orm";

export const pricingRouter = createRouter({
  calculate: publicQuery
    .input(
      z.object({
        wholesalePriceEgp: z.number().min(0),
        shippingCostEgp: z.number().default(0),
        packagingCostEgp: z.number().default(0),
        platformFeesEgp: z.number().default(0),
        marketingCostEgp: z.number().default(0),
        markupMultiplier: z.number().default(5),
        monthlyVolume: z.number().default(100),
        productId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const totalCost =
        input.wholesalePriceEgp +
        input.shippingCostEgp +
        input.packagingCostEgp +
        input.platformFeesEgp +
        input.marketingCostEgp;

      const suggestedPrice = totalCost * input.markupMultiplier;
      const profitPerUnit = suggestedPrice - totalCost;
      const profitMarginPercent = totalCost > 0 ? (profitPerUnit / suggestedPrice) * 100 : 0;
      const breakevenUnits = profitPerUnit > 0 ? Math.ceil(input.marketingCostEgp / profitPerUnit) : 0;
      const monthlyRevenue = suggestedPrice * input.monthlyVolume;
      const monthlyProfit = profitPerUnit * input.monthlyVolume;

      const db = getDb();
      const result = await db.insert(pricingCalculations).values({
        productId: input.productId ?? null,
        wholesalePriceEgp: input.wholesalePriceEgp.toFixed(2),
        shippingCostEgp: input.shippingCostEgp.toFixed(2),
        packagingCostEgp: input.packagingCostEgp.toFixed(2),
        platformFeesEgp: input.platformFeesEgp.toFixed(2),
        marketingCostEgp: input.marketingCostEgp.toFixed(2),
        totalCostEgp: totalCost.toFixed(2),
        markupMultiplier: input.markupMultiplier.toFixed(2),
        suggestedPriceEgp: suggestedPrice.toFixed(2),
        profitPerUnitEgp: profitPerUnit.toFixed(2),
        profitMarginPercent: profitMarginPercent.toFixed(2),
        breakevenUnits,
        monthlyRevenueProjection: monthlyRevenue.toFixed(2),
        monthlyProfitProjection: monthlyProfit.toFixed(2),
      });

      return {
        id: Number(result[0].insertId),
        wholesalePriceEgp: input.wholesalePriceEgp,
        shippingCostEgp: input.shippingCostEgp,
        packagingCostEgp: input.packagingCostEgp,
        platformFeesEgp: input.platformFeesEgp,
        marketingCostEgp: input.marketingCostEgp,
        totalCostEgp: totalCost,
        markupMultiplier: input.markupMultiplier,
        suggestedPriceEgp: suggestedPrice,
        profitPerUnitEgp: profitPerUnit,
        profitMarginPercent,
        breakevenUnits,
        monthlyRevenueProjection: monthlyRevenue,
        monthlyProfitProjection: monthlyProfit,
      };
    }),

  getHistory: publicQuery
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(pricingCalculations)
        .orderBy(desc(pricingCalculations.createdAt))
        .limit(input.limit);
    }),
});
