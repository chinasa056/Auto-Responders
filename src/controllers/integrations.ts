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
    const { userId, provider, page = 1, perPage = 10 } = req.query;
    const result = await integrationService.fetchLists({
      userId: userId as string,
      provider: Provider[provider as keyof typeof Provider],
      page: Number(page),
      perPage: Number(perPage),
    });
    res.json({ status: true, data: result });
  } catch (err) {
    next(err);
  }
}
