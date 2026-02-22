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
app.use(helmet());
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
 *     summary: API durum kontrolü ve bilgileri
 *     description: API'nin çalışma durumunu, versiyon bilgisini ve geliştirici bilgilerini döndürür.
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API başarıyla çalışıyor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notes API is running
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 docs:
 *                   type: string
 *                   example: /api-docs
 *                 createdBy:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Serkanby
 *                     website:
 *                       type: string
 *                       example: https://serkanbayraktar.com/
 *                     github:
 *                       type: string
 *                       example: https://github.com/Serkanbyx
 */
app.get("/", (_req, res) => {
  res.json({
    message: "Notes API is running",
    version: "1.0.0",
    docs: "/api-docs",
    createdBy: {
      name: "Serkanby",
      website: "https://serkanbayraktar.com/",
      github: "https://github.com/Serkanbyx",
    },
  });
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
