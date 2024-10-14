<h2 id="getting-started">Getting Started</h2>

#### Install dependencies

```bash
pnpm install
```

#### Add necessary environment variables in .env in packages/api

```bash
AUTH_SECRET=

AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```

To generate AUTH_SECRET on Unix systems you can use command below or check out [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32).

```bash
openssl rand -hex 32
```

To get the AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET go to [Google Developer Console](https://console.cloud.google.com/).
If you need help check [this](https://www.balbooa.com/help/gridbox-documentation/integrations/other/google-client-id) article.

Add authorized redirect URIs.

```bash
http://localhost:3000/api/auth/callback/google # server
http://localhost:5173/api/auth/callback/google # react
http://localhost:4200/api/auth/callback/google # angular
```

##### This is experimental and not production ready.
