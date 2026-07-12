# TransitOps Dashboard

A React + Vite project containing the TransitOps fleet dashboard (login, sign up, and the full dashboard).

## How to run this in VS Code

A `.jsx` file by itself is not runnable — it needs a project with React installed and a dev server (like Vite) to bundle and serve it in a browser. This folder is that project, already set up.

1. Open this folder (`transitops-app`) in VS Code.
2. Open a terminal in VS Code (`` Ctrl+` `` / `` Cmd+` ``).
3. Install dependencies:
   ```
   npm install
   ```
4. Start the dev server:
   ```
   npm run dev
   ```
5. Open the URL it prints (usually `http://localhost:5173`) in your browser.

## Project structure

```
transitops-app/
├── index.html          # HTML entry point
├── package.json        # dependencies + scripts
├── vite.config.js       # Vite + React plugin config
└── src/
    ├── main.jsx          # mounts the app into #root
    └── Dashboard.jsx      # the TransitOps app (login, sign up, dashboard)
```

## Demo login

- Email: `demo@transitops.com`
- Password: `demo1234`

Or click "Create Account" on the sign-in page to register a new (in-memory) account.
