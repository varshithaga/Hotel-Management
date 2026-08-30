# Grandeur Hotel — Hotel Management System

A full-stack hotel management application:

- **Public guest website** — browse rooms, check live availability, and request bookings.
- **Admin dashboard** — manage rooms, reservations, bookings, payments, staff, work
  assignments, guest enquiries and users.
- **REST API** — FastAPI backend with JWT auth, backed by PostgreSQL.

---

## Walkthrough

An animated tour of the whole app — a 15-scene loop covering every public page
(Home, Rooms, Booking, Spa, Dining, Gallery, About, Contact) and the admin side
(sign-in, dashboard, and the Reservations / Bookings / Payments / Employees /
Work Assignments tables), using the same layout, navigation and seed data as the
running application.

![Grandeur Hotel walkthrough](docs/demo.svg)

_Animated SVG — plays automatically on GitHub; open [`docs/demo.svg`](docs/demo.svg)
directly if your viewer doesn't animate it. Regenerate with
`python docs/gen_demo.py` (stdlib only) after changing the seed data._

> Prefer a real screen recording? Start both servers (below), capture the browser
> with your OS recorder (Windows: **Win + Alt + R**), and drop the file in `docs/`,
> updating the link above.

---

## Tech stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 19, TypeScript, Vite, React Router 7 |
| Backend   | FastAPI, SQLAlchemy 2, PyJWT, Uvicorn |
| Database  | PostgreSQL |
| Auth      | JWT access / refresh tokens (PBKDF2-hashed passwords) |

---

## Repository layout

```
Hotel-Management/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app, CORS, router wiring, startup admin seed
│   │   ├── config.py          # env-driven settings (JWT, default admin)
│   │   ├── database.py        # SQLAlchemy engine / session (PostgreSQL)
│   │   ├── models.py          # ORM models (all tables)
│   │   ├── schemas/           # Pydantic request/response schemas
│   │   ├── crud/              # DB query helpers (list queries sort by id ASC)
│   │   ├── routers/           # API endpoints, grouped by domain
│   │   ├── auth.py            # token creation / verification, get_current_user
│   │   ├── security.py        # password hashing
│   │   └── seed.py            # sample-data loader
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/             # public site routes (Home, Rooms, Spa, Dining, …)
    │   ├── Allpages/          # admin dashboard (AdminLayout + one folder per table)
    │   ├── components/        # shared UI (Navbar, Footer, DatePicker, DateTimePicker, …)
    │   ├── access/access.ts   # auth + fetch helpers (login, register, token refresh)
    │   ├── data/              # static content for the public site
    │   └── styles/            # global CSS
    ├── package.json
    └── .env.example
```

---

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **PostgreSQL** 13+ running locally (or a reachable instance)

---

## Backend setup

```bash
cd backend

# 1. Create & activate a virtual environment
python -m venv env
env\Scripts\activate           # Windows
# source env/bin/activate      # macOS / Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure the database
copy .env.example .env         # Windows  (cp on macOS/Linux)
#   then edit .env with your PostgreSQL credentials
```

### `backend/.env`

```ini
# Option A — full URL (takes precedence if set)
# DATABASE_URL=postgresql://user:pass@localhost:5432/hotel_db

# Option B — individual settings
POSTGRES_DB=hotel_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=1234
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

Optional overrides (sensible defaults exist in `config.py`):

```ini
SECRET_KEY=change-me
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123
DEFAULT_ADMIN_EMAIL=admin@hotel.local
```

### Run

```bash
uvicorn app.main:app --reload
```

- API: `http://localhost:8000`
- Interactive docs (Swagger): `http://localhost:8000/docs`

On first startup the tables are created automatically, and if no users exist a
default admin (`DEFAULT_ADMIN_*`) is inserted.

### Seed sample data (optional)

```bash
python -m app.seed            # insert sample data (refuses if rooms already exist)
python -m app.seed --reset    # DROP all tables, recreate, then insert
```

---

## Frontend setup

```bash
cd frontend

npm install

copy .env.example .env         # Windows  (cp on macOS/Linux)
```

### `frontend/.env`

```ini
VITE_API_URL=http://localhost:8000/
```

### Scripts

| Command           | Description |
|-------------------|-------------|
| `npm run dev`     | Start the Vite dev server (`http://localhost:5173`) |
| `npm run build`   | Type-check (`tsc -b`) and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint`    | Lint with oxlint |

---

## Authentication

- **Sign in** — `/admin/login` → `POST /api/token/` returns `access` + `refresh` tokens
  (stored in `localStorage`); the access token is auto-refreshed via
  `POST /api/token/refresh/`.
- **Sign up** — `/admin/signup` → `POST /api/register/`. Every registered account is
  created with the **`admin`** role and is signed in immediately.
- Admin routes are guarded client-side by `ProtectedRoute`; admin API routers require a
  valid bearer token (`get_current_user`).

---

## Routes

### Public site (`frontend`)

| Path        | Page |
|-------------|------|
| `/`         | Home |
| `/rooms`    | Rooms & Suites |
| `/about`    | About |
| `/gallery`  | Gallery |
| `/contact`  | Contact |
| `/booking`  | Booking / availability check |
| `/spa`      | Spa & Wellness |
| `/dining`   | Dining |

### Admin (`/admin/*`, protected)

Dashboard plus CRUD screens for: Floors, Room Types, Amenities, Rooms, Reservations,
Bookings, Payments, Reviews, Contact Forms, Feedbacks, Departments, Staff Roles,
Employees, Work Types, Work Assignments, Users.

### API (prefix `/api`)

| Group | Prefix | Auth |
|-------|--------|------|
| Auth | `/token`, `/token/refresh`, `/register`, `/me` | public / bearer |
| Public site | `/public/rooms`, `/public/room-types`, `/public/amenities`, `/public/availability` | public |
| Property | `/floors`, `/room-types`, `/amenities`, `/rooms`, `/room-images` | bearer |
| Guests | `/reservations`, `/bookings`, `/payments`, `/reviews` | bearer |
| Front desk | `/contacts`, `/feedbacks` | bearer |
| Staff | `/departments`, `/staff-roles`, `/employees`, `/work-types`, `/work-assignments`, `/work-assignment-logs` | bearer |
| Access | `/users` | bearer |

List endpoints are paginated (`?page=&limit=&search=`) and ordered by `id` ascending.

---

## Notes

- **Date inputs** — the public site uses a self-contained calendar component
  (`src/components/datepicker.tsx`, no external library); admin forms use
  `datetimepicker.tsx` for date + time.
- Tables are created on backend startup via `Base.metadata.create_all` — there is no
  migration tool wired up yet.
- CORS is currently open (`allow_origins=["*"]`) for local development.
