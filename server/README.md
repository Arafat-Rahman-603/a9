# MediQueue Server

Backend REST API for the MediQueue Tutor Booking System.

## Stack

- **Runtime**: Node.js (ESM)
- **Framework**: Express 5
- **Database**: MongoDB (native driver)
- **Auth**: Better Auth (session-based, Google OAuth + email/password)

---

## Project Structure

```
mediqueue-server/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection singleton
│   ├── controllers/
│   │   ├── tutor.controller.js    # Tutor CRUD logic
│   │   └── booking.controller.js  # Booking logic
│   ├── lib/
│   │   └── auth.js                # Better Auth instance factory
│   ├── middlewares/
│   │   ├── verifySession.js       # Auth session guard
│   │   ├── errorHandler.js        # Global error handler
│   │   └── notFound.js            # 404 catcher
│   ├── routes/
│   │   ├── index.js               # Route registry
│   │   ├── tutor.routes.js        # /api/tutors routes
│   │   └── booking.routes.js      # /api/bookings routes
│   ├── utils/
│   │   ├── asyncHandler.js        # Wraps async controllers
│   │   ├── ApiError.js            # Custom error with statusCode
│   │   └── validateObjectId.js    # MongoDB ObjectId guard
│   ├── app.js                     # Express app factory
│   └── server.js                  # Entry point (DB → app → listen)
├── .env.example
└── package.json
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

| Variable               | Description                                   |
|------------------------|-----------------------------------------------|
| `PORT`                 | Server port (default: `5000`)                 |
| `MONGODB_URI`          | MongoDB connection string                     |
| `BETTER_AUTH_SECRET`   | Secret key for session signing                |
| `BETTER_AUTH_URL`      | Public URL of this server                     |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID                        |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret                    |
| `CLIENT_URL`           | Frontend origin allowed by CORS               |



## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your values

# 3. Start dev server (auto-restarts on file changes)
npm run dev

# 4. Or start production server
npm start
```

---

## API Reference

### Health Check

| Method | Route | Auth | Description   |
|--------|-------|------|---------------|
| GET    | `/`   | —    | Health check  |

### Auth (handled by Better Auth)

All routes under `/api/auth/*` are managed automatically:
- `POST /api/auth/sign-up/email`
- `POST /api/auth/sign-in/email`
- `GET  /api/auth/sign-in/google`
- `POST /api/auth/sign-out`
- `GET  /api/auth/session`

### Tutors

| Method | Route                  | Auth     | Description                              |
|--------|------------------------|----------|------------------------------------------|
| GET    | `/api/tutors`          | Public   | List all tutors (`search`, `startDate`, `endDate`, `limit` query params) |
| GET    | `/api/tutors/:id`      | Public   | Get a tutor by ID                        |
| GET    | `/api/tutors/my-tutors`| Required | Get tutors added by the current user     |
| POST   | `/api/tutors`          | Required | Add a new tutor                          |
| PUT    | `/api/tutors/:id`      | Required | Update a tutor                           |
| DELETE | `/api/tutors/:id`      | Required | Delete a tutor                           |

### Bookings

| Method | Route                 | Auth     | Description                                      |
|--------|-----------------------|----------|--------------------------------------------------|
| GET    | `/api/bookings`       | Required | Get the current user's bookings                  |
| POST   | `/api/bookings`       | Required | Book a session (slot check + duplicate check)    |
| PATCH  | `/api/bookings/:id`   | Required | Cancel a booking (slot is automatically restored)|

---

## Error Handling

All errors follow a consistent JSON shape:

```json
{ "error": true, "message": "Human-readable description" }
```

| Status | When                                    |
|--------|-----------------------------------------|
| 400    | Validation error / bad input            |
| 401    | No active session                       |
| 403    | Trying to modify another user's data    |
| 404    | Resource not found / unknown route      |
| 409    | Duplicate booking conflict              |
| 500    | Unexpected server error                 |
