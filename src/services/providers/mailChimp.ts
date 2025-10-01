import { CustomError } from "src/error/CustomError";
import httpClient from "../../utils/httpClient";
import { NormalizedList } from "src/interfaces/normalizedList";
import { ErrorCode } from "src/enum/error";
const BASE_URL = "https://<DC>.api.mailchimp.com/3.0"; 
// <DC> = datacenter from API key (after the "-")

function getBaseUrl(apiKey: string) {
  const parts = apiKey.split("-");
  if (parts.length !== 2) {
    throw new CustomError(
      "Invalid Mailchimp API key format",
      ErrorCode.INVALID_TOKEN,
      400
    );
  }
  return BASE_URL.replace("<DC>", parts[1]);
}

export async function validateApiKey(apiKey: string) {
  try {
    const url = `${getBaseUrl(apiKey)}/ping`;
    const res = await httpClient.get(url, {
      auth: { username: "anystring", password: apiKey },
    });
    return { valid: res.status === 200, details: res.data };
  } catch (err: any) {
    if (err.response?.status === 401) {
      throw new CustomError("Invalid Mailchimp API key", ErrorCode.INVALID_TOKEN, 401);
    }
    throw new CustomError("Mailchimp unavailable", ErrorCode.PROVIDER_UNAVAILABLE, 503);
  }
}

export async function fetchLists(apiKey: string, page = 1, perPage = 10): Promise<NormalizedList[]> {
  try {
    const url = `${getBaseUrl(apiKey)}/lists?offset=${(page - 1) * perPage}&count=${perPage}`;
    const res = await httpClient.get(url, {
      auth: { username: "anystring", password: apiKey },
    });

    return res.data.lists.map((list: any) => ({
      provider: "mailchimp",
      id: list.id,
      name: list.name,
      memberCount: list.stats.member_count,
      raw: list,
    }));
  } catch (err: any) {
    if (err.response?.status === 401) {
      throw new CustomError("Unauthorized", ErrorCode.UNAUTHORIZED, 401);
    }
    throw new CustomError("Mailchimp fetch failed", ErrorCode.PROVIDER_UNAVAILABLE, 503);
  }
}
