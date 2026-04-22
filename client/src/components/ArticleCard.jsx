import { Link } from "react-router-dom";

const BADGE = {
  "kien-thuc-toa-nha": "bg-green-100 text-green-700",
  "chuyen-doi-xanh":   "bg-emerald-100 text-emerald-700",
};

function timeAgo(dateStr) {
  const d = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (d === 0) return "Hôm nay";
  if (d === 1) return "Hôm qua";
  if (d < 30) return `${d} ngày trước`;
  const m = Math.floor(d / 30);
  return m < 12 ? `${m} tháng trước` : `${Math.floor(m / 12)} năm trước`;
}

export function ArticleCardFeatured({ article }) {
  const badge = BADGE[article.category] || "bg-green-100 text-green-700";
  return (
    <Link
      to={`/bai-viet/${article.id}`}
      className="block rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative h-[440px] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-7 flex flex-col gap-2.5">
          <span
            className={`self-start px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${badge}`}
          >
            {article.categoryLabel}
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-white text-xl lg:text-2xl font-extrabold leading-snug line-clamp-2">
            {article.title}
          </h2>
          <p className="text-white/75 text-sm leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex gap-4 text-white/60 text-xs">
            <span>✍️ {article.author}</span>
            <span>🕐 {timeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ArticleCard({ article }) {
  const badge = BADGE[article.category] || "bg-green-100 text-green-700";
  return (
    <Link
      to={`/bai-viet/${article.id}`}
      className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="h-48 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-2 p-5 flex-1">
        <span
          className={`self-start px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${badge}`}
        >
          {article.categoryLabel}
        </span>
        <h3 className="font-[family-name:var(--font-display)] text-base font-bold text-gray-900 leading-snug line-clamp-2 flex-1">
          {article.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>
        <div className="flex justify-between text-xs text-gray-400 pt-2.5 mt-auto border-t border-gray-100">
          <span>{article.author}</span>
          <span>{timeAgo(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
