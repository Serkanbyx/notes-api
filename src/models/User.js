const { db } = require("../config/database");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

const User = {
  create(username, email, password) {
    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
    const stmt = db.prepare(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
    );
    const result = stmt.run(username, email, hashedPassword);
    return this.findById(result.lastInsertRowid);
  },

  findById(id) {
    return db
      .prepare("SELECT id, username, email, created_at FROM users WHERE id = ?")
      .get(id);
  },

  findByEmail(email) {
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  },

  findByUsername(username) {
    return db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  },

  comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  },
};

module.exports = User;
