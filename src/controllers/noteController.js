const Note = require("../models/Note");

const noteController = {
  create(req, res, next) {
    try {
      const { title, content, tags } = req.body;
      const note = Note.create(req.user.id, title, content, tags);

      res.status(201).json({
        message: "Note created successfully",
        note,
      });
    } catch (err) {
      next(err);
    }
  },

  getAll(req, res, next) {
    try {
      const { search, tag, page, limit } = req.query;
      const result = Note.findAllByUser(req.user.id, {
        search,
        tag,
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 20,
      });

      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  getById(req, res) {
    res.json({ note: req.note });
  },

  update(req, res, next) {
    try {
      const { title, content, tags } = req.body;
      const updatedNote = Note.update(req.note.id, { title, content, tags });

      res.json({
        message: "Note updated successfully",
        note: updatedNote,
      });
    } catch (err) {
      next(err);
    }
  },

  delete(req, res, next) {
    try {
      Note.delete(req.note.id);
      res.json({ message: "Note deleted successfully" });
    } catch (err) {
      next(err);
    }
  },

  getTags(req, res, next) {
    try {
      const tags = Note.getAllTagsByUser(req.user.id);
      res.json({ tags });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = noteController;
