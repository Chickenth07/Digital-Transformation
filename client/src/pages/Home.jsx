import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ArticleCard, { ArticleCardFeatured } from '../components/ArticleCard';

/* ─────────────────────────── Hero ─────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-linear-to-br from-slate-900 via-green-950 to-slate-900">
      {/* Animated blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-blob absolute w-[600px] h-[600px] -top-40 -right-20 rounded-full bg-gradient-radial from-green-600 to-sky-600 opacity-20 blur-[60px]" />
        <div className="animate-blob-2 absolute w-[400px] h-[400px] -bottom-20 left-[10%] rounded-full bg-gradient-radial from-sky-500 to-violet-600 opacity-20 blur-[60px]" />
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-24">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-800 bg-green-900/40 text-green-300 text-[13px] font-semibold mb-6">
          <span>🌱</span> Nền tảng vận hành xanh – thông minh #1 Việt Nam
        </div>

        <h1 className="font-[family-name:var(--font-display)] text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
          Chuyển đổi số &<br/>
          <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            Vận hành Xanh
          </span>
        </h1>

        <p className="text-lg text-white/70 max-w-lg leading-relaxed mb-9">
          Giúp tòa nhà tối ưu chi phí đến <strong className="text-green-400">30%</strong>,
          giảm phát thải carbon, và nâng cao trải nghiệm cư dân thông qua công nghệ IoT thông minh.
        </p>

        <div className="flex gap-4 flex-wrap mb-14">
          <a href="#product"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-900/40">
            Khám phá Building Care
          </a>
          <a href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/30 text-white font-semibold text-sm backdrop-blur-sm hover:border-white/60 hover:bg-white/10 transition-all">
            Đăng ký tư vấn miễn phí
          </a>
        </div>

        <div className="flex flex-wrap gap-10">
          {[['200+','Tòa nhà quản lý'],['30%','Tiết kiệm năng lượng'],['5★','Đánh giá từ cư dân'],['0','Phát thải Net Zero 2050']].map(([n,l]) => (
            <div key={l}>
              <strong className="block font-[family-name:var(--font-display)] text-3xl font-extrabold text-white">{n}</strong>
              <span className="text-xs text-white/50 mt-1">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── About ────────────────────────────────────── */
