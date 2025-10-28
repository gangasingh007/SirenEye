# SirenEye — Backend

Comprehensive README for the backend service of the SirenEye project.

## Project description

SirenEye is a lightweight emergency triage and reporting system that ingests short text reports (for example, social media posts or user-submitted text), classifies urgency, and returns prioritized feeds. The backend exposes authentication endpoints for user registration/login and endpoints to triage single text inputs and to build an aggregated "auto-triage" feed from news and mocked tweets. The system uses MongoDB for persistence and integrates with external services (news API and a small LLM-based ranking/triage service) to analyze and rank reports.

Primary responsibilities of the backend:
- Handle user registration and authentication (JWT-based).
- Accept text reports and analyze triage/urgency using an LLM service.
- Aggregate public news and mock tweet data to build an auto-triage feed.
- Store incoming texts and their derived urgency levels in MongoDB.

## Key features

- Email/password user registration with password hashing (bcrypt).
- JWT authentication middleware (`protect`) to secure routes.
- Single-text triage: analyze urgency for custom text input and store results.
- Auto-triage feed: fetch news articles and mocked tweets, then rank them using an LLM service.
- Simple, modular code structure with routes, models, services and middleware.

## Tech stack & main libraries

- Node.js (ES Modules)
- Express
- MongoDB via Mongoose
- bcrypt (password hashing)
- jsonwebtoken (JWT)
- axios (external HTTP requests)
- dotenv (environment config)
- zod (request validation types used in `types/`)

## Environment variables

The backend expects the following environment variables (see `.env` in the repo root):

- PORT — port to run the server (e.g., `8080`)
- MONGO_URI — MongoDB connection string (e.g., `mongodb://localhost:27017/SirenEye`)
- JWT_SECRET — secret used to sign JWT tokens
- NEWS_API_KEY — API key used to fetch news (gnews.io by default)
- GEMINI_API_KEY — optional (used by LLM service integrations)

## How to run locally (quick)

1. Install dependencies from the `backend` folder:

```powershell
# from backend folder
npm install
```

2. Ensure MongoDB is running locally (or update `MONGO_URI` to point to your DB).

3. Copy or create a `.env` file in `backend` (example keys shown above).

4. Start the backend:

```powershell
node index.js
```

You should see a log that MongoDB connected successfully and the server listening on the configured port.

## API Endpoints (Backend)

Base URL: `http://<host>:<port>` (default port configured via `PORT`, `.env` example uses `8080`)

- Authentication
  - POST /auth/register
    - Description: Register a new user (creates hashed password and returns a JWT token).
    - Auth: public
    - Request body (JSON):
      - firstName: string
      - lastName or lastname: string (both accepted; server normalizes to `lastName`)
      - email: string
      - password: string
    - Success response (201):
      - token: JWT token string
      - firstName: string
      - lastName: string
      - email: string
    - Error responses:
      - 400: validation error or user already exists
      - 500: internal server error

  - POST /auth/login
    - Description: Log in an existing user and receive a JWT token.
    - Auth: public
    - Request body (JSON):
      - email: string
      - password: string
    - Success response (200):
      - token: JWT token string
      - firstName: string
      - lastName : string  
      - email: string
    - Error responses:
      - 400: user not found or invalid password
      - 500: internal server error

- Triage & Feed
  - POST /triage
    - Description: Analyze a single text for urgency/triage. Stores the text & urgency in the DB.
    - Auth: protected (requires `Authorization: Bearer <token>` header)
    - Request body (JSON):
      - text: string
    - Prompt to the LLM - `
    You are an 'A.I.D.R.' (Automated Incident Data Responder) triage bot.
    Analyze the following user report and respond ONLY with a valid JSON object.
    Do not add any text before or after the JSON.

    Use these exact keys: "urgency_level", "incident_category", "location_extracted", "people_affected", "resources_needed", "summary".
    - urgency_level: (CRITICAL, HIGH, MEDIUM, LOW)
    - incident_category: (Fire, Flood, Medical, Trapped, Infrastructure, Other)
    - If info is missing, use "null".

    Report: "${text}"
  `
    - Success response (200): analysis JSON from the LLM triage service. The shape depends on the LLM service but typically includes an `urgency_level` field (used by the server when saving the record).
    - Error responses:
      - 400: missing `text`
      - 401: unauthorized (missing/invalid token)
      - 500: internal server error

  - GET /auto-triage
    - Description: Fetch news articles and mocked tweets, combine them, and return a ranked feed using the LLM ranking service.
    - Auth: protected (requires `Authorization: Bearer <token>` header)
    - Query params: none
    - Prompt to the LLM - You are an 'A.I.D.R.' (Automated Incident Data Responder) triage bot.
    I will provide a JSON array of unstructured text reports.

    Your tasks are:
    1. Analyze EACH string.
    2. Create a new JSON array of objects. Each object must have "text", "urgency_level", and "summary".
    3. For 'urgency_level', use: CRITICAL, HIGH, MEDIUM, LOW, or IGNORE.
    4. **CRITICAL TASK:** Sort this entire array. 'CRITICAL' items must be first, followed by 'HIGH', 'MEDIUM', 'LOW', and 'IGNORE' items last.
    5. Respond ONLY with the final, sorted JSON array. Do not add any text before or after it.

    Input: ${JSON.stringify(reportsArray)}
  `
    - Success response (200): JSON array of ranked items (depends on LLM ranking service)
    - Error responses:
      - 401: unauthorized (missing/invalid token)
      - 500: internal server error

Notes about authorization:
- Protected endpoints expect an `Authorization` header with a Bearer token: `Authorization: Bearer <JWT_TOKEN>`.
- Tokens are issued upon successful register/login and are signed with `JWT_SECRET`.

## Data models (high level)

- User (Mongoose model `User`)
  - firstName: string
  - lastName: string
  - email: string (consider adding `unique: true`)
  - password: string (hashed)

- Text (example model used in triage route)
  - text: string
  - urgencyLevel: string or numeric level returned from LLM

## Important files & directories

- `index.js` — main server entry (registers endpoints and starts server)
- `config/index.js` — MongoDB connection helper
- `middleware/index.js` — JWT `protect` middleware
- `models/` — Mongoose models (`user.js`, `text.js`)
- `routes/` — route modules (e.g., `report.js` contains triage & auto-triage logic)
- `services/llm-service.js` — LLM integration for triage and ranking
- `types/` — request validation helpers (Zod schemas)

## To improve / next steps

- Add proper validation and standardize request bodies (use Zod schemas for all routes).
- Add `unique: true` to the `email` field in the `User` schema and create an index to prevent duplicates.
- Implement robust login with `await` and correct password field lookups.
- Add unit/integration tests for auth and triage endpoints.
- Improve error handling and hide internal errors in production.
- Add API documentation (OpenAPI/Swagger) for easier frontend integration.


