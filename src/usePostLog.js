import { useCallback, useState } from "react";
import { postWithRetry } from "./retryQueue.js";

export function usePostLog(env = "prod") {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const postLog = useCallback(async (payload, options) => {
    setStatus("posting");
    setError(null);
    const result = await postWithRetry(env, payload, options);
    if (result.ok) setStatus("success");
    else {
      setStatus("error");
      setError(result.error);
    }
    return result;
  }, [env]);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return { status, error, postLog, reset };
}
