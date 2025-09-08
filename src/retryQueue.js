import { createHttpClient } from "./httpClient.js";
import { getConfig } from "./config.js";

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function computeDelay(attempt, baseDelayMs, maxDelayMs, jitter) {
  const exp = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
  return jitter ? Math.floor(exp * (Math.random() * 0.4 + 0.8)) : exp;
}

const DEFAULT_OPTS = {
  maxRetries: 3,
  baseDelayMs: 500,
  maxDelayMs: 8000,
  jitter: true,
  timeoutMs: 6000
};

export async function postWithRetry(env = "prod", payload, options = {}) {
  const opts = { ...DEFAULT_OPTS, ...options };
  const { BASE_URL, DEFAULT_PATH } = getConfig(env);
  const url = `${BASE_URL}${opts.endpointPath || DEFAULT_PATH}`;
  const client = createHttpClient({ timeoutMs: opts.timeoutMs, headers: opts.headers });

  let attempts = 0;
  while (true) {
    attempts += 1;
    try {
      await client.post(url, payload);
      return { ok: true, attempts };
    } catch (error) {
      if (attempts > opts.maxRetries + 1) {
        return { ok: false, attempts, error };
      }
      const delay = computeDelay(attempts - 1, opts.baseDelayMs, opts.maxDelayMs, opts.jitter);
      await sleep(delay);
    }
  }
}
