"use client";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import api, { BASE_URL } from "./script";

type MeResponse = Record<string, unknown>;

type ErrorWithResponse = {
  response?: {
    status?: number;
    data?: unknown;
  };
  message?: string;
};

const safeStringify = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }
  if (value === undefined) {
    return "";
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const describeError = (
  error: unknown
): { status: number | "unknown"; detail: string } => {
  if (error && typeof error === "object") {
    const err = error as ErrorWithResponse;
    const status = err.response?.status ?? "unknown";
    const detailSource = err.response?.data ?? err.message ?? error;

    return { status, detail: safeStringify(detailSource) };
  }

  return {
    status: "unknown",
    detail: safeStringify(error),
  };
};

export default function App() {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("password123");
  const [me, setMe] = useState<MeResponse | null>(null);
  const [status, setStatus] = useState("Ready");
  const [logs, setLogs] = useState<string[]>([]);

  const log = (msg: string) =>
    setLogs((previousLogs) => [`> ${msg}`, ...previousLogs]);

  // (اختياري) جلب CSRF عند التحميل الأول
  useEffect(() => {
    (async () => {
      try {
        setStatus("Fetching CSRF cookie…");
        await api.get("/sanctum/csrf-cookie");
        setStatus("CSRF cookie fetched");
        log(`GET ${BASE_URL}/sanctum/csrf-cookie ✅`);
      } catch (e) {
        setStatus("Failed to get CSRF");
        const { status: errorStatus, detail } = describeError(e);
        log(`CSRF error: ${errorStatus} ${detail}`);
      }
    })();
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setStatus("Logging in…");
      await api.post("/login", { email, password });
      setStatus("Logged in ✅");
      log(`POST ${BASE_URL}/login ✅`);
    } catch (e) {
      setStatus("Login failed");
      const { status: errorStatus, detail } = describeError(e);
      log(`Login error: ${errorStatus} ${detail}`);
    }
  };

  const handleMe = async () => {
    try {
      setStatus("Calling /api/me…");
      const { data } = await api.get<MeResponse>("/api/me");
      setMe(data);
      setStatus("Got /api/me ✅");
      log(`GET ${BASE_URL}/api/me ✅ => ${JSON.stringify(data)}`);
    } catch (e) {
      setStatus("Call /api/me failed");
      setMe(null);
      const { status: errorStatus, detail } = describeError(e);
      log(`Me error: ${errorStatus} ${detail}`);
    }
  };

  const handleLogout = async () => {
    try {
      setStatus("Logging out…");
      await api.post("/logout");
      setMe(null);
      setStatus("Logged out ✅");
      log(`POST ${BASE_URL}/logout ✅`);
    } catch (e) {
      setStatus("Logout failed");
      const { status: errorStatus, detail } = describeError(e);
      log(`Logout error: ${errorStatus} ${detail}`);
    }
  };

  const handleFullFlow = async () => {
    // فلو كامل: csrf -> login -> me
    try {
      setStatus("Flow: CSRF -> Login -> Me …");
      await api.get("/sanctum/csrf-cookie");
      await api.post("/login", { email, password });
      const { data } = await api.get<MeResponse>("/api/me");
      setMe(data);
      setStatus("Flow done ✅");
      log("Flow done ✅");
    } catch (e) {
      setStatus("Flow failed");
      const { status: errorStatus, detail } = describeError(e);
      log(`Flow error: ${errorStatus} ${detail}`);
    }
  };

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        maxWidth: 720,
        margin: "30px auto",
        padding: 16,
      }}
    >
      <h1>Sanctum Cookie Auth — React Demo</h1>
      <p>
        <strong>API:</strong> {BASE_URL}
      </p>

      <section
        style={{
          marginTop: 16,
          padding: 12,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <h3>Login</h3>
        <form onSubmit={handleLogin} style={{ display: "grid", gap: 8 }}>
          <label>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </label>
          <label>
            Password
            <input
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="submit">Login</button>
            <button type="button" onClick={handleMe}>
              /api/me
            </button>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
            <button type="button" onClick={handleFullFlow}>
              Run Full Flow
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  await api.get("/sanctum/csrf-cookie");
                  setStatus("CSRF refetched");
                  log("Refetched CSRF ✅");
                } catch (e) {
                  setStatus("CSRF failed");
                  const { status: errorStatus, detail } = describeError(e);
                  log(`CSRF error: ${errorStatus} ${detail}`);
                }
              }}
            >
              Refresh CSRF
            </button>
          </div>
        </form>
      </section>

      <section
        style={{
          marginTop: 16,
          padding: 12,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <h3>Status</h3>
        <div>{status}</div>
      </section>

      <section
        style={{
          marginTop: 16,
          padding: 12,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <h3>/api/me (protected)</h3>
        <pre style={{ background: "#f8f8f8", padding: 8, overflowX: "auto" }}>
          {me ? JSON.stringify(me, null, 2) : "No data"}
        </pre>
      </section>

      <section
        style={{
          marginTop: 16,
          padding: 12,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <h3>Logs</h3>
        <pre
          style={{
            background: "#0b1020",
            color: "#bde",
            padding: 8,
            minHeight: 120,
            overflowX: "auto",
          }}
        >
          {logs.join("\n")}
        </pre>
      </section>
    </div>
  );
}
