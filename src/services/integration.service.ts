
import { CustomError } from "src/error/CustomError";
import { ErrorCode } from "src/enum/error";
import * as MailchimpAdapter from "./providers/mailChimp";
import * as GetResponseAdapter from "./providers/getResponse";
import { NormalizedListResponse } from "src/interfaces/normalizedList";
import {IIntegration} from "src/interfaces/integrations"
import Integration from "src/models/integration";
import { Provider, Status } from "src/enum/appEnums";
import { Types } from "mongoose";

export async function addIntegration({
  userId,
  provider,
  apiKey,
}: {
  userId?: string;
  provider: Provider
  apiKey: string;
}): Promise<IIntegration> {
  let result;
  if (provider === Provider.mailchimp) {
    result = await MailchimpAdapter.validateApiKey(apiKey);
  } else if (provider === Provider.getresponse) {
    result = await GetResponseAdapter.validateApiKey(apiKey);
  } else {
    throw new CustomError("Unsupported provider", ErrorCode.BAD_REQUEST, 400);
  }

  if (!result.valid) {
    throw new CustomError("Invalid API key", ErrorCode.INVALID_TOKEN, 401);
  }

  const integration = new Integration({
    userId,
    provider,
    apiKey,
    meta: result.details,
    status: Status.active,
    validatedAt: new Date(),
  });

   await integration.save();
    return integration;
};

export async function fetchLists({
  integrationId,
  provider,
  page = 1,
  perPage = 10,
}: {
  integrationId: string;
  provider: Provider;
  page?: number;
  perPage?: number;
}): Promise<NormalizedListResponse> {
    
  const integration = await Integration.findOne({ integrationId, provider });
  if (!integration) {
    throw new CustomError("info not found", ErrorCode.NOT_FOUND, 404);
  }

  let lists;
  if (provider === Provider.mailchimp) {
    lists = await MailchimpAdapter.fetchLists(integration.apiKey, page, perPage);
  } else {
    lists = await GetResponseAdapter.fetchLists(integration.apiKey, page, perPage);
  }

  return {
    lists,
    meta: { total: lists.length, page, perPage },
  };
}
