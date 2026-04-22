import { useState, useEffect, useCallback } from "react";
import api from "../api";

/* ══════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════ */
const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-300 focus:border-green-500 outline-none text-sm text-gray-800 bg-white transition-colors";
const labelCls =
  "block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5";

const CATS = [
  { value: "kien-thuc-toa-nha", label: "Kiến thức tòa nhà" },
  { value: "chuyen-doi-xanh",   label: "Chuyển đổi xanh" },
];
const CAT_BADGE = {
  "kien-thuc-toa-nha": "bg-green-100 text-green-700",
  "chuyen-doi-xanh":   "bg-emerald-100 text-emerald-700",
};
const STATUS_BADGE = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  closed: "bg-gray-100 text-gray-500",
};
const STATUS_LABEL = {
  new: "🆕 Mới",
  contacted: "📞 Đã liên hệ",
  closed: "✅ Đóng",
};

const NAV = [
  { key: "articles", icon: "📄", label: "Bài viết" },
  { key: "banners", icon: "🖼️", label: "Banner" },
  { key: "contacts", icon: "📬", label: "Liên hệ / Tư vấn" },
];

/* ══════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════ */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-xl z-[100] transition-all ${toast.type === "error" ? "bg-red-600" : "bg-green-600"}`}
    >
      {toast.msg}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   CONFIRM DIALOG
══════════════════════════════════════════════════════ */
function Confirm({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          🗑️ Xác nhận xóa
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          {message || "Bạn có chắc muốn xóa? Không thể hoàn tác."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-full border-2 border-gray-300 text-gray-600 text-sm font-semibold hover:border-gray-400 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LOGIN
══════════════════════════════════════════════════════ */
function Login({ onLogin }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const r = await api.post("/auth/login", { password: pw });
      localStorage.setItem("admin_token", r.data.token);
      onLogin();
    } catch {
      setError("Sai mật khẩu. Hãy thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-sm text-center">
        <div className="flex items-center justify-center gap-2 mb-5">
          <img
            src="/Logo.jpg"
            alt="Vận hành số - Chuyển đổi xanh"
            className="h-10 w-auto object-contain"
          />
          <strong className="font-extrabold text-gray-900">
            Admin Dashboard
          </strong>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Đăng nhập quản trị
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Khu vực này chỉ dành cho quản trị viên.
        </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Nhập mật khẩu admin…"
            required
            autoFocus
            className={inputCls}
          />
          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-full bg-green-600 text-white font-semibold text-sm hover:bg-green-700 disabled:opacity-60 transition-colors"
          >
            {loading ? "Đang kiểm tra…" : "🔐 Đăng nhập"}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-5">
          Mật khẩu demo:{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-green-700">
            admin123
          </code>
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ARTICLES SECTION
══════════════════════════════════════════════════════ */
function ArticleModal({ article, onSave, onClose }) {
  const isEdit = !!article;
  const [form, setForm] = useState({
    title: article?.title || "",
    category: article?.category || "kien-thuc-toa-nha",
    categoryLabel: article?.categoryLabel || "Kiến thức tòa nhà",
    excerpt: article?.excerpt || "",
    content: article?.content || "",
    image: article?.image || "",
    author: article?.author || "Admin",
    featured: article?.featured || false,
    tags: article?.tags?.join(", ") || "",
  });
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState(article?.image || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "category") {
      const cat = CATS.find((c) => c.value === value);
      setForm((f) => ({
        ...f,
        category: value,
        categoryLabel: cat?.label || value,
      }));
    } else {
      setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    }
  };
  const onImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setPreview(URL.createObjectURL(file));
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imgFile) fd.set("image", imgFile);
      const cfg = { headers: { "Content-Type": "multipart/form-data" } };
      if (isEdit) await api.put(`/articles/${article.id}`, fd, cfg);
      else await api.post("/articles", fd, cfg);
      onSave();
    } catch {
      setError("Lỗi khi lưu. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">
            {isEdit ? "✏️ Chỉnh sửa bài viết" : "➕ Thêm bài viết mới"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit} className="overflow-y-auto p-6 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Tiêu đề *</label>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                required
                placeholder="Tiêu đề bài viết…"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Danh mục</label>
              <select
                name="category"
                value={form.category}
                onChange={onChange}
                className={inputCls}
              >
                {CATS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Tác giả</label>
              <input
                name="author"
                value={form.author}
                onChange={onChange}
                placeholder="Tên tác giả"
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Tóm tắt *</label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={onChange}
                rows={2}
                required
                placeholder="Mô tả ngắn…"
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Nội dung (HTML) *</label>
              <textarea
                name="content"
                value={form.content}
                onChange={onChange}
                rows={7}
                required
                placeholder="<p>Nội dung...</p>"
                className={`${inputCls} resize-y`}
              />
            </div>
            <div>
              <label className={labelCls}>Ảnh bìa</label>
              <input
                type="file"
                accept="image/*"
                onChange={onImg}
                className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-green-100 file:text-green-700 file:font-semibold hover:file:bg-green-200"
              />
              {!imgFile && (
                <input
                  name="image"
                  value={form.image}
                  onChange={onChange}
                  placeholder="hoặc dán URL ảnh…"
                  className={`${inputCls} mt-2`}
                />
              )}
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="mt-2 w-full h-28 object-cover rounded-xl border border-gray-200"
                />
              )}
            </div>
            <div>
              <label className={labelCls}>Tags (phân cách bằng dấu phẩy)</label>
              <input
                name="tags"
                value={form.tags}
                onChange={onChange}
                placeholder="IoT, BMS, xanh"
                className={inputCls}
              />
              <label className="flex items-center gap-2 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={onChange}
                  className="w-4 h-4 accent-green-600 rounded"
                />
                <span className="text-sm text-gray-700 font-medium">
                  Bài viết nổi bật (featured)
                </span>
              </label>
            </div>
          </div>
          {error && (
            <p className="mt-4 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full border-2 border-gray-300 text-gray-600 text-sm font-semibold hover:border-gray-400 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors"
            >
              {saving
                ? "Đang lưu…"
                : isEdit
                  ? "💾 Cập nhật"
                  : "➕ Thêm bài viết"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ArticlesSection({ showToast }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get("/articles")
      .then((r) => setArticles(r.data.articles))
      .catch(() => showToast("Lỗi tải dữ liệu", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/articles/${id}`);
      showToast("Đã xóa bài viết!");
      load();
    } catch {
      showToast("Lỗi khi xóa!", "error");
    }
    setConfirm(null);
  };

  const filtered = articles.filter(
    (a) => !search || a.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { icon: "📄", label: "Tổng bài viết", val: articles.length },
          {
            icon: "⭐",
            label: "Bài nổi bật",
            val: articles.filter((a) => a.featured).length,
          },
          {
            icon: "📁",
            label: "Danh mục",
            val: [...new Set(articles.map((a) => a.category))].length,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
          >
            <span className="text-3xl">{s.icon}</span>
            <div>
              <strong className="block text-2xl font-extrabold text-gray-900">
                {s.val}
              </strong>
              <small className="text-xs text-gray-400">{s.label}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2 bg-white border-[1.5px] border-gray-300 focus-within:border-green-500 rounded-full px-4 py-2 min-w-[260px] transition-colors">
          <span className="text-sm">🔍</span>
          <input
            className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400"
            placeholder="Tìm bài viết…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setEditing("new")}
          className="px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
        >
          ➕ Thêm bài viết
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-[3px] border-gray-300 border-t-green-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {[
                  "Ảnh",
                  "Tiêu đề",
                  "Danh mục",
                  "Tác giả",
                  "Ngày đăng",
                  "Nổi bật",
                  "Thao tác",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-sm text-gray-400"
                  >
                    Không có bài viết nào
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={a.image}
                        alt=""
                        className="w-16 h-11 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-4 py-3 max-w-[240px]">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {a.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {a.excerpt?.slice(0, 55)}…
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${CAT_BADGE[a.category] || "bg-green-100 text-green-700"}`}
                      >
                        {a.categoryLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {a.author}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(a.publishedAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {a.featured ? "⭐" : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditing(a)}
                          className="px-3 py-1.5 rounded-full border-2 border-green-600 text-green-600 text-xs font-semibold hover:bg-green-600 hover:text-white transition-all"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => setConfirm(a.id)}
                          className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-600 hover:text-white transition-all"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <ArticleModal
          article={editing === "new" ? null : editing}
          onSave={() => {
            setEditing(null);
            showToast(editing === "new" ? "Đã thêm bài viết!" : "Đã cập nhật!");
            load();
          }}
          onClose={() => setEditing(null)}
        />
      )}
      {confirm && (
        <Confirm
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════
   BANNERS SECTION
══════════════════════════════════════════════════════ */
function BannerModal({ banner, onSave, onClose }) {
  const isEdit = !!banner;
  const [form, setForm] = useState({
    title: banner?.title || "",
    subtitle: banner?.subtitle || "",
    image: banner?.image || "",
    link: banner?.link || "",
    linkLabel: banner?.linkLabel || "Xem thêm",
    position: banner?.position ?? 0,
    active: banner?.active ?? true,
  });
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState(banner?.image || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };
  const onImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setPreview(URL.createObjectURL(file));
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imgFile) fd.set("image", imgFile);
      const cfg = { headers: { "Content-Type": "multipart/form-data" } };
      if (isEdit) await api.put(`/banners/${banner.id}`, fd, cfg);
      else await api.post("/banners", fd, cfg);
      onSave();
    } catch {
      setError("Lỗi khi lưu. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">
            {isEdit ? "✏️ Chỉnh sửa banner" : "➕ Thêm banner mới"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit} className="overflow-y-auto p-6 flex-1">
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelCls}>Tiêu đề banner *</label>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                required
                placeholder="Tiêu đề…"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Phụ đề</label>
              <input
                name="subtitle"
                value={form.subtitle}
                onChange={onChange}
                placeholder="Mô tả ngắn…"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Hình ảnh banner *</label>
              <input
                type="file"
                accept="image/*"
                onChange={onImg}
                className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-green-100 file:text-green-700 file:font-semibold hover:file:bg-green-200"
              />
              {!imgFile && (
                <input
                  name="image"
                  value={form.image}
                  onChange={onChange}
                  placeholder="hoặc dán URL ảnh…"
                  className={`${inputCls} mt-2`}
                />
              )}
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="mt-2 w-full h-36 object-cover rounded-xl border border-gray-200"
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Link URL</label>
                <input
                  name="link"
                  value={form.link}
                  onChange={onChange}
                  placeholder="https://…"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Label nút</label>
                <input
                  name="linkLabel"
                  value={form.linkLabel}
                  onChange={onChange}
                  placeholder="Xem thêm"
                  className={inputCls}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className={labelCls}>Thứ tự hiển thị</label>
                <input
                  name="position"
                  type="number"
                  value={form.position}
                  onChange={onChange}
                  min={0}
                  className={inputCls}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-5">
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={onChange}
                  className="w-4 h-4 accent-green-600 rounded"
                />
                <span className="text-sm text-gray-700 font-medium">
                  Hiển thị trên web
                </span>
              </label>
            </div>
          </div>
          {error && (
            <p className="mt-4 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full border-2 border-gray-300 text-gray-600 text-sm font-semibold hover:border-gray-400 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors"
            >
              {saving ? "Đang lưu…" : isEdit ? "💾 Cập nhật" : "➕ Thêm banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BannersSection({ showToast }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get("/banners?all=true")
      .then((r) => setBanners(r.data.banners))
      .catch(() => showToast("Lỗi tải banner", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/banners/${id}`);
      showToast("Đã xóa banner!");
      load();
    } catch {
      showToast("Lỗi khi xóa!", "error");
    }
    setConfirm(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Quản lý Banner</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {banners.length} banner · {banners.filter((b) => b.active).length}{" "}
            đang hiển thị
          </p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
        >
          ➕ Thêm banner
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-[3px] border-gray-300 border-t-green-600 rounded-full animate-spin" />
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 py-20 text-center text-gray-400">
          <p className="text-4xl mb-3">🖼️</p>
          <p className="text-sm">
            Chưa có banner nào. Nhấn <strong>+ Thêm banner</strong> để bắt đầu.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {banners.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="relative h-36 bg-gray-100">
                {b.image ? (
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
                    🖼️
                  </div>
                )}
                <span
                  className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${b.active ? "bg-green-600 text-white" : "bg-gray-400 text-white"}`}
                >
                  {b.active ? "Hiển thị" : "Ẩn"}
                </span>
              </div>
              <div className="p-4">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {b.title}
                </p>
                {b.subtitle && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {b.subtitle}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-gray-400">
                    Thứ tự: {b.position}
                  </span>
                  {b.link && (
                    <span className="text-xs text-blue-500 truncate ml-2">
                      🔗 {b.link.slice(0, 28)}…
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setEditing(b)}
                    className="flex-1 py-1.5 rounded-full border-2 border-green-600 text-green-600 text-xs font-semibold hover:bg-green-600 hover:text-white transition-all"
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={() => setConfirm(b.id)}
                    className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-600 hover:text-white transition-all"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <BannerModal
          banner={editing === "new" ? null : editing}
          onSave={() => {
            setEditing(null);
            showToast(
              editing === "new" ? "Đã thêm banner!" : "Đã cập nhật banner!",
            );
            load();
          }}
          onClose={() => setEditing(null)}
        />
      )}
      {confirm && (
        <Confirm
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
          message="Bạn có chắc muốn xóa banner này?"
        />
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════
   CONTACTS SECTION
══════════════════════════════════════════════════════ */
function ContactDetail({ contact, onClose, onUpdate }) {
  const [note, setNote] = useState(contact.note || "");
  const [status, setStatus] = useState(contact.status);
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/contact/${contact.id}`, { status, note });
      onUpdate();
      onClose();
    } catch {
      alert("Lỗi khi cập nhật");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">📬 Chi tiết liên hệ</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 text-sm">
            <div>
              <span className="text-gray-400 text-xs font-bold uppercase">
                Họ tên
              </span>
              <p className="font-semibold text-gray-900 mt-0.5">
                {contact.name}
              </p>
            </div>
            <div>
              <span className="text-gray-400 text-xs font-bold uppercase">
                Email
              </span>
              <p className="font-medium text-blue-600 mt-0.5">
                {contact.email || "—"}
              </p>
            </div>
            <div>
              <span className="text-gray-400 text-xs font-bold uppercase">
                Điện thoại
              </span>
              <p className="font-medium text-gray-900 mt-0.5">
                {contact.phone || "—"}
              </p>
            </div>
            <div>
              <span className="text-gray-400 text-xs font-bold uppercase">
                Đơn vị
              </span>
              <p className="font-medium text-gray-900 mt-0.5">
                {contact.company || "—"}
              </p>
            </div>
            {contact.message && (
              <div className="col-span-2">
                <span className="text-gray-400 text-xs font-bold uppercase">
                  Nội dung
                </span>
                <p className="text-gray-700 mt-0.5 text-sm leading-relaxed">
                  {contact.message}
                </p>
              </div>
            )}
            <div className="col-span-2 text-xs text-gray-400">
              Nhận lúc: {new Date(contact.createdAt).toLocaleString("vi-VN")}
            </div>
          </div>

          <div>
            <label className={labelCls}>Trạng thái xử lý</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputCls}
            >
              <option value="new">🆕 Mới</option>
              <option value="contacted">📞 Đã liên hệ</option>
              <option value="closed">✅ Đóng</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Ghi chú nội bộ</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Ghi chú xử lý…"
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full border-2 border-gray-300 text-gray-600 text-sm font-semibold hover:border-gray-400 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="px-5 py-2 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors"
            >
              {saving ? "Đang lưu…" : "💾 Cập nhật"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactsSection({ showToast }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    const params = filterStatus ? `?status=${filterStatus}` : "";
    api
      .get(`/contact${params}`)
      .then((r) => setContacts(r.data.contacts))
      .catch(() => showToast("Lỗi tải danh sách", "error"))
      .finally(() => setLoading(false));
  }, [showToast, filterStatus]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/contact/${id}`);
      showToast("Đã xóa liên hệ!");
      load();
    } catch {
      showToast("Lỗi khi xóa!", "error");
    }
    setConfirm(null);
  };

  const counts = {
    all: contacts.length,
    new: contacts.filter((c) => c.status === "new").length,
    contacted: contacts.filter((c) => c.status === "contacted").length,
    closed: contacts.filter((c) => c.status === "closed").length,
  };

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Tổng cộng", val: counts.all, color: "text-gray-900" },
          { label: "Mới", val: counts.new, color: "text-blue-600" },
          {
            label: "Đã liên hệ",
            val: counts.contacted,
            color: "text-amber-600",
          },
          { label: "Đã đóng", val: counts.closed, color: "text-gray-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 text-center"
          >
            <strong className={`block text-3xl font-extrabold ${s.color}`}>
              {s.val}
            </strong>
            <small className="text-xs text-gray-400">{s.label}</small>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          ["", "Tất cả"],
          ["new", "🆕 Mới"],
          ["contacted", "📞 Đã liên hệ"],
          ["closed", "✅ Đóng"],
        ].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setFilterStatus(v)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border-[1.5px] transition-all ${filterStatus === v ? "bg-green-600 border-green-600 text-white" : "bg-white border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600"}`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-[3px] border-gray-300 border-t-green-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {[
                  "Họ tên",
                  "Liên hệ",
                  "Đơn vị",
                  "Nội dung",
                  "Trạng thái",
                  "Thời gian",
                  "Thao tác",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-sm text-gray-400"
                  >
                    Không có liên hệ nào
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setDetail(c)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0 uppercase">
                          {c.name?.[0]}
                        </div>
                        <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-blue-600">{c.email}</p>
                      <p className="text-xs text-gray-500">{c.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-[120px] truncate">
                      {c.company || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 max-w-[180px] truncate">
                      {c.message || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${STATUS_BADGE[c.status]}`}
                      >
                        {STATUS_LABEL[c.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDetail(c)}
                          className="px-3 py-1.5 rounded-full border-2 border-green-600 text-green-600 text-xs font-semibold hover:bg-green-600 hover:text-white transition-all whitespace-nowrap"
                        >
                          👁️ Xem
                        </button>
                        <button
                          onClick={() => setConfirm(c.id)}
                          className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-600 hover:text-white transition-all"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {detail && (
        <ContactDetail
          contact={detail}
          onClose={() => setDetail(null)}
          onUpdate={() => {
            load();
            showToast("Đã cập nhật!");
          }}
        />
      )}
      {confirm && (
        <Confirm
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
          message="Xóa thông tin liên hệ này?"
        />
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN ADMIN
══════════════════════════════════════════════════════ */
export default function Admin() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("admin_token"));
  const [section, setSection] = useState("articles");
  const [sideOpen, setSideOpen] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Topbar ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm h-16 flex items-center px-4 gap-3">
        <button
          onClick={() => setSideOpen((o) => !o)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors shrink-0"
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <rect y="0" width="18" height="2" rx="1" fill="currentColor" />
            <rect y="6" width="18" height="2" rx="1" fill="currentColor" />
            <rect y="12" width="18" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
        <div className="flex items-center gap-2 flex-1">
          <img
            src="/Logo.jpg"
            alt="Vận hành số - Chuyển đổi xanh"
            className="h-10 w-auto object-contain"
          />
          <div className="hidden sm:block">
            <strong className="block text-[13px] font-extrabold text-gray-900">
              Digital Transformation
            </strong>
            <small className="text-[11px] text-gray-400">Admin Dashboard</small>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            className="px-4 py-1.5 rounded-full border-2 border-green-600 text-green-600 text-sm font-semibold hover:bg-green-50 transition-colors hidden sm:inline-flex"
          >
            🌐 Trang chủ
          </a>
          <button
            onClick={() => {
              localStorage.removeItem("admin_token");
              setAuthed(false);
            }}
            className="px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ── */}
        <aside
          className={`${sideOpen ? "w-56" : "w-0 overflow-hidden"} shrink-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-200`}
        >
          <nav className="flex flex-col gap-1 p-3 pt-4 flex-1">
            {NAV.map((n) => (
              <button
                key={n.key}
                onClick={() => setSection(n.key)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold w-full text-left transition-all ${section === n.key ? "bg-green-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <span className="text-base shrink-0">{n.icon}</span>
                <span className="whitespace-nowrap">{n.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 text-center">
              v1.0.0 · MongoDB Atlas
            </p>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-gray-400">Admin</span>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-semibold text-gray-900">
              {NAV.find((n) => n.key === section)?.icon}{" "}
              {NAV.find((n) => n.key === section)?.label}
            </span>
          </div>

          {section === "articles" && <ArticlesSection showToast={showToast} />}
          {section === "banners" && <BannersSection showToast={showToast} />}
          {section === "contacts" && <ContactsSection showToast={showToast} />}
        </main>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
