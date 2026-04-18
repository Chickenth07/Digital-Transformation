/**
 * seed.js — Import dữ liệu từ data/articles.json vào MongoDB Atlas
 * Chạy: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const fs       = require('fs');
const path     = require('path');
const Article  = require('./src/models/Article');

const DATA_FILE = path.join(__dirname, 'data', 'articles.json');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB Atlas');

  const rawArticles = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

  // Clear existing data
  await Article.deleteMany({});
  console.log('🗑  Cleared existing articles');

  const toInsert = rawArticles.map(a => ({
    title:         a.title,
    slug:          a.slug,
    category:      a.category,
    categoryLabel: a.categoryLabel,
    excerpt:       a.excerpt,
    content:       a.content,
    image:         a.image,
    author:        a.author,
    publishedAt:   new Date(a.publishedAt),
    featured:      a.featured,
    tags:          a.tags || [],
  }));

  const inserted = await Article.insertMany(toInsert);
  console.log(`🌱 Seeded ${inserted.length} articles successfully!`);

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
