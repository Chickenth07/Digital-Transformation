require('dotenv').config();
// Override DNS to use Google (8.8.8.8) — fixes ISP SRV lookup issues with MongoDB Atlas
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
const express   = require('express');
const cors      = require('cors');
const mongoose  = require('mongoose');
const path      = require('path');
const fs        = require('fs');

const articleRoutes = require('./src/routes/articleRoutes');
const bannerRoutes  = require('./src/routes/bannerRoutes');
const contactRoutes = require('./src/routes/contactRoutes');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Ensure uploads dir exists ────────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// ── Auth route (simple token, không cần model riêng) ────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_TOKEN    = process.env.ADMIN_TOKEN    || 'dt-admin-secret-token-2026';

app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_TOKEN });
  } else {
    res.status(401).json({ success: false, message: 'Sai mật khẩu' });
  }
});

// ── Routes ────────────────────────────────────────
app.use('/api/articles', articleRoutes);
app.use('/api/banners',  bannerRoutes);
app.use('/api/contact',  contactRoutes);   // POST public + GET/PATCH/DELETE admin

// ── Upload standalone ────────────────────────────────────────────────────────
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const requireAdmin = (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth === `Bearer ${ADMIN_TOKEN}`) return next();
  res.status(403).json({ message: 'Unauthorized' });
};

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOADS_DIR),
  filename:    (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

app.post('/api/upload', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: `http://localhost:${PORT}/uploads/${req.file.filename}` });
});

// Contact routes được mount bên trên qua contactRoutes

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ── Connect MongoDB then start server ────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    family: 4,                        // force IPv4, tránh IPv6 gây lỗi
  })
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running at http://localhost:${PORT}`);
      console.log(`   Admin token: ${ADMIN_TOKEN}`);
      console.log(`   Admin password: ${ADMIN_PASSWORD}\n`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
