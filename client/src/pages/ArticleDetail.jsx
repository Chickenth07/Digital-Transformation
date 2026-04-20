import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const BADGE = {
  'chuyen-nganh': 'bg-green-100 text-green-700',
  'noi-bo':       'bg-amber-100 text-amber-700',
  'bao-chi':      'bg-blue-100 text-blue-700',
  'du-an':        'bg-red-100 text-red-700',
};

function timeAgo(s) {
  const d = Math.floor((Date.now() - new Date(s)) / 86400000);
  if (d === 0) return 'Hôm nay';
  if (d === 1) return 'Hôm qua';
  if (d < 30)  return `${d} ngày trước`;
  const m = Math.floor(d/30);
  return m < 12 ? `${m} tháng trước` : `${Math.floor(m/12)} năm trước`;
}

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/articles/${id}`)
      .then(r => {
        setArticle(r.data);
        return api.get(`/articles?category=${r.data.category}&limit=4`);
      })
      .then(r => setRelated(r.data.articles.filter(a => a.id !== id).slice(0,3)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-10 h-10 border-[3px] border-gray-300 border-t-green-600 rounded-full animate-spin-slow"/>
    </div>
  );

  if (!article) return (
    <div className="flex flex-col items-center justify-center gap-5 py-32 text-center">
      <span className="text-6xl">📄</span>
      <h2 className="text-2xl font-bold text-gray-900">Không tìm thấy bài viết</h2>
      <Link to="/" className="px-6 py-2.5 rounded-full bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors">
        Về trang chủ
      </Link>
    </div>
  );

  const badge = BADGE[article.category] || 'bg-green-100 text-green-700';

  return (
    <div className="min-h-screen">

      {/* Layout */}
      <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">

        {/* Article */}
        <article>
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${badge}`}>
              {article.categoryLabel}
            </span>
            <span className="text-xs text-gray-400">🕐 {timeAgo(article.publishedAt)}</span>
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-2xl lg:text-4xl font-extrabold text-gray-900 leading-snug mb-5">
            {article.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center text-white font-bold text-base uppercase shrink-0">
              {article.author?.[0]}
            </div>
            <div>
              <strong className="block text-sm text-gray-900">{article.author}</strong>
              <small className="text-xs text-gray-400">
                {new Date(article.publishedAt).toLocaleDateString('vi-VN', { year:'numeric', month:'long', day:'numeric' })}
              </small>
            </div>
          </div>

          {/* Excerpt */}
          <p className="text-base text-gray-700 leading-relaxed italic bg-green-50 border-l-4 border-green-500 px-5 py-4 rounded-r-xl mb-6">
            {article.excerpt}
          </p>

          <hr className="border-gray-200 mb-6"/>

          {/* Body */}
          <div className="prose text-gray-700" dangerouslySetInnerHTML={{ __html: article.content }}/>

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {article.tags.map(t => (
                <span key={t} className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">#{t}</span>
              ))}
            </div>
          )}

          {/* Back links */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <Link to="/" className="px-4 py-2 rounded-full border-2 border-green-600 text-green-600 text-sm font-semibold hover:bg-green-600 hover:text-white transition-all">
              ← Trang chủ
            </Link>
            <Link to="/tin-tuc" className="px-4 py-2 rounded-full border-2 border-green-600 text-green-600 text-sm font-semibold hover:bg-green-600 hover:text-white transition-all">
              Tất cả bài viết
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          {/* CTA card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
            <h3 className="text-[15px] font-bold text-gray-900 mb-2">🌿 Building Care</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Nền tảng vận hành thông minh & xanh cho tòa nhà hiện đại.
            </p>
            <a href="/#contact"
              className="inline-flex items-center px-5 py-2 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors">
              Đăng ký demo
            </a>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-[15px] font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Bài viết liên quan
              </h3>
              <div className="flex flex-col gap-4">
                {related.map(a => (
                  <Link to={`/bai-viet/${a.id}`} key={a.id}
                    className="flex gap-3 items-start hover:opacity-75 transition-opacity">
                    <img src={a.image} alt={a.title} className="w-16 h-12 object-cover rounded-lg shrink-0"/>
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${BADGE[a.category] || 'bg-green-100 text-green-700'} mb-1`}>
                        {a.categoryLabel}
                      </span>
                      <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">{a.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
