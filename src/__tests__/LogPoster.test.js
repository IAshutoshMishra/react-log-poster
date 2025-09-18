import React from "react";
import { render, waitFor } from "@testing-library/react";
import { LogPoster } from "../LogPoster";

jest.mock("../usePostLog", () => {
    const postLogMock = jest.fn();
    return {
        __esModule: true,
        usePostLog: () => ({
            postLog: postLogMock,
            status: "idle",
            error: null,
            reset: jest.fn()
        }),
        postLogMock // export for test access
    };
});

// Import the mock after jest.mock so it's initialized
import { postLogMock } from "../usePostLog";

beforeEach(() => {
    jest.clearAllMocks();
    postLogMock.mockResolvedValue({ ok: true, data: "posted" });
});

describe("LogPoster", () => {
    it("calls postLog and onComplete when autoPost and payload are provided", async () => {
        const onComplete = jest.fn();
        const payload = { foo: "bar" };

        render(
            <LogPoster
                env="test"
                payload={payload}
                autoPost={true}
                onComplete={onComplete}
                options={{}}
            />
        );

        await waitFor(() => {
            expect(postLogMock).toHaveBeenCalledWith(payload, {});
            expect(onComplete).toHaveBeenCalledWith({ ok: true, data: "posted" });
        });
    });

    it("does not call postLog or onComplete if autoPost is false", async () => {
        const onComplete = jest.fn();
        const payload = { foo: "bar" };

        render(
            <LogPoster
                env="test"
                payload={payload}
                autoPost={false}
                onComplete={onComplete}
                options={{}}
            />
        );

        await new Promise((r) => setTimeout(r, 50));
        expect(postLogMock).not.toHaveBeenCalled();
        expect(onComplete).not.toHaveBeenCalled();
    });

    it("does not call postLog or onComplete if payload is missing", async () => {
        const onComplete = jest.fn();

        render(
            <LogPoster
                env="test"
                autoPost={true}
                onComplete={onComplete}
                options={{}}
            />
        );

        await new Promise((r) => setTimeout(r, 50));
        expect(postLogMock).not.toHaveBeenCalled();
        expect(onComplete).not.toHaveBeenCalled();
    });

    it("does not throw if onComplete is not provided", async () => {
        const payload = { foo: "bar" };

        render(
            <LogPoster
                env="test"
                payload={payload}
                autoPost={true}
                options={{}}
            />
        );

        await waitFor(() => {
            expect(postLogMock).toHaveBeenCalledWith(payload, {});
        });
    });

    it("does not call onComplete if component unmounts before postLog resolves", async () => {
        const onComplete = jest.fn();
        const payload = { foo: "bar" };

        // Create a promise we control
        let resolvePostLog;
        postLogMock.mockImplementation(
            () => new Promise((resolve) => { resolvePostLog = resolve; })
        );

        const { unmount } = render(
            <LogPoster
                env="test"
                payload={payload}
                autoPost={true}
                onComplete={onComplete}
                options={{}}
            />
        );

        // Unmount before resolving postLog
        unmount();

        // Now resolve postLog
        resolvePostLog({ ok: true, data: "posted" });

        // Wait to ensure onComplete is not called
        await new Promise((r) => setTimeout(r, 50));
        expect(onComplete).not.toHaveBeenCalled();
    });
});