/**
 * src/libs/MongooseBase.js
 * ─────────────────────────────────────────────────────────────
 * Base class cho tất cả Mongoose models trong project.
 *
 * Usage:
 *   const { MongooseBase } = require('../libs/MongooseBase');
 *
 *   class ArticleMd extends MongooseBase {}
 *   ArticleMd.init('Article', schemaAttr, { collection: 'blog' });
 * ─────────────────────────────────────────────────────────────
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

/** Convert a lean document: _id (ObjectId) → id (string), remove __v */
const normalize = (doc) => {
  if (!doc) return doc;
  const { _id, __v, ...rest } = doc;
  return { id: _id?.toString(), ...rest };
};

const normalizeMany = (docs) => docs.map(normalize);


class MongooseBase {
  /**
   * Khởi tạo model với tên và schema.
   * @param {string} modelName   - Tên model (dùng để đăng ký với Mongoose)
   * @param {object} attr        - Định nghĩa các field của schema
   * @param {object} [options]   - Tùy chọn schema bổ sung (vd: { collection: 'blog' })
   */
  static init(modelName, attr, options = {}) {
    this.model = mongoose.model(
      modelName,
      new Schema(attr, {
        timestamps: true,
        suppressReservedKeysWarning: true,
        ...options,
      })
    );
    return this.model;
  }

  /**
   * Lấy danh sách documents với filter, phân trang, sort, populate.
   * Tự động lọc deletedAt = null (soft delete support).
   */
  static find({ where = {}, page, limit, populates = [], sort = { createdAt: -1 }, attr } = {}) {
    const _where = { ...where };
    if (_where.deletedAt === undefined) _where.deletedAt = null;

    const query = this.model.find(_where);

    if (attr)  query.select(attr);
    if (sort)  query.sort(sort);

    if (Number(limit) && Number(page)) {
      const skip = (Number(page) - 1) * Number(limit);
      query.skip(skip).limit(Number(limit));
    }

    populates.forEach(p => query.populate(p));

    return query.lean().exec().then(normalizeMany);
  }

  /**
   * Đếm số documents khớp với điều kiện.
   */
  static count({ where = {} } = {}) {
    const _where = { ...where };
    if (_where.deletedAt === undefined) _where.deletedAt = null;

    return this.model.countDocuments(_where);
  }

  /**
   * Lấy một document đầu tiên khớp điều kiện.
   */
  static findOne({ where = {}, populates = [], attr, sort = { createdAt: -1 } } = {}) {
    const _where = { ...where };
    if (_where.deletedAt === undefined) _where.deletedAt = null;

    const query = this.model.findOne(_where);

    if (attr) query.select(attr);
    if (sort) query.sort(sort);
    populates.forEach(p => query.populate(p));

    return query.lean().exec().then(normalize);
  }

  /**
   * Tạo mới một document.
   */
  static create({ attr = {} } = {}) {
    return this.model.create(attr);
  }

  /**
   * Cập nhật một document đầu tiên khớp điều kiện.
   * Bỏ qua nếu where rỗng (bảo vệ khỏi update toàn bộ collection).
   */
  static update({ where = {}, attr = {} } = {}) {
    if (Object.keys(where).length === 0) return;
    return this.model.updateOne(where, attr);
  }

  /**
   * Cập nhật nhiều documents khớp điều kiện.
   */
  static updateMany({ where = {}, attr = {} } = {}) {
    if (Object.keys(where).length === 0) return;
    return this.model.updateMany(where, attr);
  }

  /**
   * Soft delete: đặt deletedAt thay vì xóa thật.
   */
  static softDelete({ where = {} } = {}) {
    if (Object.keys(where).length === 0) return;
    return this.model.updateMany(where, { deletedAt: new Date() });
  }

  /**
   * Xóa thật (hard delete) — dùng cẩn thận.
   */
  static hardDelete({ where = {} } = {}) {
    if (Object.keys(where).length === 0) return;
    return this.model.deleteMany(where);
  }

  /**
   * Aggregate pipeline tùy ý.
   */
  static aggregate({ pipeline = [] } = {}) {
    return this.model.aggregate(pipeline);
  }
}

module.exports = { MongooseBase };
