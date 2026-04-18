const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const { v4: uuidv4 } = require('uuid');
const {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articleController');

// ── Multer config ────────────────────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOADS_DIR),
  filename:    (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ── Admin auth middleware ────────────────────────────────────────────────────
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'dt-admin-secret-token-2026';
const requireAdmin = (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth === `Bearer ${ADMIN_TOKEN}`) return next();
  res.status(403).json({ message: 'Unauthorized' });
};

// ── Router ───────────────────────────────────────────────────────────────────
const router = express.Router();

// Public routes
router.get('/',    getArticles);
router.get('/:id', getArticleById);

// Admin-only routes
router.post('/',    requireAdmin, upload.single('image'), createArticle);
router.put('/:id',  requireAdmin, upload.single('image'), updateArticle);
router.delete('/:id', requireAdmin, deleteArticle);

module.exports = router;
