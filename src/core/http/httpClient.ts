export interface RequestOptions extends RequestInit {
  retries?: number;
  backoff?: number;
  timeout?: number;
}

export class HttpClient {
  static async post<T>(
    url: string,
    body: any,
    options: RequestOptions = {},
  ): Promise<T> {
    const {
      retries = 3,
      backoff = 300,
      timeout = 5000,
      ...fetchOptions
    } = options;

    const attempt = async (retryCount: number): Promise<T> => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      try {
        console.log(`[HttpClient] POST request to ${url}`, { body });
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...fetchOptions.headers,
          },
          body: JSON.stringify(body),
          signal: controller.signal,
          ...fetchOptions,
        });
        clearTimeout(id);

        if (!response.ok) {
          console.error(
            `[HttpClient] Error response from ${url}: ${response.status} ${response.statusText}`,
          );

          // Retry on 5xx errors
          if (response.status >= 500 && retryCount > 0) {
            throw new Error(`Server error: ${response.status}`);
          }

          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`[HttpClient] Success response from ${url}`, { data });
        return data as T;
      } catch (error: any) {
        clearTimeout(id);

        console.error(`[HttpClient] Request failed: ${error.message}`);

        if (retryCount > 0) {
          const isRetryable =
            error.name === "AbortError" ||
            error.message.includes("Server error") ||
            error.message.includes("fetch") ||
            error.name === "TypeError"; // TypeError is thrown by fetch on network error

          if (isRetryable) {
            const delay =
              backoff * Math.pow(2, (options.retries || 3) - retryCount);
            console.warn(
              `[HttpClient] Retrying request to ${url} in ${delay}ms... (${retryCount} retries left)`,
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
            return attempt(retryCount - 1);
          }
        }

        if (error.name === "AbortError") {
          throw new Error(`Request timeout after ${timeout}ms`);
        }

        throw error;
      }
    };

    return attempt(retries);
  }
}
