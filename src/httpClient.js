import axios from "axios";

export function createHttpClient({ timeoutMs = 6000, headers = {} } = {}) {
  return axios.create({
    timeout: timeoutMs,
    headers: {
      "Content-Type": "application/json",
      ...headers
    }
  });
}
