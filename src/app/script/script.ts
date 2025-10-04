export const BASE_URL = "https://admin.lad.sa";

type HttpError = Error & {
  response: {
    status: number;
    data: unknown;
  };
};

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS", "TRACE"]);

const buildUrl = (path: string): string => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const trimmedBase = BASE_URL.replace(/\/$/, "");
  const trimmedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${trimmedBase}/${trimmedPath}`;
};

let cachedXsrfToken: string | undefined;

const readCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") {
    return undefined;
  }

  const pattern = new RegExp(`(?:^|;\\s*)${name}=([^;]+)`);
  const match = document.cookie.match(pattern);
  return match ? decodeURIComponent(match[1]) : undefined;
};

const getXsrfToken = (): string | undefined => {
  if (cachedXsrfToken) {
    return cachedXsrfToken;
  }

  const token = readCookie("XSRF-TOKEN");
  if (token) {
    cachedXsrfToken = token;
  }

  return token;
};

const fetchCsrfCookie = async (): Promise<void> => {
  // Use the correct CSRF endpoint URL directly
  const response = await fetch("https://admin.lad.sa/sanctum/csrf-cookie", {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json, text/plain, /",
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  if (!response.ok) {
    throw new Error(
      `CSRF cookie request failed with status ${response.status}`
    );
  }

  cachedXsrfToken = readCookie("XSRF-TOKEN");
};

const normaliseBody = (
  body: unknown
): {
  payload?: BodyInit;
  contentType?: string;
} => {
  if (body === undefined || body === null) {
    return {};
  }

  const isFormDataAvailable = typeof FormData !== "undefined";
  const isBlobAvailable = typeof Blob !== "undefined";

  if (
    typeof body === "string" ||
    (isFormDataAvailable && body instanceof FormData) ||
    body instanceof URLSearchParams ||
    (isBlobAvailable && body instanceof Blob)
  ) {
    return { payload: body };
  }

  return {
    payload: JSON.stringify(body),
    contentType: "application/json",
  };
};

const safeParse = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  if (contentType.startsWith("text/")) {
    return response.text();
  }

  return null;
};

const request = async <T>(
  path: string,
  options: RequestOptions
): Promise<{ data: T }> => {
  const { payload, contentType } = normaliseBody(options.body);
  const method = (options.method ?? "GET").toUpperCase();

  const execute = async (attempt: number): Promise<Response> => {
    const headers = new Headers(options.headers);
    headers.set("Accept", "application/json, text/plain, /");
    headers.set("X-Requested-With", "XMLHttpRequest");

    if (contentType && !headers.has("Content-Type")) {
      headers.set("Content-Type", contentType);
    }

    if (!SAFE_METHODS.has(method) && !getXsrfToken()) {
      await fetchCsrfCookie();
    }

    const xsrfToken = getXsrfToken();
    if (xsrfToken) {
      headers.set("X-XSRF-TOKEN", xsrfToken);
      headers.set("X-CSRF-TOKEN", xsrfToken);
    }

    const response = await fetch(buildUrl(path), {
      ...options,
      body: payload,
      credentials: "include",
      headers,
    });

    if (!cachedXsrfToken) {
      cachedXsrfToken = readCookie("XSRF-TOKEN");
    }

    if (response.status === 419 && attempt < 1) {
      cachedXsrfToken = undefined;
      await fetchCsrfCookie();
      return execute(attempt + 1);
    }

    return response;
  };

  const response = await execute(0);

  const data = await safeParse(response);

  if (!response.ok) {
    if (response.status === 419) {
      cachedXsrfToken = undefined;
    }

    const error = new Error(
      `Request failed with status ${response.status}`
    ) as HttpError;

    error.response = {
      status: response.status,
      data,
    };

    throw error;
  }

  return { data: data as T };
};

const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body }),
};

export default api;
