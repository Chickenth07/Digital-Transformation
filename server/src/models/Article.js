const { MongooseBase } = require('../libs/MongooseBase');

class ArticleMd extends MongooseBase {}

ArticleMd.init(
  'Article',
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
    deletedAt:     { type: Date, default: null },  // soft delete support
  },
  {
    collection: 'blog', // map đúng collection "blog" trong DB
  }
);

// Text index để full-text search
ArticleMd.model.schema.index({ title: 'text', excerpt: 'text', content: 'text' });

module.exports = ArticleMd;
