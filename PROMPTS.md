# Raw AI prompts and chat logs

TODO (human): paste the exported raw chat log or public share link here before submitting. This file does not contain the full assistant transcript.

## 2026-10-25: User-pasted implementation plan (verbatim)

Car Dealership Inventory System: Agent Implementation Plan
Prepared for an autonomous coding agent. This is the single source of truth for building the TDD Kata end to end: backend, frontend, tests, git history, and documentation.
0. How to use this document
• Read the whole document before writing any code. Re-read Sections 1 and 6 before starting every phase.
• The kata brief gives the requirements. This document turns them into concrete decisions. Where the brief is ambiguous, the decision written here wins. Do not ask the user about anything already decided here.
• If you are truly blocked (no git credentials, a tool will not install), stop, state the blocker clearly, and continue using the fallback given in this document.
1. Non-negotiable rules
1. Tests first. No production code is written until a failing test for it exists and has been committed.
2. Red, Green, Refactor, each as its own commit (Section 6). The commit history is graded, so it must read like a story.
3. Commit small and often. One behaviour per cycle. Expected total: 80 to 150 commits.
4. Never squash, amend, rebase, or force-push commits. Never delete and recreate the .git folder. A single giant final commit is a failure of the kata.
5. Every commit carries the AI co-author trailer (Section 6.3). You are the AI tool, so that means every commit you make.
6. Never commit secrets, .env files, node_modules, database files, coverage output, or build output. Create .gitignore before the first commit.
7. Before every Green and Refactor commit, run the full test suite of the package you changed. It must pass. A Red commit is the only commit allowed to leave tests failing, and only the newly added tests may fail.
8. No plagiarism. Do not copy code from other repositories. Install libraries only through package managers.
9. Be honest in documentation. Never invent test results, coverage numbers, screenshots, or prompts.
10. Respect the layering in Section 3. No business logic in routes or controllers, and no database calls outside repositories.
2. Locked technology decisions
Concern
Choice
Reason
Backend
Node 20+, TypeScript (strict mode), Express 4
Allowed by the brief, simple and widely known
Database
SQLite file on disk, accessed through Prisma ORM with migrations
A real on-disk database (in-memory is not allowed) with zero setup for reviewers
Validation
Zod
Typed schemas for request bodies and queries
Auth
bcryptjs (password hashing) and jsonwebtoken (JWT)
Standard token-based auth
Backend tests
Jest, ts-jest, Supertest
Unit and integration testing
Frontend
React 18, Vite, TypeScript, Tailwind CSS 3.4, React Router 6
The brief requires HTML5, CSS3, Tailwind, React
Frontend tests
Vitest, React Testing Library, user-event, MSW
Component tests with a mocked API
Quality
ESLint and Prettier in both packages
Clean code requirement
Repo layout
Monorepo with /backend and /frontend plus root docs
One public repository link
Pin dependency versions through the lockfile. Use the latest stable releases at build time.
3. Architecture
3.1 Pattern: layered architecture with dependency injection
HTTP request
  -> Route (URL and verb mapping only)
  -> Middleware (authenticate, requireRole, validate)
  -> Controller (parse request, call service, shape response)
  -> Service (all business rules)
  -> Repository interface (data access contract)
  -> Prisma implementation -> SQLite
