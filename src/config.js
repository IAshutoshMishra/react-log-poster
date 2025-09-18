const ENVIRONMENTS = {
  test: { BASE_URL: "https://jsonplaceholder.typicode.com/posts", DEFAULT_PATH: "/" },
  demo: { BASE_URL: "https://jsonplaceholder.typicode.com/posts", DEFAULT_PATH: "/" },
  prod: { BASE_URL: "https://jsonplaceholder.typicode.com/posts", DEFAULT_PATH: "/" }
};

export function getConfig(env = "prod") {
  return ENVIRONMENTS[env] || ENVIRONMENTS.prod;
}
