const Note = require("../models/Note");

function checkNoteOwnership(req, res, next) {
  const noteId = parseInt(req.params.id, 10);
  const note = Note.findById(noteId);

  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }

  if (note.user_id !== req.user.id) {
    return res
      .status(403)
      .json({ error: "You do not have permission to access this note" });
  }

  req.note = note;
  next();
}

module.exports = checkNoteOwnership;
