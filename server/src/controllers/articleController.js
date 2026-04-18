const Article = require('../models/Article');

// ── GET /api/articles ──────────────────────────────────────────────────────
const getArticles = async (req, res) => {
  try {
    const { category, featured, limit, q } = req.query;
    const filter = {};

    if (category)         filter.category = category;
    if (featured === 'true') filter.featured = true;

    let query = Article.find(filter).sort({ publishedAt: -1 });

    // Full-text search (uses text index)
    if (q) {
      query = Article.find({ ...filter, $text: { $search: q } })
        .sort({ score: { $meta: 'textScore' }, publishedAt: -1 });
    }

    if (limit) query = query.limit(parseInt(limit));

    const articles = await query.lean({ virtuals: true });

    // Normalize _id → id for lean documents
    const normalized = articles.map(a => ({
      ...a,
      id: a._id.toString(),
      _id: undefined,
      __v: undefined,
    }));

    res.json({ articles: normalized, total: normalized.length });
  } catch (err) {
    console.error('getArticles error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// ── GET /api/articles/:id ──────────────────────────────────────────────────
const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    // Support lookup by MongoDB _id OR by slug
    const article = await Article.findOne({
      $or: [
        ...(id.match(/^[a-f\d]{24}$/i) ? [{ _id: id }] : []),
        { slug: id },
      ],
    }).lean({ virtuals: true });

    if (!article) return res.status(404).json({ message: 'Không tìm thấy bài viết' });

    res.json({ ...article, id: article._id.toString(), _id: undefined, __v: undefined });
  } catch (err) {
    console.error('getArticleById error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// ── POST /api/articles ─────────────────────────────────────────────────────
const createArticle = async (req, res) => {
  try {
    const body     = req.body;
    const PORT     = process.env.PORT || 3001;
    const imageUrl = req.file
      ? `http://localhost:${PORT}/uploads/${req.file.filename}`
      : body.image || '';

    const slug = body.slug || body.title.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const article = new Article({
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
    });

    await article.save();
    res.status(201).json(article.toJSON());
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
    const { id }   = req.params;
    const body     = req.body;
    const PORT     = process.env.PORT || 3001;

    const existing = await Article.findOne({
      $or: [
        ...(id.match(/^[a-f\d]{24}$/i) ? [{ _id: id }] : []),
        { slug: id },
      ],
    });
    if (!existing) return res.status(404).json({ message: 'Không tìm thấy bài viết' });

    const imageUrl = req.file
      ? `http://localhost:${PORT}/uploads/${req.file.filename}`
      : body.image || existing.image;

    // Apply updates
    if (body.title)         existing.title         = body.title;
    if (body.slug)          existing.slug          = body.slug;
    if (body.category)      existing.category      = body.category;
    if (body.categoryLabel) existing.categoryLabel = body.categoryLabel;
    if (body.excerpt)       existing.excerpt       = body.excerpt;
    if (body.content)       existing.content       = body.content;
    if (body.author)        existing.author        = body.author;
    existing.image    = imageUrl;
    if (body.featured !== undefined) {
      existing.featured = body.featured === 'true' || body.featured === true;
    }
    if (body.tags !== undefined) {
      existing.tags = Array.isArray(body.tags)
        ? body.tags
        : body.tags.split(',').map(t => t.trim());
    }

    await existing.save();
    res.json(existing.toJSON());
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Slug đã tồn tại' });
    }
    console.error('updateArticle error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// ── DELETE /api/articles/:id ───────────────────────────────────────────────
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Article.findOneAndDelete({
      $or: [
        ...(id.match(/^[a-f\d]{24}$/i) ? [{ _id: id }] : []),
        { slug: id },
      ],
    });
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    res.json({ success: true, deleted: deleted.toJSON() });
  } catch (err) {
    console.error('deleteArticle error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { getArticles, getArticleById, createArticle, updateArticle, deleteArticle };
