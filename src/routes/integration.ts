import { Router } from "express";
import * as controller from "src/controllers/integrations";
import { providerLimiter } from "src/middleware/rateLimiter";

const router = Router();

router.post("/", controller.createIntegration);
router.get("/lists", providerLimiter, controller.getIntegrationLists);

export default router;
