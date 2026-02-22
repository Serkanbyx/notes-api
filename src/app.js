require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const { initializeDatabase } = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes");

const app = express();
const PORT = process.env.PORT || 3000;

// Security & parsing
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "style-src": ["'self'", "'unsafe-inline'"],
      },
    },
  })
);
app.use(cors());
app.use(express.json());

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

/**
 * @openapi
 * /:
 *   get:
 *     summary: Welcome page
 *     description: Returns a themed HTML welcome page with API info and navigation links.
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Welcome HTML page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
app.get("/", (_req, res) => {
  const { version } = require("../package.json");

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Notes API</title>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Georgia, "Times New Roman", serif;
      background: #fdf6e3;
      color: #3b2f1e;
      position: relative;
      overflow: hidden;
    }

    body::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        repeating-linear-gradient(
          transparent,
          transparent 31px,
          #e8d5b7 31px,
          #e8d5b7 32px
        );
      background-position-y: 12px;
      opacity: 0.45;
      pointer-events: none;
    }

    body::after {
      content: "";
      position: absolute;
      left: 60px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #d4a5a5;
      opacity: 0.5;
      pointer-events: none;
    }

    .container {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 48px 36px;
      max-width: 520px;
      width: 90%;
      background: rgba(253, 246, 227, 0.85);
      border: 1px solid #d6c4a1;
      border-radius: 4px;
      box-shadow:
        0 2px 24px rgba(59, 47, 30, 0.08),
        inset 0 0 60px rgba(214, 196, 161, 0.25);
    }

    h1 {
      font-size: 2.4rem;
      font-weight: 700;
      letter-spacing: 1px;
      color: #5a3e28;
      text-shadow: 1px 1px 0 rgba(214, 196, 161, 0.6);
      margin-bottom: 6px;
      position: relative;
      display: inline-block;
    }

    h1::after {
      content: "";
      display: block;
      width: 60%;
      height: 2px;
      margin: 10px auto 0;
      background: linear-gradient(90deg, transparent, #b08968, transparent);
    }

    .version {
      font-size: 0.95rem;
      color: #8b7355;
      font-style: italic;
      margin-bottom: 32px;
    }

    .links {
      display: flex;
      flex-direction: column;
      gap: 14px;
      align-items: center;
      margin-bottom: 36px;
    }

    .links a {
      display: inline-block;
      width: 260px;
      padding: 12px 24px;
      text-decoration: none;
      font-family: Georgia, serif;
      font-size: 1rem;
      border-radius: 3px;
      transition: all 0.25s ease;
    }

    .btn-primary {
      background: #5a3e28;
      color: #fdf6e3;
      border: 1px solid #5a3e28;
    }

    .btn-primary:hover {
      background: #7a5a3e;
      border-color: #7a5a3e;
      box-shadow: 0 4px 16px rgba(90, 62, 40, 0.25);
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: transparent;
      color: #5a3e28;
      border: 1px solid #b08968;
    }

    .btn-secondary:hover {
      background: #b08968;
      color: #fdf6e3;
      box-shadow: 0 4px 16px rgba(176, 137, 104, 0.2);
      transform: translateY(-2px);
    }

    .sign {
      font-size: 0.85rem;
      color: #8b7355;
      margin-top: 8px;
    }

    .sign a {
      color: #7a5a3e;
      text-decoration: none;
      border-bottom: 1px dotted #b08968;
      transition: color 0.2s, border-color 0.2s;
    }

    .sign a:hover {
      color: #5a3e28;
      border-bottom-color: #5a3e28;
    }

    @media (max-width: 480px) {
      .container { padding: 32px 20px; }
      h1 { font-size: 1.8rem; }
      .links a { width: 100%; }
      body::after { left: 24px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Notes API</h1>
    <p class="version">v${version}</p>

    <div class="links">
      <a href="/api-docs" class="btn-primary">API Documentation</a>
      <a href="/api/auth/profile" class="btn-secondary">Auth Profile</a>
    </div>

    <footer class="sign">
      Created by
      <a href="https://serkanbayraktar.com/" target="_blank" rel="noopener noreferrer">Serkanby</a>
      |
      <a href="https://github.com/Serkanbyx" target="_blank" rel="noopener noreferrer">Github</a>
    </footer>
  </div>
</body>
</html>`);
});

// Global error handler
app.use(errorHandler);

// Initialize DB & start server
initializeDatabase();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});

module.exports = app;
