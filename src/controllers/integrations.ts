import { Request, Response, NextFunction } from "express";
import * as integrationService from "../services/integration.service";
import { Provider } from "src/enum/appEnums";

export async function createIntegration(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, provider, apiKey } = req.body;
    const integration = await integrationService.addIntegration({ userId, provider, apiKey });
    res.status(201).json({ status: true, data: integration });
  } catch (err) {
    next(err);
  }
}

export async function getIntegrationLists(req: Request, res: Response, next: NextFunction) {
  try {
    const { integrationId, provider, page = 1, perPage = 10 } = req.query;
    
    if (!integrationId || !provider) {
      return res.status(400).json({ status: false, message: "integrationId and provider are required" });
    }
    const result = await integrationService.fetchLists({
      integrationId: integrationId as string,
      provider: Provider[provider as keyof typeof Provider],
      page: Number(page),
      perPage: Number(perPage),
    });
    res.json({ status: true, data: result });
  } catch (err) {
    next(err);
  }
}
