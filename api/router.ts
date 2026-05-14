import { authRouter } from "./auth-router";
import { localAuthRouter } from "./local-auth-router";
import { productRouter } from "./product-router";
import { analysisRouter } from "./analysis-router";
import { creativeRouter } from "./creative-router";
import { landingPageRouter } from "./landing-page-router";
import { marketingRouter } from "./marketing-router";
import { pricingRouter } from "./pricing-router";
import { contactRouter } from "./contact-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  product: productRouter,
  analysis: analysisRouter,
  creative: creativeRouter,
  landingPage: landingPageRouter,
  marketing: marketingRouter,
  pricing: pricingRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;
