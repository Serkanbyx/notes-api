const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const srcDir = path.resolve(__dirname, "..");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notes API",
      version: "1.0.0",
      description:
        "A RESTful API for managing personal notes with JWT authentication, ownership control, search and tag filtering.",
      contact: {
        name: "Serkanby",
        url: "https://serkanbayraktar.com/",
      },
    },
    servers: [
      {
        url: "http://localhost:{port}",
        description: "Development server",
        variables: {
          port: {
            default: "3000",
          },
        },
      },
    ],
    tags: [
      { name: "General", description: "General API endpoints" },
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Notes", description: "Note management endpoints" },
    ],
  },
  apis: [
    path.join(srcDir, "app.js"),
    path.join(srcDir, "routes", "*.js"),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
