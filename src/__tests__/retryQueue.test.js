import { postWithRetry } from "../retryQueue";

global.fetch = jest.fn();

jest.mock("../retryQueue", () => {
  const original = jest.requireActual("../retryQueue");
  return {
    ...original,
    sleep: () => Promise.resolve(),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("postWithRetry", () => {
  it("returns ok:true on first successful fetch", async () => {
    fetch.mockResolvedValueOnce({ ok: true });
    const result = await postWithRetry("test", { foo: "bar" });
    expect(result.ok).toBe(true);
    expect(result.attempts).toBe(1);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("retries on failure and eventually succeeds", async () => {
    fetch
      .mockRejectedValueOnce(new Error("fail 1"))
      .mockResolvedValueOnce({ ok: true });
    const result = await postWithRetry("test", { foo: "bar" }, { maxRetries: 2, baseDelayMs: 1 });
    expect(result.ok).toBe(true);
    expect(result.attempts).toBe(2);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("returns ok:false after exceeding maxRetries", async () => {
    fetch.mockRejectedValue(new Error("fail"));
    const result = await postWithRetry("test", { foo: "bar" }, { maxRetries: 1, baseDelayMs: 1 });
    expect(result.ok).toBe(false);
    expect(result.attempts).toBe(2);
    expect(result.error).toBeInstanceOf(Error);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("only tries once if maxRetries is 0", async () => {
    fetch.mockRejectedValue(new Error("fail"));
    const result = await postWithRetry("test", { foo: "bar" }, { maxRetries: 0, baseDelayMs: 1 });
    expect(result.ok).toBe(false);
    expect(result.attempts).toBe(1);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("merges custom headers and timeout", async () => {
    fetch.mockResolvedValueOnce({ ok: true });
    const customOptions = { headers: { Authorization: "Bearer token" }, timeoutMs: 1234 };
    await postWithRetry("test", { foo: "bar" }, customOptions);
    expect(fetch).toHaveBeenCalled();
  });

  it("handles fetch resolving to a non-ok HTTP response", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500, statusText: "Server Error" });
    const result = await postWithRetry("test", { foo: "bar" }, { maxRetries: 0, baseDelayMs: 1 });
    expect(result.ok).toBe(false);
    expect(result.error).toBeInstanceOf(Error);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("handles fetch throwing synchronously (e.g., abort)", async () => {
    fetch.mockImplementationOnce(() => { throw new Error("abort"); });
    const result = await postWithRetry("test", { foo: "bar" }, { maxRetries: 0, baseDelayMs: 1 });
    expect(result.ok).toBe(false);
    expect(result.error).toBeInstanceOf(Error);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("aborts the request if it exceeds timeoutMs", async () => {
  jest.useFakeTimers();
  fetch.mockImplementation(() =>
    new Promise((resolve, reject) => {
      setTimeout(() => reject(new DOMException("Aborted", "AbortError")), 0);
    })
  );

  const promise = postWithRetry("test", { foo: "bar" }, { maxRetries: 0, timeoutMs: 100 });
  jest.advanceTimersByTime(100);

  const result = await promise.catch(e => e); 
  expect(result.ok).toBe(false);
  expect(result.error).toBeInstanceOf(Error);

  jest.useRealTimers();
});
});