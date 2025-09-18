import { getConfig } from "../config";

describe("getConfig", () => {
  it("returns prod config by default", () => {
    expect(getConfig()).toEqual({
      BASE_URL: "https://jsonplaceholder.typicode.com/posts",
      DEFAULT_PATH: "/"
    });
  });

  it("returns test config when env is 'test'", () => {
    expect(getConfig("test")).toEqual({
      BASE_URL: "https://jsonplaceholder.typicode.com/posts",
      DEFAULT_PATH: "/"
    });
  });

  it("returns prod config for unknown env", () => {
    expect(getConfig("unknown")).toEqual({
      BASE_URL: "https://jsonplaceholder.typicode.com/posts",
      DEFAULT_PATH: "/"
    });
  });
});