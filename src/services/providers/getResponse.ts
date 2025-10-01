import { CustomError } from "src/error/CustomError";
import httpClient from "../../utils/httpClient";
import { NormalizedList } from "src/interfaces/normalizedList";
import { ErrorCode } from "src/enum/error";

const BASE_URL = "https://api.getresponse.com/v3";

export async function validateApiKey(apiKey: string) {
  try {
    const res = await httpClient.get(`${BASE_URL}/accounts`, {
      headers: { "X-Auth-Token": `api-key ${apiKey}` },
    });
    return { valid: res.status === 200, details: res.data };
  } catch (err: any) {
    if (err.response?.status === 401) {
      throw new CustomError("Invalid GetResponse API key", ErrorCode.INVALID_TOKEN, 401);
    }
    throw new CustomError("GetResponse unavailable", ErrorCode.PROVIDER_UNAVAILABLE, 503);
  }
}

export async function fetchLists(apiKey: string, page = 1, perPage = 10): Promise<NormalizedList[]> {
  try {
    const res = await httpClient.get(`${BASE_URL}/campaigns`, {
      headers: { "X-Auth-Token": `api-key ${apiKey}` },
      params: { perPage, page },
    });

    return res.data.map((campaign: any) => ({
      provider: "getresponse",
      id: campaign.campaignId,
      name: campaign.name,
      memberCount: undefined, // GR requires extra stats call if needed
      raw: campaign,
    }));
  } catch (err: any) {
    if (err.response?.status === 401) {
      throw new CustomError("Unauthorized", ErrorCode.UNAUTHORIZED, 401);
    }
    throw new CustomError("GetResponse fetch failed", ErrorCode.PROVIDER_UNAVAILABLE, 503);
  }
}
