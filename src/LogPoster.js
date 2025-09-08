import { useEffect } from "react";
import { usePostLog } from "./usePostLog.js";

export function LogPoster({ env = "prod", payload, autoPost = true, onComplete, options }) {
  const { postLog } = usePostLog(env);

  useEffect(() => {
    let active = true;
    async function run() {
      if (autoPost && payload) {
        const result = await postLog(payload, options);
        if (!active) return;
        if (onComplete) onComplete(result);
      }
    }
    run();
    return () => { active = false; };
  }, [JSON.stringify(payload), env]);

  return null;
}
