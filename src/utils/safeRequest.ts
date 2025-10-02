import { CustomError } from "../error/CustomError";
import { ErrorCode } from "../enum/error";

export async function safeRequest<T>(request: Promise<T>): Promise<T> {
  try {
    const res = await request;
    return res;
  } catch (err: any) {
    if (err.response?.status === 429) {
      const retryAfter = err.response.headers["x-ratelimit-reset"] || 60;
      throw new CustomError(
        `Rate limit exceeded. Retry after ${retryAfter} seconds`,
        ErrorCode.RATE_LIMIT,
        429
      );
    }
    throw err;
  }
}
