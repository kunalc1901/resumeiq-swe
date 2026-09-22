# Resume IQ

A minimal, connected full-stack starter that mirrors the folder structure of the Resume IQ
SWE monorepo (`swe/API-Server` + `swe/Frontend`) with the business logic stripped out.

## Structure

```
resume-iq/
├── API-Server/            Express.js (Node) backend
│   ├── config/            env (convict), logger (winston), database (mongoose)
│   ├── env/               per-profile JSON config (dev.json, prod.json)
│   ├── routes/            central router
│   ├── utils/             error handler, response handler, JWT auth middleware
│   └── packages/          feature modules: user, health-check
└── Frontend/              Angular SPA
    ├── src/environments/  environment.ts / dev / prod (api_url points at API-Server)
    └── src/app/
        ├── core/          http interceptor, api service, auth service, user service
        ├── guards/        auth guard protecting routes
        ├── pages/         login, home, layouts
        └── error/         access-denied / not-found / server-error pages
```

## How they connect

- `Frontend/src/environments/environment*.ts` → `api_url: 'http://localhost:3000'`
- `core/interceptors/http-interceptor.service.ts` attaches `Authorization: Bearer <token>`
  to every outgoing request.
- `guards/auth-guard.ts` blocks unauthenticated access to protected routes.
- `core/services/auth.service.ts` stores the JWT returned by the API and handles logout.
- `API-Server/packages/user/user.routes.js` exposes `POST /user/login`, `POST /user/signup`
  and a protected `GET /user`.

## Run it

### API-Server (port 3000)

```bash
cd API-Server
cp .env.template .env          # optional; defaults are fine for local dev
npm install
npm run dev                    # or npm start
```

Health check: `GET http://localhost:3000/health`

Login: `POST http://localhost:3000/user/login` with `{ "email": "...", "password": "..." }`.

> Requires a local MongoDB (`mongodb://localhost:27017/resume-iq`). If no database is
> available the server still starts but the user endpoints will fail; start MongoDB
> and the `users` collection is created automatically.

### Frontend (port 4200)

```bash
cd Frontend
npm install
npm start                      # ng serve -> http://localhost:4200
```

Log in at `http://localhost:4200/login`, then you land on the guarded `/home` page.

## Auth flow

1. Frontend calls `POST /user/login`, the API validates credentials and returns a JWT.
2. `AuthService` stores the token in `localStorage`.
3. The HTTP interceptor adds it as a `Bearer` token on subsequent requests.
4. `AuthGuard` reads the token (and checks expiry via `jwt-decode`) before activating routes.