Layer
Responsibility
Must not
Routes
Wire paths to controllers and middleware
Contain logic
Controllers
Translate HTTP to service calls and results to HTTP
Touch the database or hold business rules
Services
Business rules: hashing, token issuing, stock checks, role checks
Know about Express or Prisma
Repositories
The only code that talks to Prisma
Contain business rules
Middleware
Cross-cutting concerns: auth, roles, validation, errors
Call repositories directly
3.2 SOLID mapping (reference this in code comments and README)
• S: each class has one reason to change (AuthService, VehicleService, InventoryService, one repository per entity).
• O: new vehicle filters are added by extending the search criteria object, not by rewriting the service.
• L: any IVehicleRepository implementation (Prisma or in-memory fake for unit tests) is interchangeable.
• I: small interfaces (IUserRepository, IVehicleRepository), not one giant data interface.
• D: services depend on repository interfaces, injected through constructors. A composition root (src/container.ts) wires the real implementations.
3.3 Folder structure
car-dealership/
  README.md
  PROMPTS.md
  .gitignore
  docs/
    test-report.md
    screenshots/
  backend/
    package.json  tsconfig.json  jest.config.ts  .env.example
    prisma/
      schema.prisma  migrations/  seed.ts
    src/
      app.ts              (builds the Express app, no listen)
      server.ts           (calls listen)
      container.ts        (composition root)
      config/env.ts
      routes/             (auth.routes.ts, vehicle.routes.ts)
      controllers/
      services/
      repositories/       (interfaces plus prisma implementations)
      middleware/         (authenticate, requireRole, validate, errorHandler)
      schemas/            (Zod schemas)
      errors/AppError.ts  (AppError, NotFoundError, ConflictError, and so on)
      types/
    tests/
      unit/               (services with fake repositories)
      integration/        (Supertest against the real SQLite test DB)
      helpers/            (resetDb, createUser, tokenFor)
  frontend/
    package.json  vite.config.ts  tailwind.config.js  .env.example
    src/
      main.tsx  App.tsx
      api/                (client.ts, auth.api.ts, vehicles.api.ts)
      context/AuthContext.tsx
      hooks/              (useVehicles, useDebounce)
      components/         (VehicleCard, VehicleGrid, SearchFilters, VehicleFormModal, ConfirmDialog, Navbar, Toast, ProtectedRoute, AdminRoute)
      pages/              (LoginPage, RegisterPage, DashboardPage, AdminPage, NotFoundPage)
      types/
      tests/
