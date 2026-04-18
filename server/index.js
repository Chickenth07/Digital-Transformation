const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Ensure dirs exist ───────────────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DATA_FILE   = path.join(__dirname, 'data', 'articles.json');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ── Multer (image upload) ───────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOADS_DIR),
  filename:    (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ── Helpers ─────────────────────────────────────────────────────────────────
const readArticles  = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeArticles = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// ── Admin token (simple – replace with JWT in production) ───────────────────
const ADMIN_PASSWORD = 'admin123';
const ADMIN_TOKEN    = 'dt-admin-secret-token-2026';

// ── ROUTES ───────────────────────────────────────────────────────────────────

// Auth
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_TOKEN });
  } else {
    res.status(401).json({ success: false, message: 'Sai mật khẩu' });
  }
});

// Middleware: verify admin token
const requireAdmin = (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth === `Bearer ${ADMIN_TOKEN}`) return next();
  res.status(403).json({ message: 'Unauthorized' });
};

// GET /api/articles – public, with optional filter
app.get('/api/articles', (req, res) => {
  const { category, featured, limit, q } = req.query;
  let articles = readArticles();

  if (category)         articles = articles.filter(a => a.category === category);
  if (featured === 'true') articles = articles.filter(a => a.featured);
  if (q)                articles = articles.filter(a =>
    a.title.toLowerCase().includes(q.toLowerCase()) ||
    a.excerpt.toLowerCase().includes(q.toLowerCase())
  );

  articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  if (limit) articles = articles.slice(0, parseInt(limit));

  res.json({ articles, total: articles.length });
});

// GET /api/articles/:id – single article (public)
app.get('/api/articles/:id', (req, res) => {
  const articles = readArticles();
  const article  = articles.find(a => a.id === req.params.id || a.slug === req.params.id);
  if (!article) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
  res.json(article);
});

// POST /api/articles – create (admin)
app.post('/api/articles', requireAdmin, upload.single('image'), (req, res) => {
  const articles  = readArticles();
  const body      = req.body;
  const imageUrl  = req.file
    ? `http://localhost:${PORT}/uploads/${req.file.filename}`
    : body.image || '';

  const newArticle = {
    id:           uuidv4(),
    title:        body.title,
    slug:         body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category:     body.category,
    categoryLabel: body.categoryLabel || body.category,
    excerpt:      body.excerpt,
    content:      body.content,
    image:        imageUrl,
    author:       body.author || 'Admin',
    publishedAt:  new Date().toISOString(),
    featured:     body.featured === 'true' || body.featured === true,
    tags:         body.tags ? (Array.isArray(body.tags) ? body.tags : body.tags.split(',').map(t => t.trim())) : [],
  };

  articles.push(newArticle);
  writeArticles(articles);
  res.status(201).json(newArticle);
});

// PUT /api/articles/:id – update (admin)
app.put('/api/articles/:id', requireAdmin, upload.single('image'), (req, res) => {
  const articles = readArticles();
  const idx      = articles.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Không tìm thấy bài viết' });

  const body     = req.body;
  const imageUrl = req.file
    ? `http://localhost:${PORT}/uploads/${req.file.filename}`
    : body.image || articles[idx].image;

  articles[idx] = {
    ...articles[idx],
    title:        body.title        || articles[idx].title,
    slug:         body.slug         || articles[idx].slug,
    category:     body.category     || articles[idx].category,
    categoryLabel: body.categoryLabel || articles[idx].categoryLabel,
    excerpt:      body.excerpt      || articles[idx].excerpt,
    content:      body.content      || articles[idx].content,
    image:        imageUrl,
    author:       body.author       || articles[idx].author,
    featured:     body.featured !== undefined
      ? (body.featured === 'true' || body.featured === true)
      : articles[idx].featured,
    tags: body.tags
      ? (Array.isArray(body.tags) ? body.tags : body.tags.split(',').map(t => t.trim()))
      : articles[idx].tags,
    updatedAt: new Date().toISOString(),
  };

  writeArticles(articles);
  res.json(articles[idx]);
});

// DELETE /api/articles/:id – delete (admin)
app.delete('/api/articles/:id', requireAdmin, (req, res) => {
  let articles = readArticles();
  const idx    = articles.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Không tìm thấy bài viết' });

  const deleted = articles.splice(idx, 1)[0];
  writeArticles(articles);
  res.json({ success: true, deleted });
});

// POST /api/contact – contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, phone, company, message } = req.body;
  // In production: save to DB / send email
  console.log('New contact submission:', { name, email, phone, company, message });
  res.json({ success: true, message: 'Đã nhận thông tin. Chúng tôi sẽ liên hệ sớm!' });
});

// Upload image (standalone)
app.post('/api/upload', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: `http://localhost:${PORT}/uploads/${req.file.filename}` });
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`   Admin token: ${ADMIN_TOKEN}`);
  console.log(`   Admin password: ${ADMIN_PASSWORD}\n`);
});
