import { Router } from "express";
import * as controller from "src/controllers/integrations";

const router = Router();

router.post("/", controller.createIntegration);
router.get("/lists", controller.getIntegrationLists);

export default router;
