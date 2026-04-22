const BannerMd = require('../models/Banner');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3001;

const toId = (id) => mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;

// GET /api/banners – public (lấy banner active, sắp xếp theo position)
const getBanners = async (req, res) => {
  try {
    const { all } = req.query;
    const where = all === 'true' ? {} : { active: true };

    const banners = await BannerMd.find({ where, sort: { position: 1, createdAt: 1 } });
    res.json({ banners, total: banners.length });
  } catch (err) {
    console.error('getBanners error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// GET /api/banners/:id
const getBannerById = async (req, res) => {
  try {
    const _id = toId(req.params.id);
    if (!_id) return res.status(400).json({ message: 'ID không hợp lệ' });

    const banner = await BannerMd.findOne({ where: { _id } });
    if (!banner) return res.status(404).json({ message: 'Không tìm thấy banner' });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// POST /api/banners – admin
const createBanner = async (req, res) => {
  try {
    const body = req.body;
    const imageUrl = req.file
      ? `${process.env.SERVER_URL || `http://localhost:${PORT}`}/uploads/${req.file.filename}`
      : body.image || '';

    const banner = await BannerMd.create({
      attr: {
        title:     body.title,
        subtitle:  body.subtitle,
        image:     imageUrl,
        link:      body.link,
        linkLabel: body.linkLabel || 'Xem thêm',
        position:  parseInt(body.position) || 0,
        active:    body.active !== 'false',
      },
    });
    res.status(201).json(banner);
  } catch (err) {
    console.error('createBanner error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// PUT /api/banners/:id – admin
const updateBanner = async (req, res) => {
  try {
    const _id = toId(req.params.id);
    if (!_id) return res.status(400).json({ message: 'ID không hợp lệ' });

    const existing = await BannerMd.findOne({ where: { _id } });
    if (!existing) return res.status(404).json({ message: 'Không tìm thấy banner' });

    const body  = req.body;
    const patch = {};

    if (req.file)                  patch.image     = `${process.env.SERVER_URL || `http://localhost:${PORT}`}/uploads/${req.file.filename}`;
    else if (body.image)           patch.image     = body.image;
    if (body.title     !== undefined) patch.title     = body.title;
    if (body.subtitle  !== undefined) patch.subtitle  = body.subtitle;
    if (body.link      !== undefined) patch.link      = body.link;
    if (body.linkLabel !== undefined) patch.linkLabel = body.linkLabel;
    if (body.position  !== undefined) patch.position  = parseInt(body.position) || 0;
    if (body.active    !== undefined) patch.active    = body.active !== 'false';

    await BannerMd.update({ where: { _id }, attr: patch });
    const updated = await BannerMd.findOne({ where: { _id } });
    res.json(updated);
  } catch (err) {
    console.error('updateBanner error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// DELETE /api/banners/:id – admin (soft delete)
const deleteBanner = async (req, res) => {
  try {
    const _id = toId(req.params.id);
    if (!_id) return res.status(400).json({ message: 'ID không hợp lệ' });

    const existing = await BannerMd.findOne({ where: { _id } });
    if (!existing) return res.status(404).json({ message: 'Không tìm thấy banner' });

    await BannerMd.softDelete({ where: { _id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { getBanners, getBannerById, createBanner, updateBanner, deleteBanner };
