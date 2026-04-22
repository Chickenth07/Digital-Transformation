const { MongooseBase } = require('../libs/MongooseBase');

class BannerMd extends MongooseBase {}

BannerMd.init(
  'Banner',
  {
    title:     { type: String, required: true, trim: true },
    subtitle:  { type: String, trim: true },
    image:     { type: String, required: true },
    link:      { type: String, trim: true },
    linkLabel: { type: String, default: 'Xem thêm' },
    position:  { type: Number, default: 0 },   // thứ tự hiển thị
    active:    { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },   // soft delete support
  },
  { collection: 'banners' }
);

module.exports = BannerMd;
