import { CustomError } from "src/error/CustomError";
import httpClient from "../../utils/httpClient";
import { NormalizedList } from "src/interfaces/normalizedList";
import { ErrorCode } from "src/enum/error";
import { Provider } from "src/enum/appEnums";
import { safeRequest } from "src/utils/safeRequest";
const BASE_URL = "https://<DC>.api.mailchimp.com/3.0"; 

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
    if(!apiKey || apiKey.trim() == "") {
        throw new CustomError("API key is required", ErrorCode.INVALID_TOKEN, 400);
    };

    const url = `${getBaseUrl(apiKey)}/ping`;
    const res = await httpClient.get(url, {
      auth: { username: "username", password: apiKey },
    });

    return { valid: res.status === 200, details: res.data };

  } catch (err: any) {
    if (err.response?.status === 401) {
      throw new CustomError("Invalid Mailchimp API key", ErrorCode.INVALID_TOKEN, 401);
    }
    throw new CustomError(err.message, ErrorCode.PROVIDER_UNAVAILABLE, 503);
  }
}

export async function fetchLists(apiKey: string, page = 1, perPage = 10): Promise<NormalizedList[]> {
  try {
    const url = `${getBaseUrl(apiKey)}/lists?offset=${(page - 1) * perPage}&count=${perPage}`;
      const res = await safeRequest(
      httpClient.get(url, {
        auth: { username: "username", password: apiKey },
      })
    );

    return res.data.lists.map((list: any) => ({
      provider: Provider.mailchimp,
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
