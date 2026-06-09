# 📝 Notes API

A modern, secure RESTful API for managing personal notes. Built with Express.js and SQLite, featuring JWT authentication, ownership-based authorization, full-text search, tag filtering, pagination, and interactive Swagger documentation.

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)

## Features

- **JWT Authentication** — Secure register, login, and token-based access control with configurable expiration
- **Full CRUD Operations** — Create, read, update, and delete notes with a clean RESTful interface
- **Ownership-Based Authorization** — Users can only access and manage their own notes
- **Full-Text Search** — Search across note titles and content with the `?search=` query parameter
- **Tag Filtering** — Organize and filter notes by tags using `?tag=`
- **Pagination** — Efficient paginated responses with `?page=` and `?limit=` parameters
- **Interactive API Docs** — Auto-generated Swagger/OpenAPI documentation at `/api-docs`
- **Security Hardened** — Helmet security headers, bcrypt password hashing, input validation, body size limiting
- **Graceful Shutdown** — Clean server and database shutdown on process signals
- **Production-Ready Error Handling** — Environment-aware error responses that hide internals in production
- **Lightweight Database** — SQLite via better-sqlite3 for zero-config, file-based storage

## Live Demo

[🚀 View Live API](https://notes-api-7mai.onrender.com/)

[📖 Swagger Documentation](https://notes-api-7mai.onrender.com/api-docs)

> **Note:** The API is hosted on Render's free tier. The first request may take a few seconds while the service spins up.

## Technologies

- **Express.js 5** — Modern, fast web framework for Node.js
- **better-sqlite3** — High-performance, synchronous SQLite3 driver
- **jsonwebtoken** — Industry-standard JWT authentication
- **bcryptjs** — Secure password hashing with salt rounds
- **express-validator** — Declarative request validation and sanitization
- **swagger-jsdoc + swagger-ui-express** — Auto-generated interactive API documentation
- **helmet** — Security middleware for HTTP headers
- **cors** — Cross-Origin Resource Sharing support
- **dotenv** — Environment variable management
- **nodemon** — Development auto-reload (dev dependency)

## Installation

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/Serkanbyx/notes-api.git
cd notes-api
```

2. Install dependencies:

```bash
npm install
```

3. Create your environment file:

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `3000` |
| `JWT_SECRET` | Secret key for signing tokens (required) | — |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `DB_PATH` | SQLite database file path | `./notes.db` |
| `NODE_ENV` | Environment mode | `development` |

> **Important:** The `JWT_SECRET` variable is required. The server will not start without it.

5. Start the server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

6. Open Swagger docs in your browser:

```
http://localhost:3000/api-docs
```

## Usage

1. **Register** a new account via `POST /api/auth/register`
2. **Login** with your credentials via `POST /api/auth/login` to receive a JWT token
3. **Include the token** in the `Authorization: Bearer <token>` header for all subsequent requests
4. **Create notes** with titles, content, and tags via `POST /api/notes`
5. **Browse your notes** with pagination via `GET /api/notes?page=1&limit=10`
6. **Search notes** by keyword via `GET /api/notes?search=meeting`
7. **Filter by tag** via `GET /api/notes?tag=work`
8. **Update or delete** notes via `PUT /api/notes/:id` and `DELETE /api/notes/:id`

## How It Works?

### Authentication Flow

The API uses JSON Web Tokens (JWT) for stateless authentication:

```
Register → Password hashed with bcrypt → User stored in SQLite
Login → Credentials verified → JWT token issued (configurable expiry)
Request → Token validated via middleware → User identity extracted → Access granted
```

### Ownership Control

Every note is linked to a user via `user_id`. A dedicated ownership middleware verifies that the authenticated user owns the requested note before allowing any read, update, or delete operation.

### Database Schema

```sql
-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Notes table with foreign key
CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### API Architecture

The project follows the **MVC + Layered Architecture** pattern:

- **Routes** — Define endpoints, validation rules, and Swagger docs
- **Controllers** — Handle business logic and request/response flow
- **Models** — Data access layer with SQL queries
- **Middleware** — Authentication, ownership checks, validation, and error handling

## API Endpoints

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT token |
| `GET` | `/api/auth/profile` | Get current user profile |

### Notes (requires authentication)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/notes` | Create a new note |
| `GET` | `/api/notes` | Get all user's notes (paginated) |
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

## Customization

### Add New Middleware

Create a new file in `src/middleware/` and integrate it into routes:

```javascript
const customMiddleware = (req, res, next) => {
  // Your custom logic here
  next();
};

module.exports = customMiddleware;
```

### Change Database

Replace `better-sqlite3` with your preferred database driver in `src/config/database.js` and update the model queries in `src/models/`.

### Extend Note Schema

Add new fields to the notes table in `src/config/database.js` and update the corresponding model methods in `src/models/Note.js`.

## Project Structure

```
├── src/
│   ├── app.js                 # Express app entry point
│   ├── config/
│   │   ├── database.js        # SQLite connection & schema
│   │   └── swagger.js         # Swagger/OpenAPI configuration
│   ├── controllers/
│   │   ├── authController.js  # Auth business logic
│   │   └── noteController.js  # Note CRUD business logic
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── errorHandler.js    # Global error handler
│   │   ├── ownership.js       # Note ownership verification
│   │   └── validate.js        # Request validation
│   ├── models/
│   │   ├── Note.js            # Note data access layer
│   │   └── User.js            # User data access layer
│   └── routes/
│       ├── auth.js            # Auth routes + Swagger docs
│       └── notes.js           # Note routes + Swagger docs
├── .env.example
├── .gitignore
├── package.json
├── render.yaml
└── README.md
```

## Deployment

### Render

1. Push this repository to GitHub
2. Go to [render.com](https://render.com) and create a **New Web Service**
3. Connect your GitHub repository
4. Render will auto-detect settings from `render.yaml`
5. Add `JWT_SECRET` environment variable in Render dashboard
6. Deploy and access your API

> **Note:** SQLite data on Render's free tier is ephemeral — it resets on each deploy. For persistent data in production, consider upgrading to a Render Disk or switching to PostgreSQL.

## Features in Detail

### Completed Features

✅ User registration and login with JWT
✅ Secure password hashing with bcrypt
✅ Full CRUD for notes
✅ Ownership-based access control
✅ Full-text search across titles and content
✅ Tag-based filtering
✅ Pagination with configurable limits
✅ Interactive Swagger documentation
✅ Security headers via Helmet
✅ Input validation and sanitization
✅ Global error handling
✅ Graceful shutdown with database cleanup
✅ Environment-aware error responses
✅ Request body size limiting
✅ Startup validation for required config
✅ Render deployment configuration

### Future Features

- [ ] 🔮 Rate limiting for API endpoints
- [ ] 🔮 Note sharing between users
- [ ] 🔮 Note categories and folders
- [ ] 🔮 File/image attachments
- [ ] 🔮 Export notes as PDF/Markdown
- [ ] 🔮 PostgreSQL support for production

## Contributing

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feat/amazing-feature`
3. **Commit** your changes: `git commit -m "feat: add amazing feature"`
4. **Push** to the branch: `git push origin feat/amazing-feature`
5. **Open** a Pull Request

### Commit Message Format

- `feat:` — New feature
- `fix:` — Bug fix
- `refactor:` — Code refactoring
- `docs:` — Documentation changes
- `chore:` — Maintenance tasks

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Developer

**Serkanby**

- Website: [serkanbayraktar.com](https://serkanbayraktar.com/)
- GitHub: [@Serkanbyx](https://github.com/Serkanbyx)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)

## Contact

- [Open an Issue](https://github.com/Serkanbyx/notes-api/issues)
- Email: [serkanbyx1@gmail.com](mailto:serkanbyx1@gmail.com)
- Website: [serkanbayraktar.com](https://serkanbayraktar.com/)

---

⭐ If you like this project, don't forget to give it a star!
