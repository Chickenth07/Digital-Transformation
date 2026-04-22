import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import ArticleCard from "../components/ArticleCard";

const CATEGORIES = [
  { value: "", label: "Tất cả" },
  { value: "kien-thuc-toa-nha", label: "Kiến thức tòa nhà" },
  { value: "chuyen-doi-xanh", label: "Chuyển đổi xanh" },
];

export default function NewsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const cat    = searchParams.get("category") || "";
  const search = searchParams.get("q") || "";

  const [articles, setArticles]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [localSearch, setLocalSearch] = useState(search);

  // Fetch khi cat hoặc search (từ URL) thay đổi
  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (cat)    p.append("category", cat);
    if (search) p.append("q", search);
    api
      .get(`/articles?${p}`)
      .then((r) => setArticles(r.data.articles))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [cat, search]);

  const handleCat = (value) => {
    const next = new URLSearchParams();
    if (value)  next.set("category", value);
    if (search) next.set("q", search);
    setSearchParams(next, { replace: true });
  };

  const handleSearch = (value) => {
    setLocalSearch(value);
    const next = new URLSearchParams();
    if (cat)   next.set("category", cat);
    if (value) next.set("q", value);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => handleCat(c.value)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border-[1.5px] transition-all duration-200 ${
                  cat === c.value
                    ? "bg-green-600 border-green-600 text-white"
                    : "bg-white border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-white border-[1.5px] border-gray-300 focus-within:border-green-500 rounded-full px-4 py-2 min-w-[260px] transition-colors">
            <span className="text-sm">🔍</span>
            <input
              className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder:text-gray-400"
              placeholder="Tìm kiếm bài viết…"
              value={localSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {localSearch && (
              <button
                onClick={() => handleSearch("")}
                className="text-xs text-gray-400 hover:text-gray-700 pl-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-[3px] border-gray-300 border-t-green-600 rounded-full animate-spin-slow" />
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-gray-400">
            <span className="text-5xl">🔍</span>
            <p>Không tìm thấy bài viết nào.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-5">
              {articles.length} bài viết
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
