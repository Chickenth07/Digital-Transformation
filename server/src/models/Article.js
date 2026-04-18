const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title:         { type: String, required: true, trim: true },
    slug:          { type: String, required: true, unique: true, trim: true },
    category:      { type: String, required: true, trim: true },
    categoryLabel: { type: String, trim: true },
    excerpt:       { type: String, trim: true },
    content:       { type: String },
    image:         { type: String },
    author:        { type: String, default: 'Admin' },
    publishedAt:   { type: Date, default: Date.now },
    featured:      { type: Boolean, default: false },
    tags:          { type: [String], default: [] },
  },
  {
    collection: 'blog',   // ← map đúng collection "blog" trong database digital_transformation
    timestamps: true,     // tự thêm createdAt & updatedAt
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

// Text index để full-text search (title, excerpt, content)
articleSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

module.exports = mongoose.model('Article', articleSchema);
