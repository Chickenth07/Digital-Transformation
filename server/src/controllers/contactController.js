const Contact = require('../models/Contact');

// GET /api/contacts – admin only
const getContacts = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const contacts = await Contact.find(filter).sort({ createdAt: -1 }).lean({ virtuals: true });
    const normalized = contacts.map(c => ({ ...c, id: c._id.toString(), _id: undefined, __v: undefined }));
    res.json({ contacts: normalized, total: normalized.length });
  } catch (err) {
    console.error('getContacts error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// POST /api/contact – public (form submission từ Home page)
const createContact = async (req, res) => {
  try {
    const { name, email, phone, company, message } = req.body;
    const contact = new Contact({ name, email, phone, company, message });
    await contact.save();
    console.log('📬 New contact submission:', { name, email, phone, company });
    res.json({ success: true, message: 'Đã nhận thông tin. Chúng tôi sẽ liên hệ sớm!' });
  } catch (err) {
    console.error('createContact error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// PATCH /api/contacts/:id – admin: cập nhật status và note
const updateContact = async (req, res) => {
  try {
    const { status, note } = req.body;
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Không tìm thấy liên hệ' });

    if (status) contact.status = status;
    if (note   !== undefined) contact.note = note;

    await contact.save();
    res.json(contact.toJSON());
  } catch (err) {
    console.error('updateContact error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// DELETE /api/contacts/:id – admin
const deleteContact = async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy liên hệ' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { getContacts, createContact, updateContact, deleteContact };
