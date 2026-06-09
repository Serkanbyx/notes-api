function errorHandler(err, _req, res, _next) {
  console.error(`[Error] ${err.message}`);

  if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
    return res.status(409).json({ error: "Resource already exists" });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "Request body too large" });
  }

  const statusCode = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    error: statusCode >= 500 && isProduction
      ? "Internal server error"
      : err.message || "Internal server error",
  });
}

module.exports = errorHandler;
