const Banner = require('../models/Banner');

// GET /api/banners – public (lấy banner active, sắp xếp theo position)
const getBanners = async (req, res) => {
  try {
    const { all } = req.query;
    const filter = all === 'true' ? {} : { active: true };
    const banners = await Banner.find(filter).sort({ position: 1, createdAt: 1 }).lean({ virtuals: true });
    const normalized = banners.map(b => ({ ...b, id: b._id.toString(), _id: undefined, __v: undefined }));
    res.json({ banners: normalized, total: normalized.length });
  } catch (err) {
    console.error('getBanners error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// GET /api/banners/:id
const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Không tìm thấy banner' });
    res.json(banner.toJSON());
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// POST /api/banners – admin
const createBanner = async (req, res) => {
  try {
    const body = req.body;
    const PORT = process.env.PORT || 3001;
    const imageUrl = req.file
      ? `http://localhost:${PORT}/uploads/${req.file.filename}`
      : body.image || '';

    const banner = new Banner({
      title:     body.title,
      subtitle:  body.subtitle,
      image:     imageUrl,
      link:      body.link,
      linkLabel: body.linkLabel || 'Xem thêm',
      position:  parseInt(body.position) || 0,
      active:    body.active === 'false' ? false : true,
    });
    await banner.save();
    res.status(201).json(banner.toJSON());
  } catch (err) {
    console.error('createBanner error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// PUT /api/banners/:id – admin
const updateBanner = async (req, res) => {
  try {
    const body = req.body;
    const PORT = process.env.PORT || 3001;
    const existing = await Banner.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Không tìm thấy banner' });

    if (req.file) existing.image = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    else if (body.image) existing.image = body.image;

    if (body.title     !== undefined) existing.title     = body.title;
    if (body.subtitle  !== undefined) existing.subtitle  = body.subtitle;
    if (body.link      !== undefined) existing.link      = body.link;
    if (body.linkLabel !== undefined) existing.linkLabel = body.linkLabel;
    if (body.position  !== undefined) existing.position  = parseInt(body.position) || 0;
    if (body.active    !== undefined) existing.active    = body.active === 'false' ? false : true;

    await existing.save();
    res.json(existing.toJSON());
  } catch (err) {
    console.error('updateBanner error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// DELETE /api/banners/:id – admin
const deleteBanner = async (req, res) => {
  try {
    const deleted = await Banner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy banner' });
    res.json({ success: true, deleted: deleted.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { getBanners, getBannerById, createBanner, updateBanner, deleteBanner };
