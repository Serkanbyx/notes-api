const swaggerJsdoc = require("swagger-jsdoc");

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
  apis: ["./src/app.js", "./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
