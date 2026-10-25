# Test report

Run on 2026-10-25 (Asia/Calcutta). Both commands exited with code 0. The output below is captured verbatim from the terminal.

## Backend

Command: `cd backend && npm test -- --coverage --coverageReporters=text`

```text

> car-dealership-backend@1.0.0 test
> node scripts/test.mjs --coverage --coverageReporters=text

Prisma schema loaded from prisma\schema.prisma
Datasource "db": SQLite database "test.db" at "file:./test.db"

2 migrations found in prisma/migrations


No pending migrations to apply.
PASS tests/integration/hardening.test.ts
PASS tests/integration/authRoutes.test.ts
PASS tests/unit/authService.test.ts
PASS tests/integration/vehicleList.test.ts
PASS tests/integration/purchase.test.ts
PASS tests/integration/restock.test.ts
PASS tests/integration/vehicleSearch.test.ts
PASS tests/integration/vehicleDelete.test.ts
PASS tests/integration/vehicleUpdate.test.ts
PASS tests/unit/seedAdmin.test.ts
PASS tests/integration/vehicleCreate.test.ts
PASS tests/integration/notFound.test.ts
PASS tests/integration/authorization.test.ts
PASS tests/integration/health.test.ts
PASS tests/integration/errorHandler.test.ts
PASS tests/integration/userRepository.test.ts
PASS tests/unit/env.test.ts
PASS tests/unit/errors.test.ts
-----------------------------|---------|----------|---------|---------|-------------------
File                         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------------------|---------|----------|---------|---------|-------------------
All files                    |    94.9 |    71.42 |   98.64 |   95.58 |                   
 prisma                      |   58.82 |     37.5 |      50 |   56.25 |                   
  seed.ts                    |   58.82 |     37.5 |      50 |   56.25 | 23-29             
 src                         |     100 |      100 |     100 |     100 |                   
  app.ts                     |     100 |      100 |     100 |     100 |                   
  container.ts               |     100 |      100 |     100 |     100 |                   
 src/config                  |   83.33 |    88.88 |     100 |     100 |                   
  env.ts                     |   83.33 |    88.88 |     100 |     100 | 12                
 src/controllers             |     100 |      100 |     100 |     100 |                   
  auth.controller.ts         |     100 |      100 |     100 |     100 |                   
  vehicle.controller.ts      |     100 |      100 |     100 |     100 |                   
 src/errors                  |     100 |        0 |     100 |     100 |                   
  AppError.ts                |     100 |        0 |     100 |     100 | 14-32             
 src/middleware              |   95.65 |     90.9 |     100 |   95.45 |                   
  authenticate.ts            |   92.85 |       90 |     100 |    92.3 | 16                
  errorHandler.ts            |     100 |      100 |     100 |     100 |                   
  requireRole.ts             |    87.5 |       75 |     100 |    87.5 | 8                 
  validate.ts                |     100 |      100 |     100 |     100 |                   
  validateQuery.ts           |     100 |      100 |     100 |     100 |                   
 src/repositories            |     100 |    56.25 |     100 |     100 |                   
  PrismaUserRepository.ts    |     100 |      100 |     100 |     100 |                   
  PrismaVehicleRepository.ts |     100 |       50 |     100 |     100 | 29-38             
 src/routes                  |     100 |      100 |     100 |     100 |                   
  auth.routes.ts             |     100 |      100 |     100 |     100 |                   
  vehicle.routes.ts          |     100 |      100 |     100 |     100 |                   
 src/schemas                 |     100 |       80 |     100 |     100 |                   
  auth.schemas.ts            |     100 |      100 |     100 |     100 |                   
  vehicle.schemas.ts         |     100 |       80 |     100 |     100 | 35                
 src/services                |   93.87 |       80 |     100 |   95.83 |                   
  AuthService.ts             |     100 |      100 |     100 |     100 |                   
  VehicleService.ts          |   90.32 |    71.42 |     100 |   93.33 | 78,87             
-----------------------------|---------|----------|---------|---------|-------------------

Test Suites: 18 passed, 18 total
Tests:       30 passed, 30 total
Snapshots:   0 total
Time:        3.494 s, estimated 6 s
Ran all test suites.
(node:11768) [DEP0190] DeprecationWarning: Passing args to a child process with shell option true can lead to security vulnerabilities, as the arguments are not escaped, only concatenated.
(Use `node --trace-deprecation ...` to show where the warning was created)
```