function About() {
  const pillars = [
    { icon:'🎯', title:'Tầm nhìn',    desc:'Thúc đẩy vận hành thông minh và bền vững cho mọi tòa nhà tại Việt Nam đến 2030.' },
    { icon:'🚀', title:'Sứ mệnh',     desc:'Giúp ban quản lý tối ưu chi phí, giảm phát thải và nâng cao chất lượng sống.' },
    { icon:'🌿', title:'Câu chuyện',  desc:'Bắt đầu từ bài toán bất động sản xanh: vừa tiết kiệm vừa thân thiện môi trường.' },
  ];
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <div className="relative">
          <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&q=80"
            alt="Building" className="w-full h-[440px] object-cover rounded-3xl shadow-xl"/>
          <div className="absolute -bottom-5 -right-5 flex items-center gap-3 bg-white rounded-2xl px-5 py-3.5 shadow-xl">
            <span className="text-3xl">🏆</span>
            <div>
              <strong className="block text-sm font-bold text-gray-900">Top 1</strong>
              <small className="text-xs text-gray-500">Nền tảng xanh 2025</small>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-3">
            🧑‍💼 Về chúng tôi
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            Vì sao chúng tôi<br/>làm điều này?
          </h2>
          <p className="text-base text-gray-600 leading-relaxed mb-7">
            Chúng tôi tin rằng mọi tòa nhà đều có thể vừa <em>thông minh</em> vừa <em>bền vững</em> —
            không cần phải chọn một trong hai.
          </p>
          <div className="flex flex-col gap-4">
            {pillars.map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 items-start p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors group">
                <div className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl bg-white shadow-sm text-2xl">
                  {icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-0.5">{title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Solutions ────────────────────────────────── */
function Solutions() {
  const cards = [
    { icon:'📱', title:'Vận hành số',    desc:'Số hóa báo cáo sự cố, quản lý nhân sự, tương tác cư dân qua app di động.' },
    { icon:'🌱', title:'Vận hành xanh',  desc:'Theo dõi carbon, hỗ trợ chứng nhận EDGE/LEED, tối ưu năng lượng tự động.' },
    { icon:'🤖', title:'AI & Dữ liệu',   desc:'Phân tích tiêu thụ năng lượng bằng AI, phát hiện bất thường theo thời gian thực.' },
    { icon:'🔔', title:'IoT Giám sát',   desc:'Kết nối BMS, camera AI — giám sát toàn diện 24/7 từ một dashboard.' },
  ];
  return (
    <section id="solutions" className="py-20 bg-gradient-to-b from-slate-50 to-green-50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-3">
            ⚡ Giải pháp
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">
            Chuyển đổi kép: Số & Xanh
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Tích hợp IoT, AI và tiêu chuẩn xanh vào một nền tảng quản lý thống nhất.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map(({ icon, title, desc }) => (
            <div key={title}
              className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 border-transparent hover:border-green-500 group">
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="text-[15px] font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── News section ──────────────────────────────── */
const CATEGORIES = [
  { value: '',             label: 'Tất cả' },
  { value: 'chuyen-nganh', label: 'Chuyên ngành' },
  { value: 'bao-chi',      label: 'Báo chí' },
  { value: 'du-an',        label: 'Blog Dự án' },
  { value: 'noi-bo',       label: 'Nội bộ' },
];

function NewsSection({ articles, loading }) {
  const [cat,    setCat]    = useState('');
  const [search, setSearch] = useState('');

  const list = articles.filter(a => {
    const okCat = !cat || a.category === cat;
    const q = search.toLowerCase();
    const okQ = !q || a.title.toLowerCase().includes(q) || a.excerpt?.toLowerCase().includes(q);
    return okCat && okQ;
  });
  const featured = list.filter(a => a.featured);
  const rest     = list.filter(a => !a.featured);

  return (
    <section id="news" className="py-20 bg-slate-50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-3">
            📰 Kiến thức
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">
            Tin tức & Chuyên ngành
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Cập nhật xu hướng vận hành thông minh, chuyển đổi xanh và công nghệ BĐS.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-9">
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
          <div className="flex items-center gap-2 bg-white border-[1.5px] border-gray-300 focus-within:border-green-500 rounded-full px-4 py-2 min-w-[240px] transition-colors">
            <span className="text-sm">🔍</span>
            <input className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder:text-gray-400"
              placeholder="Tìm kiếm bài viết…" value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-[3px] border-gray-300 border-t-green-600 rounded-full animate-spin-slow"/>
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-gray-400">
            <span className="text-5xl">🔍</span>
            <p>Không tìm thấy bài viết phù hợp.</p>
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 mb-6">
                <ArticleCardFeatured article={featured[0]} />
                <div className="flex flex-col gap-6">
                  {featured.slice(1,3).map(a => <ArticleCard key={a.id} article={a}/>)}
                </div>
              </div>
            )}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {rest.map(a => <ArticleCard key={a.id} article={a}/>)}
              </div>
            )}
          </>
        )}

        <div className="text-center mt-6">
          <Link to="/tin-tuc"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-green-600 text-green-600 font-semibold text-sm hover:bg-green-600 hover:text-white transition-all duration-200">
            Xem tất cả bài viết →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Product ──────────────────────────────────── */
function Product() {
  const features = [
    { icon:'⚡', title:'Tiết kiệm 30% năng lượng',    desc:'Tự động điều chỉnh điện, nước, HVAC dựa trên AI.' },
    { icon:'📊', title:'Dashboard thời gian thực',     desc:'Mọi chỉ số vận hành trên một màn hình duy nhất.' },
    { icon:'🔔', title:'Cảnh báo thông minh',          desc:'Phát hiện sự cố sớm, thông báo tức thì tới đội vận hành.' },
    { icon:'📱', title:'App cư dân',                   desc:'Gửi yêu cầu, theo dõi tiến độ, thanh toán dịch vụ dễ dàng.' },
    { icon:'📈', title:'Báo cáo tự động',              desc:'Xuất báo cáo KPI hàng tuần, tháng cho chủ đầu tư.' },
    { icon:'🌿', title:'Carbon Dashboard',             desc:'Theo dõi CO₂, hỗ trợ chứng nhận xanh quốc tế.' },
  ];
  return (
    <section id="product" className="py-20 bg-linear-to-br from-slate-900 via-green-950 to-slate-900">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-12">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-green-900/40 border border-green-800 text-green-300 text-xs font-bold uppercase tracking-wider mb-3">
              🏢 Sản phẩm
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl font-extrabold text-white mb-3">
              Building Care
            </h2>
            <p className="text-white/60 max-w-md leading-relaxed mb-6">
              Nền tảng quản lý vận hành thông minh all-in-one. Smart & Green — không phải chọn một.
            </p>
            <a href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-900/40">
              🚀 Đăng ký demo miễn phí
            </a>
          </div>
          <div className="shrink-0 flex flex-col items-center gap-2 bg-white/8 border border-white/15 rounded-3xl px-10 py-7 backdrop-blur-sm text-center">
            <span className="text-5xl">🌿</span>
            <strong className="text-lg font-extrabold text-green-400">Smart + Green</strong>
            <small className="text-xs text-white/50">Điểm khác biệt duy nhất</small>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon, title, desc }) => (
            <div key={title}
              className="flex gap-4 items-start p-5 rounded-xl bg-white/6 border border-white/10 hover:bg-white/10 hover:border-green-700/50 transition-all duration-200">
              <div className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl bg-green-900/40 text-2xl">{icon}</div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
                <p className="text-xs text-white/55 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Contact ──────────────────────────────────── */
function Contact() {
  const [form,   setForm]   = useState({ name:'', email:'', phone:'', company:'', message:'' });
  const [status, setStatus] = useState('');

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/contact', form);
      setStatus('success');
      setForm({ name:'', email:'', phone:'', company:'', message:'' });
    } catch { setStatus('error'); }
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border-[1.5px] border-gray-300 focus:border-green-500 outline-none text-sm text-gray-800 bg-white transition-colors font-[family-name:var(--font-sans)]';

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-3">
            📞 Liên hệ
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
            Bắt đầu hành trình<br/>xanh hóa tòa nhà
          </h2>
          <p className="text-gray-500 leading-relaxed mb-7">
            Đăng ký tư vấn miễn phí — chuyên gia của chúng tôi sẽ phân tích hiện trạng và
            đề xuất lộ trình chuyển đổi phù hợp với ngân sách của bạn.
          </p>
          <div className="flex flex-col gap-3 text-sm text-gray-600">
            <p>📍 Tầng 18, Center Building, 01 Nguyễn Huy Tưởng, Hà Nội</p>
            <p>📞 <a href="tel:0918650033" className="text-green-600 font-medium">0918.650.033</a></p>
            <p>✉️ <a href="mailto:info@digitaltransformation.vn" className="text-green-600 font-medium">info@digitaltransformation.vn</a></p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-3xl p-8">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <input name="name" value={form.name} onChange={onChange} placeholder="Họ & tên *" required className={inputCls}/>
              <input name="company" value={form.company} onChange={onChange} placeholder="Tên tòa nhà / đơn vị" className={inputCls}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input name="email" type="email" value={form.email} onChange={onChange} placeholder="Email *" required className={inputCls}/>
              <input name="phone" type="tel" value={form.phone} onChange={onChange} placeholder="Số điện thoại" className={inputCls}/>
            </div>
            <textarea name="message" value={form.message} onChange={onChange}
              placeholder="Mô tả nhu cầu của bạn…" rows={4} className={`${inputCls} resize-y`}/>
            <button type="submit" disabled={status==='sending'}
              className="px-6 py-3 rounded-full bg-green-600 text-white font-semibold text-sm hover:bg-green-700 disabled:opacity-60 transition-colors">
              {status === 'sending' ? 'Đang gửi…' : '✉️ Gửi đăng ký tư vấn'}
            </button>
            {status === 'success' && (
              <div className="px-4 py-3 rounded-xl bg-green-100 text-green-700 text-sm font-medium">
                ✅ Đã nhận! Chúng tôi sẽ liên hệ sớm nhất.
              </div>
            )}
            {status === 'error' && (
              <div className="px-4 py-3 rounded-xl bg-red-100 text-red-700 text-sm font-medium">
                ❌ Có lỗi xảy ra. Vui lòng thử lại.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Home page ────────────────────────────────── */
export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get('/articles')
      .then(r => setArticles(r.data.articles))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Hero />
      <About />
      <Solutions />
      <NewsSection articles={articles} loading={loading} />
      <Product />
      <Contact />
    </div>
  );
}
