const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, trim: true },
    phone:    { type: String, trim: true },
    company:  { type: String, trim: true },
    message:  { type: String, trim: true },
    status:   { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
    note:     { type: String },   // ghi chú nội bộ của admin
  },
  {
    collection: 'contacts',
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Contact', contactSchema);