## Frontend

Command: `cd frontend && npm test -- --coverage`

```text

> car-dealership-frontend@1.0.0 test
> vitest run --coverage


 RUN  v2.1.9 D:/Incubyte_project/frontend
      Coverage enabled with v8

 ✓ src/tests/client.test.ts (1 test) 10ms
stderr | src/tests/routes.test.tsx > redirects anonymous visitors from protected pages
⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.

 ✓ src/tests/routes.test.tsx (2 tests) 50ms
stderr | src/tests/filters.test.tsx > searches after entering a make filter
⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.

 ✓ src/tests/authContext.test.tsx (1 test) 178ms
stderr | src/tests/dashboard.test.tsx > shows vehicle cards and disables purchase when stock is zero
⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.

stderr | src/tests/adminPage.test.tsx > opens an add form and submits a vehicle
⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.

stderr | src/tests/app.test.tsx > shows the login route
⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.

 ✓ src/tests/app.test.tsx (1 test) 259ms
stderr | src/tests/adminActions.test.tsx > prefills the edit modal and sends an update
⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.

stderr | src/tests/registerPage.test.tsx > shows a validation message when passwords do not match
⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.

stderr | src/tests/loginPage.test.tsx > submits credentials and navigates to the dashboard
⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.

stderr | src/tests/purchaseFlow.test.tsx > purchases a car and updates its stock in place
⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.

 ✓ src/tests/registerPage.test.tsx (1 test) 294ms
 ✓ src/tests/dashboard.test.tsx (1 test) 333ms
   ✓ shows vehicle cards and disables purchase when stock is zero 332ms
 ✓ src/tests/purchaseFlow.test.tsx (1 test) 442ms
   ✓ purchases a car and updates its stock in place 441ms
 ✓ src/tests/loginPage.test.tsx (1 test) 339ms
   ✓ submits credentials and navigates to the dashboard 337ms
 ✓ src/tests/adminPage.test.tsx (1 test) 424ms
   ✓ opens an add form and submits a vehicle 422ms
 ✓ src/tests/filters.test.tsx (1 test) 483ms
   ✓ searches after entering a make filter 481ms
 ✓ src/tests/adminActions.test.tsx (3 tests) 685ms
   ✓ prefills the edit modal and sends an update 437ms

 Test Files  11 passed (11)
      Tests  14 passed (14)
   Start at  19:00:40
   Duration  2.93s (transform 788ms, setup 3.67s, collect 1.60s, tests 3.50s, environment 12.11s, prepare 1.69s)

 % Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   92.32 |    81.54 |    83.6 |   92.32 |                   
 src               |     100 |      100 |     100 |     100 |                   
  App.tsx          |     100 |      100 |     100 |     100 |                   
 src/api           |     100 |    93.75 |     100 |     100 |                   
  client.ts        |     100 |    93.75 |     100 |     100 | 36                
 src/components    |   97.56 |    82.22 |   73.68 |   97.56 |                   
  AdminRoute.tsx   |     100 |    33.33 |     100 |     100 | 7-8               
  ...ctedRoute.tsx |     100 |       50 |     100 |     100 | 7                 
  ...chFilters.tsx |     100 |      100 |    37.5 |     100 |                   
  VehicleCard.tsx  |   97.87 |    81.81 |     100 |   97.87 | 17                
  ...FormModal.tsx |   95.77 |       88 |     100 |   95.77 | 60-62,144-146     
 src/context       |   93.61 |    89.47 |   83.33 |   93.61 |                   
  AuthContext.tsx  |   93.61 |    89.47 |   83.33 |   93.61 | 31-32,53          
 src/pages         |   88.22 |    77.01 |   85.71 |   88.22 |                   
  AdminPage.tsx    |   91.53 |    80.48 |   91.66 |   91.53 | ...,72-75,107-112 
  ...boardPage.tsx |   84.39 |    77.77 |      50 |   84.39 | ...95-100,152-163 
  LoginPage.tsx    |   91.78 |       75 |     100 |   91.78 | 20,59-64          
  RegisterPage.tsx |      86 |    63.63 |     100 |      86 | 17-20,23-32       
-------------------|---------|----------|---------|---------|-------------------
```
