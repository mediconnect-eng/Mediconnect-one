import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const rawText = await res.text();
    let message = rawText || res.statusText;

    try {
      const parsed = rawText ? JSON.parse(rawText) : null;
      if (typeof parsed === "string") {
        message = parsed;
      } else if (parsed && typeof parsed === "object") {
        const record = parsed as Record<string, unknown>;
        const candidate = record.error ?? record.message;
        if (typeof candidate === "string") {
          message = candidate;
        } else if (candidate != null) {
          message = String(candidate);
        } else {
          message = rawText;
        }
      }
    } catch {
      // ignore JSON parse errors and fall back to raw text
    }

    throw new Error(`${res.status}: ${message}`.trim());
  }
}

export async function apiRequest<T = any>(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return await res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
