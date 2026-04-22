const { MongooseBase } = require('../libs/MongooseBase');

class ContactMd extends MongooseBase {}

ContactMd.init(
  'Contact',
  {
    name:      { type: String, required: true, trim: true },
    email:     { type: String, trim: true },
    phone:     { type: String, trim: true },
    company:   { type: String, trim: true },
    message:   { type: String, trim: true },
    status:    { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
    note:      { type: String },   // ghi chú nội bộ của admin
    deletedAt: { type: Date, default: null },  // soft delete support
  },
  { collection: 'contacts' }
);

module.exports = ContactMd;
