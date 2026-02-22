# Notes API

A RESTful API for managing personal notes with JWT authentication, ownership-based authorization, full-text search, and tag filtering.

## Features

- **JWT Authentication** — Register, login, and token-based access control
- **CRUD Operations** — Create, read, update, and delete notes
- **Ownership Control** — Users can only access their own notes
- **Search** — Full-text search across note titles and content (`?search=`)
- **Tag Filtering** — Filter notes by tag (`?tag=`)
- **Pagination** — Paginated responses with `?page=` and `?limit=`
- **Swagger Documentation** — Interactive API docs at `/api-docs`
- **SQLite Database** — Lightweight, zero-config, file-based database

## Tech Stack

| Technology | Purpose |
|---|---|
| Express.js | Web framework |
| better-sqlite3 | SQLite database |
| jsonwebtoken | JWT authentication |
| bcryptjs | Password hashing |
| express-validator | Input validation |
| swagger-jsdoc + swagger-ui-express | API documentation |
| helmet | Security headers |
| cors | Cross-origin resource sharing |

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
git clone https://github.com/<your-username>/notes-api.git
cd notes-api
npm install
```

### Configuration

Copy the example environment file and adjust values:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `3000` |
| `JWT_SECRET` | Secret key for signing tokens | — |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `DB_PATH` | SQLite database file path | `./notes.db` |

### Running

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## API Endpoints

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and get token |
| `GET` | `/api/auth/profile` | Get current user profile |

### Notes (requires authentication)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/notes` | Create a new note |
| `GET` | `/api/notes` | Get all user's notes |
| `GET` | `/api/notes/tags` | Get all unique tags |
| `GET` | `/api/notes/:id` | Get a specific note |
| `PUT` | `/api/notes/:id` | Update a note |
| `DELETE` | `/api/notes/:id` | Delete a note |

### Query Parameters

| Parameter | Example | Description |
|---|---|---|
| `search` | `?search=meeting` | Search in title and content |
| `tag` | `?tag=work` | Filter by tag |
| `page` | `?page=2` | Page number (default: 1) |
| `limit` | `?limit=10` | Items per page (default: 20, max: 100) |

## Usage Example

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "email": "john@example.com", "password": "secret123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "secret123"}'

# Create a note (use token from login response)
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title": "My Note", "content": "Hello world!", "tags": ["personal"]}'

# Search notes
curl http://localhost:3000/api/notes?search=hello \
  -H "Authorization: Bearer <token>"

# Filter by tag
curl http://localhost:3000/api/notes?tag=personal \
  -H "Authorization: Bearer <token>"
```

## Swagger Documentation

Once the server is running, visit:

```
http://localhost:3000/api-docs
```

## Deployment (Render)

1. Push this repository to GitHub
2. Go to [render.com](https://render.com) and create a **New Web Service**
3. Connect your GitHub repository
4. Render will auto-detect settings from `render.yaml`
5. Add `JWT_SECRET` environment variable in Render dashboard

> **Note:** SQLite data on Render's free tier is ephemeral — it resets on each deploy. For persistent data in production, consider upgrading to a Render Disk or switching to PostgreSQL.

## Project Structure

```
├── src/
│   ├── app.js                 # Express app entry point
│   ├── config/
│   │   ├── database.js        # SQLite connection & schema
│   │   └── swagger.js         # Swagger configuration
│   ├── controllers/
│   │   ├── authController.js  # Auth business logic
│   │   └── noteController.js  # Note business logic
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── errorHandler.js    # Global error handler
│   │   ├── ownership.js       # Note ownership check
│   │   └── validate.js        # Request validation
│   ├── models/
│   │   ├── Note.js            # Note data access
│   │   └── User.js            # User data access
│   └── routes/
│       ├── auth.js            # Auth routes + Swagger
│       └── notes.js           # Note routes + Swagger
├── .env.example
├── .gitignore
├── package.json
├── render.yaml
└── README.md
```

## License

MIT
