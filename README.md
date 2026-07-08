<div align="center">

# oauth2

[![Node.js](https://img.shields.io/badge/Node.js-ESM-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com)
[![OIDC](https://img.shields.io/badge/OIDC-oidc--provider-blueviolet?style=flat)](https://github.com/panva/node-oidc-provider)
[![MariaDB](https://img.shields.io/badge/MariaDB-Sequelize-003545?style=flat&logo=mariadb&logoColor=white)](https://mariadb.org)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

**Multi-tenant OAuth2/OIDC authorization server — issues JWT access tokens, supports Authorization Code + PKCE, per-company client registration, and role-based access control for users and companies.**

</div>

---

## What it does

Companies register independently and manage their own users and OAuth2 clients. When a user authenticates, the server issues a JWT access token scoped to that client. Downstream services verify tokens via the introspection endpoint or by validating the JWT signature directly.

Built on [`oidc-provider`](https://github.com/panva/node-oidc-provider) — the same library used in production identity systems — with a Sequelize adapter for persistent storage in MariaDB/MySQL.

## Auth flow

```
Client (web app / API consumer)
  │
  ├─ GET /oauth2/authorize?response_type=code&client_id=...&code_challenge=...&code_challenge_method=S256
  │    └─ User logs in → AuthorizationCode issued (TTL: 15 min, single-use)
  │
  ├─ POST /api/v1/oauth2/get_token  { code, code_verifier, client_id, client_secret }
  │    └─ PKCE verified → AccessToken (JWT) + RefreshToken issued
  │
  └─ GET /api/v1/oauth2/verify_token   Authorization: Bearer <token>
       └─ Token validated, blacklist checked → { active: true }
```

## Architecture

```
oauth2/
├── oidc-server.js              # Entry point — Express + oidc-provider bootstrap, rate limiting
│
├── config/
│   ├── oidc_config.js          # OIDC provider: clients from DB, PKCE required, JWT format
│   ├── generate_pem_keys.js    # RS256 key-pair generation for token signing
│   └── test_config.js          # Test environment overrides
│
├── controllers/
│   ├── auth_controller.js      # Authorization Code flow, token introspection
│   ├── interaction_controller.js  # OIDC interaction (login / consent UI)
│   ├── user_controller.js      # User registration, login, profile
│   ├── company/
│   │   └── company_controller.js  # Company registration, status management
│   ├── client_controller.js    # OAuth2 client CRUD (per-company)
│   ├── token/
│   │   └── token_controller.js # Token issuance (session-based flow)
│   └── api/
│       ├── token_controller.js # REST token endpoint (company + client flows)
│       └── client_controller.js
│
├── middlewares/
│   ├── auth_middleware.js      # Session auth, Bearer JWT auth, RBAC guards
│   ├── company_middleware.js   # Company ownership verification
│   ├── user_middleware.js      # User lookup + attachment to req
│   ├── validation_middleware.js # Request schema validation
│   └── logger.js               # Request logging
│
├── models/                     # Sequelize models (MariaDB / MySQL)
│   ├── User.js                 # UUID PK, bcrypt password hooks, per-user secret key
│   ├── Company.js              # Multi-tenant root, paranoid soft-delete, status enum
│   ├── Client.js               # OAuth2 client: client_id, client_secret, scopes, redirect_uri
│   ├── AccessToken.js          # Issued access tokens
│   ├── RefreshToken.js         # Refresh tokens
│   ├── AuthorizationCode.js    # Short-lived auth codes (TTL: 15 min, single-use)
│   ├── BlacklistToken.js       # Revoked token registry
│   ├── Group.js / UserGroup.js # RBAC group assignments
│   ├── GrantType.js / ClientGrantType.js  # Supported grant types per client
│   └── Sequelize_adapter.js    # oidc-provider persistence adapter
│
├── services/
│   ├── auth_service.js         # Authorization Code creation, token introspection
│   ├── user_service.js         # User CRUD, password change, email
│   ├── company_service.js      # Company lifecycle, owner verification
│   ├── client_service.js       # Client registration + secret rotation
│   └── token/
│       └── token_service.js    # JWT sign / verify / exchange
│
├── routes/
│   ├── api/
│   │   ├── oauth2_router.js    # POST /get_token, GET /verify_token
│   │   ├── company_router.js   # Company API
│   │   └── client_router.js    # Client API
│   └── auth_routes.js          # Web UI: login, consent, interaction
│
└── views/                      # EJS templates (login, consent, introspect, register)
```

## Tech stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (ESM modules) |
| Framework | Express 4.18 |
| OIDC / OAuth2 | oidc-provider 8.4 |
| ORM | Sequelize 6 + MariaDB / MySQL |
| Auth tokens | jsonwebtoken (RS256 / HS256) |
| Password hashing | bcryptjs (salt rounds: 10) |
| Rate limiting | express-rate-limit (100 req / 15 min) |
| Sessions | express-session |
| Email | nodemailer |
| Config | dotenv |

## Multi-tenant model

Each company registers independently and receives its own namespace:

```
Company
  └── User(s)          — employees / end users
  └── Client(s)        — OAuth2 applications registered by this company
        └── GrantType(s) — allowed flows per client
        └── Scopes       — allowed scopes per client
```

A user's `roles` and `permissions` are stored as JSON on the `User` model. The `authorize_roles` and `authorize_permissions` middleware functions enforce access at the route level:

```js
router.delete('/resource',
  auth_middleware.authenticate_user_with_token,
  auth_middleware.authorize_roles(['admin', 'manager']),
  controller.delete
);
```

## Key engineering decisions

**PKCE enforced on Authorization Code flow** — `code_challenge` and `code_challenge_method` are required parameters. The authorization service rejects requests without them, preventing authorization code interception attacks.

**Per-user and per-company secret keys** — each `User` and `Company` row gets a `crypto.randomBytes(16)` secret key at creation time. Company-scoped tokens are signed with the company secret rather than a global JWT secret, isolating tenant token namespaces.

**Token blacklist** — the `BlacklistToken` model stores revoked tokens. The `verify_token` endpoint checks the blacklist before returning `{ active: true }`.

**Soft-delete on Company** — `paranoid: true` on the Sequelize model keeps deleted companies in the database with a `deletedAt` timestamp. Audit trail is preserved; cascaded hard-deletes are avoided.

**Password hashing in model hooks** — `beforeCreate` and `beforeUpdate` hooks on `User` and `Company` hash the password automatically. No controller or service needs to call `bcrypt` explicitly.

## Quick start

```bash
git clone https://github.com/bumbaRasch/oauth2
cd oauth2

cp .env.example .env
# Required: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
#           JWT_SECRET, SESSION_SECRET, COOKIE_KEY1, COOKIE_KEY2

# Generate RS256 key pair for token signing
node config/generate_pem_keys.js

# Initialize database schema
node init_database.js

npm install
npm start
```

## Environment

```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=oauth2_db
DB_USER=oauth2_user
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
COOKIE_KEY1=random_32_char_string
COOKIE_KEY2=random_32_char_string

# Email (nodemailer)
SMTP_HOST=smtp.example.com
SMTP_USER=noreply@example.com
SMTP_PASS=your_smtp_password
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/oauth2/authorize` | Start Authorization Code + PKCE flow |
| `POST` | `/api/v1/oauth2/get_token` | Exchange auth code for access + refresh token |
| `POST` | `/api/v1/oauth2/companies/token` | Company-scoped token issuance |
| `POST` | `/api/v1/oauth2/clients/token` | Client credentials token issuance |
| `GET` | `/api/v1/oauth2/verify_token` | Token introspection (blacklist check) |
| `POST` | `/companies/register` | Company registration |
| `POST` | `/users/register` | User registration within a company |
| `POST` | `/clients/register` | OAuth2 client registration |
