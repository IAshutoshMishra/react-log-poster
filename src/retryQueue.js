import { getConfig } from "./config.js";

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
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
  timeoutMs: 6000,
  headers: {}
};

export async function postWithRetry(env = "prod", payload, options = {}) {
  const opts = { ...DEFAULT_OPTS, ...options };
  const { BASE_URL, DEFAULT_PATH } = getConfig(env);
  const url = `${BASE_URL}${opts.endpointPath || DEFAULT_PATH}`;

  let attempts = 0;
  while (true) {
    attempts++;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), opts.timeoutMs);

      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...opts.headers },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeout);
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
