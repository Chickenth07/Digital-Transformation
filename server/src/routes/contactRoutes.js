const express = require('express');
const { getContacts, createContact, updateContact, deleteContact } = require('../controllers/contactController');

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'dt-admin-secret-token-2026';
const requireAdmin = (req, res, next) => {
  if (req.headers.authorization === `Bearer ${ADMIN_TOKEN}`) return next();
  res.status(403).json({ message: 'Unauthorized' });
};

const router = express.Router();

// Public: khách hàng gửi form
router.post('/', createContact);

// Admin: quản lý danh sách
router.get('/',      requireAdmin, getContacts);
router.patch('/:id', requireAdmin, updateContact);
router.delete('/:id', requireAdmin, deleteContact);

module.exports = router;