3.4 Data model
User: id (uuid), email (unique, stored lowercase), name, passwordHash, role (USER or ADMIN, default USER), createdAt.
Vehicle: id (uuid), make, model, category, priceCents (integer), quantity (integer, 0 or more), createdAt, updatedAt.
Decisions:
• Money is stored as integer cents and exposed in the API as a decimal number named price. Convert in exactly one mapper function (toVehicleDto). This avoids floating point money bugs.
• category is a string validated by Zod against: SEDAN, SUV, HATCHBACK, COUPE, CONVERTIBLE, TRUCK, VAN, ELECTRIC. Store uppercase.
• Public registration always creates role USER. Admins are created only by the seed script, using ADMIN_EMAIL and ADMIN_PASSWORD from env. Never accept role from the register body.
3.5 Error handling and response format
• Throw typed AppError subclasses from services. One central errorHandler middleware converts them to JSON.
• Error body shape: { "error": { "code": "VALIDATION_ERROR", "message": "Human readable", "details": [ ... ] } }
• Status mapping: 400 validation, 401 missing or invalid token or bad credentials, 403 wrong role, 404 not found, 409 conflict (duplicate email, insufficient stock), 500 unexpected (never leak stack traces).
• Unknown routes return 404 in the same error shape.
4. API contract
All routes are prefixed with /api. JSON in, JSON out. Protected routes need the header Authorization: Bearer <token>.
Method and path
Access
Request
Success
Errors
POST /api/auth/register
Public
name, email, password (min 8 chars, at least one letter and one digit)
201 { token, user }
400, 409 duplicate email
POST /api/auth/login
Public
email, password
200 { token, user }
400, 401 (same message for unknown email or wrong password)
POST /api/vehicles
Any authenticated user
make, model, category, price (greater than 0, max 2 decimals), quantity (integer, 0 or more)
201 vehicle
400, 401
GET /api/vehicles
Authenticated
optional page (default 1), limit (default 12, max 100)
200 { data, page, limit, total }
401
GET /api/vehicles/search
Authenticated
optional make, model, category, minPrice, maxPrice, plus page and limit
200 same shape as list
400 (minPrice greater than maxPrice, bad category), 401
PUT /api/vehicles/:id
Any authenticated user
any subset of make, model, category, price, quantity (at least one field)
200 vehicle
400, 401, 404
DELETE /api/vehicles/:id
ADMIN only
none
204
401, 403, 404
POST /api/vehicles/:id/purchase
Authenticated
optional quantity (integer, 1 or more, default 1)
200 updated vehicle
400, 401, 404, 409 insufficient stock
POST /api/vehicles/:id/restock
ADMIN only
quantity (integer, 1 or more, required)
200 updated vehicle
400, 401, 403, 404
Decisions on ambiguous points:
• GET /api/vehicles returns all vehicles, including quantity 0, because the UI must show them with a disabled Purchase button. Each vehicle carries its quantity so the UI can tell.
• Register the route /search before /:id so Express does not treat the word search as an id.
• make and model filters are case-insensitive partial matches. category is an exact match (case-insensitive input). minPrice and maxPrice are inclusive.
• Purchase must be atomic: use a single conditional update (decrement only where quantity is at least the requested amount) so two simultaneous buyers can never push stock below zero. Add an integration test that fires concurrent purchases at a vehicle with quantity 1 and asserts exactly one succeeds.
• JWT payload: sub (user id) and role. Expiry 1 hour. Secret from JWT_SECRET. The token is verified on every protected request, and the user role comes from the verified token.
• Add GET /api/health returning 200 { status: ok } (public, useful for deployment checks).
• The vehicle JSON shape is: id, make, model, category, price, quantity, createdAt, updatedAt.
5. Frontend architecture
• State: AuthContext holds token and user, persisted in localStorage, with login, register, and logout. An API client wrapper attaches the Bearer token and, on a 401, clears auth and redirects to /login. Mention the localStorage trade-off (XSS exposure) in the README.
• Routing: /login, /register, / (Dashboard, protected), /admin (AdminRoute, ADMIN only), and a NotFound page.
• Dashboard: responsive grid of VehicleCards, a SearchFilters bar (make, model, category select, min and max price), debounced search (300 ms), pagination, loading skeletons, empty state, and error state with retry.
• VehicleCard: make and model, category badge, formatted price, stock indicator (In stock, Low stock at 3 or fewer, Out of stock), and a Purchase button disabled when quantity is 0 (and while a purchase is in flight). A successful purchase updates the card in place and shows a toast.
• Admin UI (visible only when user.role is ADMIN): add vehicle form, edit form (modal, prefilled), delete with a confirm dialog, and a restock control. Reuse one VehicleFormModal for add and edit.
• Design: mobile first, Tailwind only (no other CSS framework), consistent spacing and color tokens in tailwind.config.js, visible focus states, labelled inputs, aria attributes on dialogs and toasts, and a polished look (gradient hero or header, card hover elevation, smooth transitions). Respect prefers-reduced-motion.
• Frontend env: VITE_API_URL (default http://localhost:4000/api).
6. TDD workflow and Git protocol
6.1 The cycle (repeat for every single behaviour)
1. RED: write one small failing test (or a tight group for one behaviour). Run it and confirm it fails for the right reason (missing behaviour, not a typo). Commit.
2. GREEN: write the minimum production code to pass. Run the full package test suite. Commit.
3. REFACTOR: improve names, remove duplication, extract helpers, add comments, with all tests still green. Run the full suite. Commit. If nothing needs refactoring, skip the commit rather than making an empty one, but refactor at least once per phase.
6.2 Commit message format (Conventional Commits with a TDD tag)
<type>(<scope>): <imperative summary, 72 chars max>

<body: what changed and why, and the TDD stage>

Co-authored-by: <AI name> <email>
• Types: test (Red), feat or fix (Green), refactor, chore, docs, style, build.
• Start the body of Red commits with RED:, Green commits with GREEN:, and refactors with REFACTOR:.
• Scopes: auth, vehicles, search, inventory, db, config, ui, admin, docs, tooling.
Example of a correct sequence for registration:
1. test(auth): add failing tests for user registration
2. feat(auth): implement register endpoint to satisfy tests
3. refactor(auth): extract password hashing into PasswordHasher
6.3 The AI co-author trailer (mandatory on every commit)
The trailer must be the last lines of the message, separated from the body by a blank line. Use the real name of the AI tool you are, never a fake or generic one. For Claude the standard trailer is:
Co-authored-by: Claude <noreply@anthropic.com>
Create commits with a here-document so the format is exact:
git add -A
git commit -F- <<'EOF'
test(auth): add failing tests for user registration

RED: 4 tests fail because POST /api/auth/register does not exist yet.
Covers success, duplicate email, weak password, and missing fields.

Co-authored-by: Claude <noreply@anthropic.com>
EOF
Before committing, run git status and git diff --staged --stat to check that only intended files are staged. After committing, verify with git log -1 that the trailer is present.
6.4 Push strategy (the user chooses one mode, default is per-phase)
The graders read the history, so what matters is that many small commits exist and reach the remote. The user may either let you push as you go or push everything once at the end.
Mode
Behaviour
per-phase (default)
Commit locally after every Red, Green, and Refactor. Run git push origin main at the end of each phase in Section 7 (and also after any commit that took more than about 30 minutes to reach). Never force-push.
local-only
Commit exactly the same way, but never push. The user will run git push -u origin main once at the end. This is fine: one push still uploads all the individual commits.
Important: pushing once at the end is acceptable, but committing once at the end is not. Do not squash, and tell the user never to squash before pushing.
Setup: the user provides the remote URL. Run git init -b main, then git remote add origin <URL> (skip in local-only mode if no URL is given). If a push fails because of missing credentials or permissions, do not retry in a loop. Switch to local-only mode, report the exact error, and keep committing.
One branch (main) with linear history. Tag milestones at the end of phases: git tag phase-N-<name> (and push tags in per-phase mode).
7. Phased build plan
Each bullet under Tests is one or more Red-Green-Refactor cycles. Follow the order. Do not start a phase before the previous one is green and committed.
Phase 0: Repository and tooling
• git init -b main, create .gitignore (node_modules, .env, *.db, *.db-journal, dist, coverage, .DS_Store), root README stub, empty PROMPTS.md. Commit: chore: initialise repository.
• Scaffold /backend (TypeScript strict, Express, Prisma, Jest, ESLint, Prettier). Commit.
• Prove the toolchain with one trivial failing then passing test (health endpoint is ideal, see Phase 1).
Phase 1: Backend foundation
• Tests: GET /api/health returns 200. Unknown route returns 404 in the standard error shape. Error handler maps AppError to its status and hides internals for unexpected errors. Config loader throws if JWT_SECRET is missing.
• Build app.ts, server.ts, config/env.ts, AppError classes, errorHandler, and the Jest setup that runs migrations against a test SQLite file (DATABASE_URL=file:./test.db) with a resetDb helper between tests.
• Push (per-phase mode). Tag phase-1-foundation.
Phase 2: Authentication
• Prisma User model and migration (commit the migration).
• Unit tests (fake repository) then integration tests for: register success (201, no passwordHash in response, role USER), register ignores a role field in the body, duplicate email (409, case-insensitive), invalid email, weak password, missing fields (400), login success returns token, wrong password and unknown email both return 401 with identical messages, JWT contains sub and role and expires.
• Middleware tests: authenticate rejects missing, malformed, expired, and tampered tokens (401); requireRole allows ADMIN and rejects USER (403).
• Seed script creates the admin from env (test that it is idempotent).
• Push. Tag phase-2-auth.
Phase 3: Vehicle CRUD
• Prisma Vehicle model and migration.
• Tests: create (201, validation for each field, negative price, non-integer quantity, bad category, 401 without token); list (pagination, includes quantity 0, ordering by createdAt descending); update (partial update, empty body 400, unknown id 404, invalid id handling); delete (ADMIN 204, USER 403, unknown id 404, then GET shows it gone); price conversion round trip (19999.99 stored as 1999999 cents and returned as 19999.99).
• Push. Tag phase-3-vehicles.
Phase 4: Search
• Tests: filter by make (case-insensitive partial), model, category, price range inclusive, minPrice only, maxPrice only, combined filters, no matches returns an empty list, minPrice greater than maxPrice returns 400, invalid category returns 400, pagination on results, /search is not captured by /:id.
• Refactor: extract the filter into a typed VehicleSearchCriteria object and a builder in the repository.
• Push. Tag phase-4-search.
Phase 5: Inventory
• Tests: purchase decrements by 1, by N, exact remaining stock reaches 0, insufficient stock returns 409 and leaves quantity unchanged, quantity 0 returns 409, invalid quantity returns 400, unknown id returns 404, 401 without token, concurrent purchase race test; restock increments, ADMIN only (403 for USER), invalid quantity 400, unknown id 404.
• Implement with the atomic conditional update described in Section 4.
• Push. Tag phase-5-inventory.
Phase 6: Backend hardening
• Add helmet, CORS (origin from env), a rate limit on the auth routes, and request body size limit, each with a test where practical.
• Raise coverage to at least 90 percent for lines, statements, and functions (set coverageThreshold in jest.config.ts so the suite fails below it).
• Add OpenAPI-style API docs in README or docs/API.md (a table is enough).
• Push. Tag phase-6-backend-complete.
Phase 7: Frontend foundation
• Scaffold Vite, React, TypeScript, Tailwind, Vitest, RTL, MSW. Commit.
• Tests then code for: API client attaches the token, clears auth on 401. AuthContext restores a session from localStorage, login stores token, logout clears it. ProtectedRoute redirects anonymous users to /login. AdminRoute blocks non-admins.
• Push. Tag phase-7-frontend-foundation.
Phase 8: Auth screens
• Tests: login form validation, submit calls the API, error message on 401, redirect to dashboard on success; register form validation (password rules, confirm password), duplicate email error shown.
• Build polished, accessible forms.
• Push. Tag phase-8-auth-ui.
Phase 9: Dashboard, search, and filters
• Tests: renders vehicle cards from the API, loading skeleton, empty state, error state with retry, filters call the search endpoint with the right query string (debounced), clearing filters returns to the full list, pagination controls.
• Push. Tag phase-9-dashboard.
Phase 10: Purchase flow
• Tests: Purchase button is disabled when quantity is 0, is enabled otherwise, is disabled while pending, success updates the card quantity and shows a toast, a 409 shows an out-of-stock message and refreshes the card.
• Push. Tag phase-10-purchase.
Phase 11: Admin UI
• Tests: admin controls hidden for USER and visible for ADMIN, add form validates and submits, edit modal is prefilled, delete asks for confirmation and removes the card, restock updates quantity.
• Push. Tag phase-11-admin.
Phase 12: Design polish and responsiveness
• Refine layout, spacing, and states at 360, 768, and 1280 pixel widths. Add favicon and page title. Verify keyboard navigation. Frontend coverage target is at least 80 percent.
• Push. Tag phase-12-polish.
Phase 13: Documentation and evidence
• Generate the test report (Section 9 of the README guide, Part 2 of this document), capture screenshots, write README, complete PROMPTS.md and the My AI Usage section (Section 8 below).
• Push. Tag v1.0.0.
Phase 14 (optional): Deployment
• Frontend to Vercel or Netlify, backend to Render or Railway. SQLite on those hosts needs a persistent disk, otherwise data resets on redeploy. State this in the README. Add the live link only if it genuinely works.
8. AI documentation deliverables
PROMPTS.md (root)
• Must contain raw, unedited chat logs or public share links. No summaries written by an AI.
• You, the agent, must not fabricate or paraphrase transcripts. Append the user's actual prompts to you verbatim, with a date heading, as work proceeds.
• If you cannot access the full raw transcript of this session, leave a clearly marked section at the top of PROMPTS.md: TODO (human): paste the exported raw chat log or public share link here, and tell the user to do it before submitting.
README section: My AI Usage
• Write the factual parts yourself: which AI tool was used (name it accurately), and how it was used (scaffolding, test writing, implementation, refactoring, debugging, documentation), with real examples from this build.
• The reflection on how AI affected the workflow must be the user's own honest reflection, since they will be questioned on it in the interview. Draft a short factual starting point and mark it TODO (human): rewrite in your own words so the user can adjust it.
9. README template (the agent fills this in at the end)
The final root README.md must follow this structure. Replace every placeholder with real content. Do not leave angle-bracket placeholders behind, except the clearly marked human TODO items.
# Car Dealership Inventory System

<One paragraph: what the project is, who it is for, and the main features.>

**Live demo:** <URL or: not deployed>

## Screenshots
![Login](docs/screenshots/login.png)
![Dashboard](docs/screenshots/dashboard.png)
![Search and filters](docs/screenshots/search.png)
![Admin panel](docs/screenshots/admin.png)
![Mobile view](docs/screenshots/mobile.png)

## Tech stack
<Table copied from the Locked technology decisions, plus a one line reason for each.>

## Architecture
<Layered architecture diagram, the folder structure, and a short SOLID section.>

## Getting started

### Prerequisites
- Node.js 20 or newer, npm 10 or newer, Git

### 1. Clone
```bash
git clone <REPO_URL>
cd car-dealership
```

### 2. Backend (http://localhost:4000)
```bash
cd backend
cp .env.example .env        # then edit JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npx prisma migrate deploy   # creates the SQLite database file
npm run seed                # creates the admin user and sample vehicles
npm run dev
```

### 3. Frontend (http://localhost:5173)
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### 4. Try it
- Register a normal user on the register page, or log in as the admin with the credentials from your backend .env.

## Environment variables
<Table of every variable for backend and frontend, with description and example.>

## API reference
<Table of all endpoints from Section 4, with request and response examples for each.>

## Running the tests
```bash
cd backend  && npm test -- --coverage
cd frontend && npm test -- --coverage
```

## Test report
<Link to docs/test-report.md plus the pass counts and coverage percentages pasted from the real run.>

## Development process
- How Red-Green-Refactor was followed, with 3 or 4 real example commit hashes and messages from git log.
- Commit convention and co-author policy.

## My AI Usage
- **Tools used:** <accurate tool name and version or model if known>
- **How I used them:** <real, specific examples from this build>
- **Reflection:** TODO (human): rewrite in your own words how AI changed your workflow, what it did well, where you had to correct it, and what you would do differently.

Raw chat logs are in [PROMPTS.md](PROMPTS.md).

## Design decisions and trade-offs
<Integer cents for money, atomic purchase, localStorage for the token and its XSS trade-off, SQLite and its deployment limits, admin seeding instead of open admin registration.>

## Known limitations and future work
<Honest list.>
Test report generation
• Run both suites with coverage and save the real output to docs/test-report.md: date, command used, total tests passed and failed, and the coverage table for each package.
• Never edit numbers by hand. Paste the actual terminal output in a code block.
Screenshots
• If a headless browser (for example Playwright) is available, start both servers and capture login, dashboard, search results, admin panel, and a 390 pixel wide mobile view into docs/screenshots/.
• If screenshots cannot be captured, create no fake images. Leave a visible TODO (human): add screenshots line in the README and tell the user.
10. Final verification checklist (run before declaring done)
[ ] git log --oneline shows many small commits with a visible test, feat, refactor rhythm in every backend phase.
[ ] Every commit has the co-author trailer: git log --format=%B | grep -c Co-authored-by equals the commit count, or each commit checked individually.
[ ] No .env, database file, node_modules, or coverage folder is tracked: git ls-files confirms it.
[ ] A fresh clone works by following only the README (verify the install and run steps in a clean temporary folder).
[ ] Backend and frontend test suites pass, and coverage thresholds are met.
[ ] Every endpoint in Section 4 exists, with the stated access rules and status codes.
[ ] Purchase button is disabled at quantity 0. Admin UI is visible to ADMIN only. DELETE and restock return 403 for normal users.
[ ] README contains all required sections, including My AI Usage, the test report, and the setup guide.
[ ] PROMPTS.md exists at the repo root with raw logs or links, or a clearly marked human TODO.
[ ] Tags exist for every phase and v1.0.0.
[ ] Push status reported: in per-phase mode, git status shows up to date with origin/main. In local-only mode, the final message gives the user the exact commands to push.
11. Final message the agent sends to the user
Keep it short and factual:
1. What was built and which phases are complete.
2. Test results and coverage (real numbers).
3. Push status and the exact commands the user still has to run, if any (git remote add origin <URL>, git push -u origin main --tags).
4. The remaining human TODO items: reflection in My AI Usage, raw chat log in PROMPTS.md, any missing screenshots, and the deployed link if desired.
5. A reminder to never squash commits before pushing.
12. Copy-paste kickoff prompt for your agent
You are implementing the Car Dealership Inventory System kata. Read the attached document 'Agent Implementation Plan' completely and follow it exactly. PUSH_MODE=per-phase (change to local-only if you cannot push). Remote URL: <PASTE YOUR EMPTY REPO URL HERE>. Start with Phase 0. Work strictly test first, commit after every Red, Green and Refactor step with the co-author trailer, never squash or force-push, and report to me only at the end of each phase with a two line status. Do not stop between phases unless blocked.

## 2026-10-25: Antigravity Transition and Finalization Prompts (verbatim)

### User Prompt 1 (Audit and Verification Request)

```text
I am continuing an existing project that I started using OpenAI Codex. Codex usage limits have been reached, so I am switching to Antigravity.

**Your task is to continue the existing project, not rebuild it from scratch.**

## 1. Project overview

Project: Car Dealership Inventory System

Assignment: Incubyte TDD Kata — Car Dealership Inventory System.

The assignment PDF and an implementation plan should be available in or alongside the project. Locate and read both before making changes.

The project uses the following planned stack:
- Backend: Node.js, TypeScript and Express.
- Database: SQLite with Prisma.
- Authentication: JWT and bcryptjs.
- Frontend: React, TypeScript, Vite and Tailwind CSS.
- Backend testing: Jest and Supertest.
- Frontend testing: Vitest and React Testing Library.

Verify the actual dependencies and configuration rather than assuming the plan matches every detail of the implementation.

## 2. Progress reported by the previous AI agent

The previous agent reported the following:

- Registration, login and JWT authentication implemented.
- Role-based authorization and administrator seeding implemented.
- Vehicle creation, listing, searching, updating and administrator-only deletion implemented.
- Atomic purchasing and administrator restocking implemented.
- Backend test suite passed 28 tests.
- React frontend built successfully.
- Frontend test suite passed 11 tests.
- Backend browser integration tests passed, including CORS, security headers and authentication rate limiting.
- Reported backend coverage: 94.9% statements, 98.64% functions and 97.3% lines.
- Reported frontend coverage: 95.6% statements and lines, 83.6% functions and 81.54% branches.

These are historical progress claims, not independently verified facts. Inspect the repository and rerun the relevant commands before relying on them.

The last known outstanding issue was first-run SQLite setup and final verification. Browser access to the local application was also blocked, so screenshots and visual verification remained incomplete.

## 3. First task: audit the existing implementation

Before modifying any files:

1. Inspect the directory structure, package files, environment configuration, Git status and recent commit history.
2. Read the assignment PDF and implementation plan.
3. Identify the backend and frontend entry points.
4. Inspect the database schema, migrations and seed scripts.
5. Inspect the test suites and existing coverage configuration.
6. Check the frontend for unfinished authentication, dashboard, purchasing and administrator functionality.
7. Inspect README.md, docs/test-report.md and PROMPTS.md if present.
8. Identify uncommitted and untracked files. Preserve all existing work.
9. Run the existing tests and production builds where practical.
10. Record the actual state of the project, including failures and missing deliverables.

Do not overwrite files, discard changes, reset Git history, or recreate existing modules.

## 4. Follow the assignment strictly

The assignment requires test-driven development.

For new or modified behavior, follow Red-Green-Refactor:

- RED: Write a test first, run it, verify that it fails for the expected reason, and commit the failing test.
- GREEN: Implement the minimum code needed to pass the test, run the relevant tests, and commit the implementation.
- REFACTOR: Make meaningful improvements where appropriate, rerun the tests, and commit the refactor if a change was made.

Maintain small, meaningful commits and accurate AI co-author trailers using the correct identity for the tool actually contributing to each commit.

Do not rewrite the existing Git history or manufacture commits.

## 5. Prioritize the remaining work

After the audit, prioritize:

1. Fix any reproducible first-run database or migration problems.
2. Complete missing frontend functionality, if any.
3. Verify registration, login, protected routes and administrator permissions.
4. Verify vehicle CRUD, search, purchasing and restocking.
5. Verify that concurrent purchases cannot oversell inventory.
6. Run the full backend and frontend test suites.
7. Verify production builds and actual coverage reports.
8. Verify clean setup from the README instructions.
9. Complete the README, test report, screenshots and AI usage documentation.
10. Verify PROMPTS.md and the Git history against the assignment requirements.

The frontend should correctly handle loading, empty and error states, and purchasing should be disabled when stock is zero.

## 6. Important AI usage requirement

This assignment requires genuine AI conversation evidence.

Do not fabricate, reconstruct or invent historical prompts, responses, test results, commit hashes, screenshots or public share links.

Preserve any existing raw AI conversation evidence. If the required Codex transcript cannot be retrieved, identify that as a human task rather than pretending Antigravity can recreate it.

Document the actual AI tools used.

## 7. Working rules

- Inspect first; implement second.
- Reuse working code.
- Avoid unnecessary dependencies and architectural rewrites.
- Do not mark a feature complete merely because its files exist.
- Do not claim a test passed unless it was actually run.
- Review changes before committing.
- Ask before performing destructive operations or changing repository publication settings.
- Clearly distinguish verified results from assumptions.

## 8. Your first response

Do not begin implementing features immediately.

First return:

A. A concise summary of the actual repository structure.

B. A requirement-by-requirement status table with PASS, FAIL or NOT VERIFIED.

C. The test and build results you were able to reproduce.

D. The five highest-priority remaining tasks.

E. Any information or files that are missing.

F. A recommended next step that preserves the existing architecture and TDD history.

Wait for my review of this audit before performing a broad set of modifications.
```

### User Prompt 2 (Finalization and Submission Execution Request)

```text
Finish the existing Incubyte Car Dealership Inventory System assignment as quickly as possible. Focus exclusively on the remaining submission requirements.

## NON-NEGOTIABLE RULES
1. Do NOT alter, refactor, or rewrite existing application logic.
2. Do NOT rebuild the application or change its architecture.
3. Do NOT modify existing tests just to make them pass.
4. Preserve all existing files, working code, and Git history.
5. Do not fabricate screenshots, test results, AI conversations, share links, or commit history.
6. Avoid unnecessary questions. Inspect the repository and make safe, reasonable decisions independently.
7. Follow the assignment PDF's exact requirements whenever they differ from these instructions.

## EXECUTION PLAN

### Step 1: Quick audit
- Check `git status` and identify pending documentation changes.
- Read the assignment PDF and inspect the existing README, PROMPTS.md, API documentation, and test report.
- Identify only the remaining submission tasks.
- Do not spend time re-auditing or rebuilding features that are already implemented and verified.

### Step 2: Finish documentation
Complete these files as required by the assignment:
- `README.md`
- `PROMPTS.md`
- `docs/API.md`
- `docs/test-report.md`

Ensure the documentation is accurate and consistent with the actual codebase.

The README must explain prerequisites, installation, environment configuration, database setup, running the backend and frontend, running tests, and accessing the application.

The API documentation must reflect the actual implemented endpoints, request formats, responses, authentication requirements, and authorization rules.

The test report must contain real test results and actual coverage figures. Reuse recent trustworthy results where appropriate; rerun the relevant commands if results are missing or need verification.

PROMPTS.md must comply with the assignment's AI documentation requirements. Use genuine available evidence. If historical AI conversations or share links are missing, clearly identify the gap rather than inventing them.

### Step 3: Capture screenshots
- Start the backend and frontend using the existing project configuration.
- Open the application in a browser.
- Capture genuine screenshots of the implemented UI.
- Save them under `docs/screenshots/`.
- Capture the most useful views required by the assignment, prioritizing the inventory dashboard, authentication, purchasing, and administrator functionality where available.
- Reference the actual screenshot filenames from README.md.
- Do not claim functionality works unless it has been verified.
- If browser access fails, use the quickest safe alternative and report any remaining limitation.

### Step 4: Final verification
Run the existing backend tests, frontend tests, and production builds if practical.

Do not spend time optimizing already-high coverage. Fix only genuine submission-blocking issues that can be resolved without changing application logic.

Check that:
- Documentation paths and screenshot references are correct.
- The setup instructions are reproducible.
- No secrets or real credentials have been committed.
- All assignment deliverables are accounted for.

### Step 5: Git commit
- Review the final diff.
- Stage only the intended documentation and screenshot files.
- Create a meaningful Conventional Commit using the format required by the assignment.
- Include the correct Antigravity co-author trailer if required.
- Never rewrite existing history or amend existing commits.
- Do not commit unrelated application changes.

### Step 6: Report completion
Give me a concise final report containing:
1. Deliverables completed.
2. Screenshots captured and their paths.
3. Tests and builds actually run, with results.
4. The final commit hash and commit message.
5. Any remaining mandatory submission requirements or blockers.
```

