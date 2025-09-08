# 🚀 React Log Poster

[![npm version](https://img.shields.io/npm/v/react-log-poster)](https://www.npmjs.com/package/react-log-poster)  
[![License](https://img.shields.io/npm/l/react-log-poster)](https://opensource.org/licenses/MIT)

A lightweight, efficient React library to **POST logs** to a fixed API endpoint with built-in **in-memory retry** and environment configurations.

---

## ✅ Why Use React Log Poster?

- 🔧 Easy to integrate: Just use a hook or a component.
- ⚡ Reliable: Built-in in-memory retry with exponential backoff and jitter.
- 🌐 Supports environments: `test | demo | prod`.
- 🚀 Fire-and-forget friendly — ideal for performance-critical applications.

---

## 🎯 Use Cases

- Track user interactions (button clicks, page views).
- Send custom audit logs to your centralized logging API.
- Fire analytics events without blocking user experience.

---

## ⚡ Installation

```bash
npm install react-log-poster
````

Or use local path during development:

```bash
npm install ./path/to/react-log-poster
```

---

## 📚 Usage

### ✅ Using the Hook

```jsx
import React from "react";
import { usePostLog } from "react-log-poster";

function LogButton() {
  const { status, error, postLog, reset } = usePostLog("demo");

  const sendLog = async () => {
    await postLog({ event: "button_clicked", userId: 123 });
  };

  return (
    <div>
      <button onClick={sendLog}>Send Log</button>
      <p>Status: {status}</p>
      {error && <p style={{ color: "red" }}>Error: {String(error)}</p>}
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

---

### ✅ Using the Component

```jsx
import React from "react";
import { LogPoster } from "react-log-poster";

function AutoLogPage() {
  return (
    <div>
      <h1>Welcome</h1>
      <LogPoster
        env="demo"
        payload={{ event: "page_loaded", userId: 999 }}
        onComplete={({ ok, attempts, error }) => {
          console.log("Log result:", { ok, attempts, error });
        }}
      />
    </div>
  );
}
```

---

## ⚙️ Configuration

Edit `src/config.js` to customize your environment URLs:

```js
const ENVIRONMENTS = {
  test: { BASE_URL: "https://your-test-api.com", DEFAULT_PATH: "/logs" },
  demo: { BASE_URL: "https://your-demo-api.com", DEFAULT_PATH: "/logs" },
  prod: { BASE_URL: "https://your-prod-api.com", DEFAULT_PATH: "/logs" }
};
```

---

## 🔧 Retry Options

```ts
{
  maxRetries: 3,
  baseDelayMs: 500,
  maxDelayMs: 8000,
  jitter: true,
  timeoutMs: 6000,
  headers?: Record<string,string>,
  endpointPath?: string
}
```

---

## 📦 Build

```bash
npm install
npm run build
```

---

## ✅ License

MIT License

---

Made with ❤️ by Ashutosh
