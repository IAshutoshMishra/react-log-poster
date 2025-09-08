const ENVIRONMENTS = {
  test: { BASE_URL: "https://api.test.example.com", DEFAULT_PATH: "/logs" },
  demo: { BASE_URL: "https://api.demo.example.com", DEFAULT_PATH: "/logs" },
  prod: { BASE_URL: "https://api.example.com", DEFAULT_PATH: "/logs" }
};

export function getConfig(env = "prod") {
  return ENVIRONMENTS[env] || ENVIRONMENTS.prod;
}
