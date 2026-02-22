const { Router } = require("express");
const { body, query } = require("express-validator");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/auth");
const checkNoteOwnership = require("../middleware/ownership");
const noteController = require("../controllers/noteController");

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: My First Note
 *         content:
 *           type: string
 *           example: This is the content of my note.
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["personal", "todo"]
 *         created_at:
 *           type: string
 *           example: "2025-01-01 12:00:00"
 *         updated_at:
 *           type: string
 *           example: "2025-01-01 12:00:00"
 *     NoteInput:
 *       type: object
 *       required: [title, content]
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           example: My First Note
 *         content:
 *           type: string
 *           minLength: 1
 *           example: This is the content of my note.
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["personal", "todo"]
 */

/**
 * @swagger
 * /api/notes:
 *   post:
 *     tags: [Notes]
 *     summary: Create a new note
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NoteInput'
 *     responses:
 *       201:
 *         description: Note created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 note:
 *                   $ref: '#/components/schemas/Note'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  [
    body("title")
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Title is required (max 200 characters)"),
    body("content").trim().notEmpty().withMessage("Content is required"),
    body("tags")
      .optional()
      .isArray()
      .withMessage("Tags must be an array of strings"),
    validate,
  ],
  noteController.create
);

/**
 * @swagger
 * /api/notes:
 *   get:
 *     tags: [Notes]
 *     summary: Get all notes for current user
 *     description: Returns paginated notes with optional search and tag filtering
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and content
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter by tag
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Paginated list of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    validate,
  ],
  noteController.getAll
);

/**
 * @swagger
 * /api/notes/tags:
 *   get:
 *     tags: [Notes]
 *     summary: Get all unique tags for current user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of unique tags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["personal", "work", "todo"]
 *       401:
 *         description: Unauthorized
 */
router.get("/tags", noteController.getTags);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     tags: [Notes]
 *     summary: Get a specific note
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 note:
 *                   $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not the owner
 *       404:
 *         description: Note not found
 */
router.get("/:id", checkNoteOwnership, noteController.getById);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     tags: [Notes]
 *     summary: Update a note
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NoteInput'
 *     responses:
 *       200:
 *         description: Note updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 note:
 *                   $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not the owner
 *       404:
 *         description: Note not found
 */
router.put(
  "/:id",
  checkNoteOwnership,
  [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Title must be between 1 and 200 characters"),
    body("content")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Content cannot be empty"),
    body("tags")
      .optional()
      .isArray()
      .withMessage("Tags must be an array of strings"),
    validate,
  ],
  noteController.update
);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     tags: [Notes]
 *     summary: Delete a note
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not the owner
 *       404:
 *         description: Note not found
 */
router.delete("/:id", checkNoteOwnership, noteController.delete);

module.exports = router;
