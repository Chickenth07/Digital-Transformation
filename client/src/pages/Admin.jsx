import { useState, useEffect } from 'react';
import api from '../api';

const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-300 focus:border-green-500 outline-none text-sm text-gray-800 bg-white transition-colors font-[family-name:var(--font-sans)]';
const labelCls = 'block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5';

const CATS = [
  { value: 'chuyen-nganh', label: 'Chuyên ngành' },
  { value: 'bao-chi',      label: 'Báo chí' },
  { value: 'du-an',        label: 'Blog Dự án' },
  { value: 'noi-bo',       label: 'Nội bộ' },
];
const BADGE = {
  'chuyen-nganh': 'bg-green-100 text-green-700',
  'noi-bo':       'bg-amber-100 text-amber-700',
  'bao-chi':      'bg-blue-100 text-blue-700',
  'du-an':        'bg-red-100 text-red-700',
};

/* ─── Login ─────────────────────────────────────────────────────────────── */
function Login({ onLogin }) {
  const [pw,      setPw]      = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const r = await api.post('/auth/login', { password: pw });
      localStorage.setItem('admin_token', r.data.token);
      onLogin();
    } catch { setError('Sai mật khẩu. Hãy thử lại.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-green-950 to-slate-900 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-sm text-center">
        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="text-4xl">🌿</span>
          <strong className="font-[family-name:var(--font-display)] text-base font-extrabold text-gray-900">Admin Dashboard</strong>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Đăng nhập quản trị</h2>
        <p className="text-sm text-gray-400 mb-6">Khu vực này chỉ dành cho quản trị viên.</p>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input type="password" value={pw} onChange={e => setPw(e.target.value)}
            placeholder="Nhập mật khẩu admin…" required autoFocus className={inputCls}/>
          {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <button type="submit" disabled={loading}
            className="px-6 py-3 rounded-full bg-green-600 text-white font-semibold text-sm hover:bg-green-700 disabled:opacity-60 transition-colors">
            {loading ? 'Đang kiểm tra…' : '🔐 Đăng nhập'}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-5">Mật khẩu demo: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-green-700">admin123</code></p>
      </div>
    </div>
  );
}

/* ─── Article Form Modal ─────────────────────────────────────────────────── */
function ArticleModal({ article, onSave, onClose }) {
  const isEdit = !!article;
  const [form, setForm] = useState({
    title:         article?.title         || '',
    category:      article?.category      || 'chuyen-nganh',
    categoryLabel: article?.categoryLabel || 'Chuyên ngành',
    excerpt:       article?.excerpt       || '',
    content:       article?.content       || '',
    image:         article?.image         || '',
    author:        article?.author        || 'Admin',
    featured:      article?.featured      || false,
    tags:          article?.tags?.join(', ') || '',
  });
  const [imgFile,  setImgFile]  = useState(null);
  const [preview,  setPreview]  = useState(article?.image || '');
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'category') {
      const cat = CATS.find(c => c.value === value);
      setForm(f => ({ ...f, category: value, categoryLabel: cat?.label || value }));
    } else {
      setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
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
    setSaving(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imgFile) fd.set('image', imgFile);
      const cfg = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (isEdit) await api.put(`/articles/${article.id}`, fd, cfg);
      else        await api.post('/articles', fd, cfg);
      onSave();
    } catch { setError('Lỗi khi lưu. Vui lòng thử lại.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">{isEdit ? '✏️ Chỉnh sửa bài viết' : '➕ Thêm bài viết mới'}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors text-base">✕</button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} className="overflow-y-auto p-6 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Tiêu đề *</label>
              <input name="title" value={form.title} onChange={onChange} required placeholder="Tiêu đề bài viết…" className={inputCls}/>
            </div>
            <div>
              <label className={labelCls}>Danh mục</label>
              <select name="category" value={form.category} onChange={onChange} className={inputCls}>
                {CATS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Tác giả</label>
              <input name="author" value={form.author} onChange={onChange} placeholder="Tên tác giả" className={inputCls}/>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Tóm tắt *</label>
              <textarea name="excerpt" value={form.excerpt} onChange={onChange} rows={2} required placeholder="Mô tả ngắn…" className={inputCls}/>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Nội dung (HTML) *</label>
              <textarea name="content" value={form.content} onChange={onChange} rows={7} required placeholder="<p>Nội dung...</p>" className={`${inputCls} resize-y`}/>
            </div>
            <div>
              <label className={labelCls}>Ảnh bìa</label>
              <input type="file" accept="image/*" onChange={onImg} className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-green-100 file:text-green-700 file:font-semibold hover:file:bg-green-200"/>
              {!imgFile && (
                <input name="image" value={form.image} onChange={onChange} placeholder="hoặc dán URL ảnh…" className={`${inputCls} mt-2`}/>
              )}
              {preview && <img src={preview} alt="preview" className="mt-2 w-full h-28 object-cover rounded-xl border border-gray-200"/>}
            </div>
            <div>
              <label className={labelCls}>Tags (phân cách bằng dấu phẩy)</label>
              <input name="tags" value={form.tags} onChange={onChange} placeholder="IoT, BMS, xanh" className={inputCls}/>
              <label className="flex items-center gap-2 mt-3 cursor-pointer">
                <input type="checkbox" name="featured" checked={form.featured} onChange={onChange} className="w-4 h-4 accent-green-600 rounded"/>
                <span className="text-sm text-gray-700 font-medium">Bài viết nổi bật (featured)</span>
              </label>
            </div>
          </div>

          {error && <p className="mt-4 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="px-5 py-2 rounded-full border-2 border-gray-300 text-gray-600 text-sm font-semibold hover:border-gray-400 transition-colors">
              Hủy
            </button>
            <button type="submit" disabled={saving}
              className="px-5 py-2 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors">
              {saving ? 'Đang lưu…' : (isEdit ? '💾 Cập nhật' : '➕ Thêm bài viết')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Admin Dashboard ────────────────────────────────────────────────────── */
export default function Admin() {
  const [authed,   setAuthed]   = useState(!!localStorage.getItem('admin_token'));
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [editing,  setEditing]  = useState(null);   // null | article | 'new'
  const [search,   setSearch]   = useState('');
  const [toast,    setToast]    = useState(null);
  const [confirm,  setConfirm]  = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetch = () => {
    setLoading(true);
    api.get('/articles')
      .then(r => setArticles(r.data.articles))
      .catch(() => showToast('Lỗi tải dữ liệu', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (authed) fetch(); }, [authed]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/articles/${id}`);
      showToast('Đã xóa bài viết!');
      fetch();
    } catch { showToast('Lỗi khi xóa!', 'error'); }
    setConfirm(null);
  };

  const handleSave = () => {
    setEditing(null);
    showToast(editing === 'new' ? 'Đã thêm bài viết!' : 'Đã cập nhật bài viết!');
    fetch();
  };

  if (!authed) return <Login onLogin={() => setAuthed(true)}/>;

  const filtered = articles.filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌿</span>
            <div>
              <strong className="block text-[14px] font-extrabold text-gray-900 font-[family-name:var(--font-display)]">
                Digital Transformation
              </strong>
              <small className="text-[11px] text-gray-400">Admin Dashboard</small>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank"
              className="px-4 py-1.5 rounded-full border-2 border-green-600 text-green-600 text-sm font-semibold hover:bg-green-50 transition-colors">
              🌐 Xem trang chủ
            </a>
            <button onClick={() => { localStorage.removeItem('admin_token'); setAuthed(false); }}
              className="px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors">
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {[
            { icon:'📄', label:'Tổng bài viết', val: articles.length },
            { icon:'⭐', label:'Bài nổi bật',   val: articles.filter(a => a.featured).length },
            { icon:'📁', label:'Danh mục',       val: [...new Set(articles.map(a => a.category))].length },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <strong className="block text-2xl font-extrabold text-gray-900">{s.val}</strong>
                <small className="text-xs text-gray-400">{s.label}</small>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2 bg-white border-[1.5px] border-gray-300 focus-within:border-green-500 rounded-full px-4 py-2 min-w-[280px] transition-colors">
            <span className="text-sm">🔍</span>
            <input className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder:text-gray-400"
              placeholder="Tìm bài viết…" value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
          <button onClick={() => setEditing('new')}
            className="px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm">
            ➕ Thêm bài viết
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-[3px] border-gray-300 border-t-green-600 rounded-full animate-spin-slow"/>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Ảnh','Tiêu đề','Danh mục','Tác giả','Ngày đăng','Nổi bật','Thao tác'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-12 text-center text-sm text-gray-400">Không có bài viết nào</td></tr>
                ) : (
                  filtered.map(a => (
                    <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <img src={a.image} alt="" className="w-16 h-11 object-cover rounded-lg"/>
                      </td>
                      <td className="px-4 py-3 max-w-[260px]">
                        <p className="text-sm font-semibold text-gray-900 truncate">{a.title}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{a.excerpt?.slice(0,60)}…</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${BADGE[a.category] || 'bg-green-100 text-green-700'}`}>
                          {a.categoryLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{a.author}</td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(a.publishedAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-4 py-3 text-center">{a.featured ? '⭐' : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => setEditing(a)}
                            className="px-3 py-1.5 rounded-full border-2 border-green-600 text-green-600 text-xs font-semibold hover:bg-green-600 hover:text-white transition-all whitespace-nowrap">
                            ✏️ Sửa
                          </button>
                          <button onClick={() => setConfirm(a.id)}
                            className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-600 hover:text-white transition-all">
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
      </div>

      {/* Modals */}
      {editing && (
        <ArticleModal
          article={editing === 'new' ? null : editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}

      {confirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">🗑️ Xác nhận xóa</h3>
            <p className="text-sm text-gray-500 mb-6">Bạn có chắc muốn xóa bài viết này? Không thể hoàn tác.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirm(null)}
                className="px-5 py-2 rounded-full border-2 border-gray-300 text-gray-600 text-sm font-semibold hover:border-gray-400 transition-colors">
                Hủy
              </button>
              <button onClick={() => handleDelete(confirm)}
                className="px-5 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-xl animate-slide-up z-50 ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
