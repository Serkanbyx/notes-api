function errorHandler(err, req, res, _next) {
  console.error(`[Error] ${err.message}`);

  if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
    return res.status(409).json({ error: "Resource already exists" });
  }

  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
}

module.exports = errorHandler;
