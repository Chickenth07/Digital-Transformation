const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const { v4: uuidv4 } = require('uuid');
const {
  getBanners, getBannerById, createBanner, updateBanner, deleteBanner,
} = require('../controllers/bannerController');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOADS_DIR),
  filename:    (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'dt-admin-secret-token-2026';
const requireAdmin = (req, res, next) => {
  if (req.headers.authorization === `Bearer ${ADMIN_TOKEN}`) return next();
  res.status(403).json({ message: 'Unauthorized' });
};

const router = express.Router();

router.get('/',     getBanners);                                          // public
router.get('/:id',  getBannerById);                                       // public
router.post('/',    requireAdmin, upload.single('image'), createBanner);  // admin
router.put('/:id',  requireAdmin, upload.single('image'), updateBanner);  // admin
router.delete('/:id', requireAdmin, deleteBanner);                        // admin

module.exports = router;
