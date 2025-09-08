import { ComponentType } from "react";

export type RetryOptions = {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
  timeoutMs?: number;
  headers?: Record<string, string>;
  endpointPath?: string;
};

export type PostLogResult = {
  ok: boolean;
  attempts: number;
  error?: unknown;
};

export function usePostLog(env?: 'test' | 'demo' | 'prod'): {
  status: 'idle' | 'posting' | 'success' | 'error';
  error: unknown | null;
  postLog: (payload: any, options?: Partial<RetryOptions>) => Promise<PostLogResult>;
  reset: () => void;
};

export const LogPoster: ComponentType<{
  env?: 'test' | 'demo' | 'prod';
  payload: any;
  autoPost?: boolean;
  options?: Partial<RetryOptions>;
  onComplete?: (result: PostLogResult) => void;
}>;

export function getConfig(env?: 'test' | 'demo' | 'prod'): { BASE_URL: string; DEFAULT_PATH: string };
