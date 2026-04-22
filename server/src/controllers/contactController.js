const ContactMd = require('../models/Contact');
const mongoose  = require('mongoose');

const toId = (id) => mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;

// GET /api/contact – admin only
const getContacts = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const contacts = await ContactMd.find({ where });
    res.json({ contacts, total: contacts.length });
  } catch (err) {
    console.error('getContacts error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// POST /api/contact – public (form submission từ Home page)
const createContact = async (req, res) => {
  try {
    const { name, email, phone, company, message } = req.body;
    const contact = await ContactMd.create({ attr: { name, email, phone, company, message } });
    console.log('📬 New contact submission:', { name, email, phone, company });
    res.json({ success: true, message: 'Đã nhận thông tin. Chúng tôi sẽ liên hệ sớm!' });
  } catch (err) {
    console.error('createContact error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// PATCH /api/contact/:id – admin: cập nhật status và note
const updateContact = async (req, res) => {
  try {
    const _id = toId(req.params.id);
    if (!_id) return res.status(400).json({ message: 'ID không hợp lệ' });

    const existing = await ContactMd.findOne({ where: { _id } });
    if (!existing) return res.status(404).json({ message: 'Không tìm thấy liên hệ' });

    const { status, note } = req.body;
    const patch = {};
    if (status !== undefined) patch.status = status;
    if (note   !== undefined) patch.note   = note;

    await ContactMd.update({ where: { _id }, attr: patch });
    const updated = await ContactMd.findOne({ where: { _id } });
    res.json(updated);
  } catch (err) {
    console.error('updateContact error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// DELETE /api/contact/:id – admin (soft delete)
const deleteContact = async (req, res) => {
  try {
    const _id = toId(req.params.id);
    if (!_id) return res.status(400).json({ message: 'ID không hợp lệ' });

    const existing = await ContactMd.findOne({ where: { _id } });
    if (!existing) return res.status(404).json({ message: 'Không tìm thấy liên hệ' });

    await ContactMd.softDelete({ where: { _id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { getContacts, createContact, updateContact, deleteContact };
