import { renderHook, act } from "@testing-library/react";
import { usePostLog } from "../usePostLog";

jest.mock("../retryQueue", () => ({
  postWithRetry: jest.fn()
}));
import { postWithRetry } from "../retryQueue";

describe("usePostLog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sets status to 'success' and error to null on successful post", async () => {
    postWithRetry.mockResolvedValueOnce({ ok: true });

    const { result } = renderHook(() => usePostLog("test"));

    await act(async () => {
      const res = await result.current.postLog({ foo: "bar" });
      expect(res.ok).toBe(true);
    });

    expect(result.current.status).toBe("success");
    expect(result.current.error).toBe(null);
  });

  it("sets status to 'error' and sets error on failed post", async () => {
    const error = new Error("fail");
    postWithRetry.mockResolvedValueOnce({ ok: false, error });

    const { result } = renderHook(() => usePostLog("test"));

    await act(async () => {
      const res = await result.current.postLog({ foo: "bar" });
      expect(res.ok).toBe(false);
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toBe(error);
  });

  it("reset sets status and error to initial values", async () => {
    postWithRetry.mockResolvedValueOnce({ ok: false, error: "fail" });

    const { result } = renderHook(() => usePostLog("test"));

    await act(async () => {
      await result.current.postLog({ foo: "bar" });
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.error).toBe(null);
  });

  it("uses default env = 'prod' if not provided", async () => {
  const resultValue = { ok: true };
  postWithRetry.mockResolvedValueOnce(resultValue);

  const { result } = renderHook(() => usePostLog()); 

  await act(async () => {
    const res = await result.current.postLog({ foo: "bar" });
    expect(res).toBe(resultValue);
  });

  expect(postWithRetry).toHaveBeenCalledWith("prod", { foo: "bar" }, undefined);
});
});