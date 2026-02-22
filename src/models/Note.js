const { db } = require("../config/database");

const Note = {
  create(userId, title, content, tags = []) {
    const stmt = db.prepare(
      "INSERT INTO notes (user_id, title, content, tags) VALUES (?, ?, ?, ?)"
    );
    const result = stmt.run(userId, title, content, JSON.stringify(tags));
    return this.findById(result.lastInsertRowid);
  },

  findById(id) {
    const note = db.prepare("SELECT * FROM notes WHERE id = ?").get(id);
    if (note) note.tags = JSON.parse(note.tags);
    return note;
  },

  findAllByUser(userId, { search, tag, page = 1, limit = 20 } = {}) {
    let query = "SELECT * FROM notes WHERE user_id = ?";
    const params = [userId];

    if (search) {
      query += " AND (title LIKE ? OR content LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (tag) {
      query += " AND tags LIKE ?";
      params.push(`%"${tag}"%`);
    }

    const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as total");
    const { total } = db.prepare(countQuery).get(...params);

    const offset = (page - 1) * limit;
    query += " ORDER BY updated_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const notes = db.prepare(query).all(...params);
    notes.forEach((note) => (note.tags = JSON.parse(note.tags)));

    return {
      notes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  update(id, fields) {
    const allowedFields = ["title", "content", "tags"];
    const updates = [];
    const params = [];

    for (const [key, value] of Object.entries(fields)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = ?`);
        params.push(key === "tags" ? JSON.stringify(value) : value);
      }
    }

    if (updates.length === 0) return this.findById(id);

    updates.push("updated_at = CURRENT_TIMESTAMP");
    params.push(id);

    db.prepare(`UPDATE notes SET ${updates.join(", ")} WHERE id = ?`).run(
      ...params
    );
    return this.findById(id);
  },

  delete(id) {
    return db.prepare("DELETE FROM notes WHERE id = ?").run(id);
  },

  getAllTagsByUser(userId) {
    const notes = db
      .prepare("SELECT tags FROM notes WHERE user_id = ?")
      .all(userId);

    const tagSet = new Set();
    notes.forEach((note) => {
      JSON.parse(note.tags).forEach((tag) => tagSet.add(tag));
    });

    return [...tagSet].sort();
  },
};

module.exports = Note;
