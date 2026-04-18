import { useState, useEffect } from 'react';
import api from '../api';
import ArticleCard from '../components/ArticleCard';

const CATEGORIES = [
  { value: '',             label: 'Tất cả' },
  { value: 'chuyen-nganh', label: 'Chuyên ngành' },
  { value: 'bao-chi',      label: 'Báo chí' },
  { value: 'du-an',        label: 'Blog Dự án' },
  { value: 'noi-bo',       label: 'Nội bộ' },
];

export default function NewsList() {
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [cat,      setCat]      = useState('');
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (cat)    p.append('category', cat);
    if (search) p.append('q', search);
    api.get(`/articles?${p}`)
      .then(r => setArticles(r.data.articles))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [cat, search]);

  return (
    <div className="min-h-screen">
      {/* Page hero */}
      <div className="bg-linear-to-br from-slate-900 via-green-950 to-slate-900 py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <span className="inline-block px-3 py-1 rounded-full bg-green-900/40 border border-green-800 text-green-300 text-xs font-bold uppercase tracking-wider mb-3">
            📰 Kiến thức
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-4xl lg:text-5xl font-extrabold text-white mb-3">
            Tin tức & Chuyên ngành
          </h1>
          <p className="text-white/60 text-base">
            Cập nhật xu hướng vận hành thông minh, chuyển đổi xanh trong bất động sản.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c.value} onClick={() => setCat(c.value)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border-[1.5px] transition-all duration-200 ${
                  cat === c.value
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'bg-white border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600'
                }`}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-white border-[1.5px] border-gray-300 focus-within:border-green-500 rounded-full px-4 py-2 min-w-[260px] transition-colors">
            <span className="text-sm">🔍</span>
            <input className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder:text-gray-400"
              placeholder="Tìm kiếm bài viết…" value={search} onChange={e => setSearch(e.target.value)}/>
            {search && (
              <button onClick={() => setSearch('')} className="text-xs text-gray-400 hover:text-gray-700 pl-1">✕</button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-[3px] border-gray-300 border-t-green-600 rounded-full animate-spin-slow"/>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-gray-400">
            <span className="text-5xl">🔍</span>
            <p>Không tìm thấy bài viết nào.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-5">{articles.length} bài viết</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(a => <ArticleCard key={a.id} article={a}/>)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
