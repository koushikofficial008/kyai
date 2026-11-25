# Kyai — Frontend

Kyai is a React + Vite chat interface for your self-hosted AI.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` to the deployed Kyai API URL. The browser never receives the model-provider API key.

## Build

```bash
npm run build
```

Deploy the generated `dist/` directory to Cloudflare Pages or Cloudflare Workers Static Assets.

## Backend

The frontend expects `POST /api/chat` with `{ "messages": [{ "role": "user", "content": "..." }] }` and a JSON response `{ "reply": "..." }`.
