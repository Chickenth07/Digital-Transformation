export default function BuildingCare() {
  const features = [
    { icon: '⚡', title: 'Tiết kiệm 30% năng lượng', desc: 'Tự động điều chỉnh điện, nước, HVAC dựa trên AI.' },
    { icon: '📊', title: 'Dashboard thời gian thực', desc: 'Mọi chỉ số vận hành trên một màn hình duy nhất.' },
    { icon: '🔔', title: 'Cảnh báo thông minh', desc: 'Phát hiện sự cố sớm, thông báo tức thì tới đội vận hành.' },
    { icon: '📱', title: 'App cư dân', desc: 'Gửi yêu cầu, theo dõi tiến độ, thanh toán dịch vụ dễ dàng.' },
    { icon: '📈', title: 'Báo cáo tự động', desc: 'Xuất báo cáo KPI hàng tuần, tháng cho chủ đầu tư.' },
    { icon: '🌿', title: 'Carbon Dashboard', desc: 'Theo dõi CO₂, hỗ trợ chứng nhận xanh quốc tế.' },
  ];

  const plans = [
    {
      name: 'Starter',
      price: 'Liên hệ',
      desc: 'Phù hợp cho tòa nhà vừa nhỏ dưới 200 căn hộ',
      features: ['Dashboard vận hành cơ bản', 'App cư dân', 'Báo cáo tháng', 'Hỗ trợ email'],
      highlight: false,
    },
    {
      name: 'Professional',
      price: 'Liên hệ',
      desc: 'Giải pháp đầy đủ cho ban quản lý chuyên nghiệp',
      features: ['Tất cả tính năng Starter', 'AI phân tích năng lượng', 'IoT giám sát 24/7', 'Carbon Dashboard', 'Hỗ trợ 24/7'],
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Tuỳ chỉnh',
      desc: 'Triển khai theo yêu cầu cho hệ thống nhiều tòa nhà',
      features: ['Tất cả tính năng Pro', 'Tích hợp BMS/ERP', 'API mở', 'Đào tạo chuyên sâu', 'SLA cam kết'],
      highlight: false,
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="py-20 bg-linear-to-br from-slate-900 via-green-950 to-slate-900">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-16">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-green-900/40 border border-green-800 text-green-300 text-xs font-bold uppercase tracking-wider mb-4">
                🏢 Sản phẩm
              </span>
              <h1 className="font-[family-name:var(--font-display)] text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                Building Care
              </h1>
              <p className="text-white/60 max-w-md leading-relaxed mb-8">
                Nền tảng quản lý vận hành thông minh all-in-one. Smart & Green — không phải chọn một.
              </p>
              <a
                href="/lien-he"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-900/40"
              >
                🚀 Đăng ký demo miễn phí
              </a>
            </div>
            <div className="shrink-0 flex flex-col items-center gap-3 bg-white/8 border border-white/15 rounded-3xl px-12 py-8 backdrop-blur-sm text-center">
              <img src="/Logo.jpg" alt="Building Care" className="h-12 w-auto object-contain" />
              <strong className="text-xl font-extrabold text-green-400">Smart + Green</strong>
              <small className="text-xs text-white/50">Điểm khác biệt duy nhất</small>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 items-start p-5 rounded-xl bg-white/6 border border-white/10 hover:bg-white/10 hover:border-green-700/50 transition-all duration-200"
              >
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

      {/* Pricing */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-3">
              💰 Gói dịch vụ
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">
              Chọn gói phù hợp
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">Linh hoạt theo quy mô và nhu cầu của từng tòa nhà.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(({ name, price, desc, features: f, highlight }) => (
              <div
                key={name}
                className={`rounded-2xl p-8 flex flex-col gap-5 transition-all duration-300 ${
                  highlight
                    ? 'bg-green-600 text-white shadow-2xl shadow-green-200 scale-105'
                    : 'bg-white shadow-sm hover:shadow-xl border border-gray-100'
                }`}
              >
                <div>
                  <h3 className={`text-xl font-extrabold mb-1 ${highlight ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
                  <p className={`text-2xl font-bold mb-2 ${highlight ? 'text-green-100' : 'text-green-600'}`}>{price}</p>
                  <p className={`text-sm ${highlight ? 'text-green-100' : 'text-gray-500'}`}>{desc}</p>
                </div>
                <ul className="flex flex-col gap-2.5 flex-1">
                  {f.map((item) => (
                    <li key={item} className={`flex items-center gap-2 text-sm ${highlight ? 'text-white' : 'text-gray-600'}`}>
                      <span className={`text-base ${highlight ? 'text-green-200' : 'text-green-500'}`}>✓</span> {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="/lien-he"
                  className={`block text-center py-2.5 rounded-full font-semibold text-sm transition-colors ${
                    highlight
                      ? 'bg-white text-green-600 hover:bg-green-50'
                      : 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
                  }`}
                >
                  Liên hệ ngay
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
