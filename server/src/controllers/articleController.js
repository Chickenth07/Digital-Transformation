const ArticleMd = require('../models/Article');
const mongoose  = require('mongoose');

const PORT  = process.env.PORT || 3001;
const toId  = (id) => mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;

/** Normalize a lean doc: _id (ObjectId) → id (string), strip __v */
const normalize    = (doc) => { if (!doc) return doc; const { _id, __v, ...rest } = doc; return { id: _id?.toString(), ...rest }; };
const normalizeAll = (docs) => docs.map(normalize);

// ── GET /api/articles ──────────────────────────────────────────────────────
const getArticles = async (req, res) => {
  try {
    const { category, featured, limit, page, q } = req.query;
    const where = {};

    if (category)            where.category = category;
    if (featured === 'true') where.featured = true;

    let articles;

    if (q) {
      // Full-text search bypasses MongooseBase — normalize manually
      const raw = await ArticleMd.model
        .find({ ...where, deletedAt: null, $text: { $search: q } })
        .sort({ score: { $meta: 'textScore' }, publishedAt: -1 })
        .lean()
        .exec();
      articles = normalizeAll(raw);
    } else {
      articles = await ArticleMd.find({ where, sort: { publishedAt: -1 }, limit, page });
    }

    res.json({ articles, total: articles.length });
  } catch (err) {
    console.error('getArticles error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


// ── GET /api/articles/:id ──────────────────────────────────────────────────
const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const _id    = toId(id);

    const article = await ArticleMd.findOne({
      where: { $or: [...(_id ? [{ _id }] : []), { slug: id }] },
    });

    if (!article) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    res.json(article);
  } catch (err) {
    console.error('getArticleById error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// ── POST /api/articles ─────────────────────────────────────────────────────
const createArticle = async (req, res) => {
  try {
    const body     = req.body;
    const imageUrl = req.file
      ? `${process.env.SERVER_URL || `http://localhost:${PORT}`}/uploads/${req.file.filename}`
      : body.image || '';

    const slug = body.slug || body.title.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const article = await ArticleMd.create({
      attr: {
        title:         body.title,
        slug,
        category:      body.category,
        categoryLabel: body.categoryLabel || body.category,
        excerpt:       body.excerpt,
        content:       body.content,
        image:         imageUrl,
        author:        body.author || 'Admin',
        publishedAt:   body.publishedAt ? new Date(body.publishedAt) : new Date(),
        featured:      body.featured === 'true' || body.featured === true,
        tags:          body.tags
          ? (Array.isArray(body.tags) ? body.tags : body.tags.split(',').map(t => t.trim()))
          : [],
      },
    });

    res.status(201).json(article);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Slug đã tồn tại, hãy chọn slug khác' });
    }
    console.error('createArticle error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// ── PUT /api/articles/:id ──────────────────────────────────────────────────
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const _id    = toId(id);
    const body   = req.body;

    const existing = await ArticleMd.findOne({
      where: { $or: [...(_id ? [{ _id }] : []), { slug: id }] },
    });
    if (!existing) return res.status(404).json({ message: 'Không tìm thấy bài viết' });

    const patch = {};
    const imageUrl = req.file
      ? `${process.env.SERVER_URL || `http://localhost:${PORT}`}/uploads/${req.file.filename}`
      : body.image || existing.image;

    patch.image = imageUrl;
    if (body.title         !== undefined) patch.title         = body.title;
    if (body.slug          !== undefined) patch.slug          = body.slug;
    if (body.category      !== undefined) patch.category      = body.category;
    if (body.categoryLabel !== undefined) patch.categoryLabel = body.categoryLabel;
    if (body.excerpt       !== undefined) patch.excerpt       = body.excerpt;
    if (body.content       !== undefined) patch.content       = body.content;
    if (body.author        !== undefined) patch.author        = body.author;
    if (body.featured      !== undefined) patch.featured      = body.featured === 'true' || body.featured === true;
    if (body.tags          !== undefined) patch.tags          = Array.isArray(body.tags)
      ? body.tags : body.tags.split(',').map(t => t.trim());

    const docId = toId(existing.id);
    await ArticleMd.update({ where: { _id: docId }, attr: patch });
    const updated = await ArticleMd.findOne({ where: { _id: docId } });
    res.json(updated);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Slug đã tồn tại' });
    console.error('updateArticle error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// ── DELETE /api/articles/:id ───────────────────────────────────────────────
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const _id    = toId(id);

    const existing = await ArticleMd.findOne({
      where: { $or: [...(_id ? [{ _id }] : []), { slug: id }] },
    });
    if (!existing) return res.status(404).json({ message: 'Không tìm thấy bài viết' });

    await ArticleMd.softDelete({ where: { _id: toId(existing.id) } });
    res.json({ success: true });
  } catch (err) {
    console.error('deleteArticle error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { getArticles, getArticleById, createArticle, updateArticle, deleteArticle };
