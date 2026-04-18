const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title:      { type: String, required: true, trim: true },
    subtitle:   { type: String, trim: true },
    image:      { type: String, required: true },
    link:       { type: String, trim: true },
    linkLabel:  { type: String, default: 'Xem thêm' },
    position:   { type: Number, default: 0 },   // thứ tự hiển thị
    active:     { type: Boolean, default: true },
  },
  {
    collection: 'banners',
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

module.exports = mongoose.model('Banner', bannerSchema);
