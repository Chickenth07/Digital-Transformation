export default function About() {
  const pillars = [
    { icon: '🎯', title: 'Tầm nhìn', desc: 'Thúc đẩy vận hành thông minh và bền vững cho mọi tòa nhà tại Việt Nam đến 2030.' },
    { icon: '🚀', title: 'Sứ mệnh', desc: 'Giúp ban quản lý tối ưu chi phí, giảm phát thải và nâng cao chất lượng sống.' },
    { icon: '🌿', title: 'Câu chuyện', desc: 'Bắt đầu từ bài toán bất động sản xanh: vừa tiết kiệm vừa thân thiện môi trường.' },
  ];

  const solutions = [
    { icon: '📱', title: 'Vận hành số', desc: 'Số hóa báo cáo sự cố, quản lý nhân sự, tương tác cư dân qua app di động.' },
    { icon: '🌱', title: 'Vận hành xanh', desc: 'Theo dõi carbon, hỗ trợ chứng nhận EDGE/LEED, tối ưu năng lượng tự động.' },
    { icon: '🤖', title: 'AI & Dữ liệu', desc: 'Phân tích tiêu thụ năng lượng bằng AI, phát hiện bất thường theo thời gian thực.' },
    { icon: '🔔', title: 'IoT Giám sát', desc: 'Kết nối BMS, camera AI — giám sát toàn diện 24/7 từ một dashboard.' },
  ];

  const stats = [
    { value: '200+', label: 'Tòa nhà đã triển khai' },
    { value: '30%', label: 'Tiết kiệm năng lượng trung bình' },
    { value: '50+', label: 'Chuyên gia vận hành' },
    { value: '5★', label: 'Đánh giá từ khách hàng' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-slate-50">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-4">
              🧑‍💼 Về chúng tôi
            </span>
            <h1 className="font-[family-name:var(--font-display)] text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              Vì sao chúng tôi<br />
              <span className="text-green-600">làm điều này?</span>
            </h1>
            <p className="text-base text-gray-600 leading-relaxed mb-8">
              Chúng tôi tin rằng mọi tòa nhà đều có thể vừa <em>thông minh</em> vừa <em>bền vững</em> — không cần phải chọn một trong hai. Digital Transformation ra đời để hiện thực hóa điều đó.
            </p>
            <a
              href="/lien-he"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
            >
              Liên hệ tư vấn →
            </a>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&q=80"
              alt="Building"
              className="w-full h-[440px] object-cover rounded-3xl shadow-xl"
            />
            <div className="absolute -bottom-5 -right-5 flex items-center gap-3 bg-white rounded-2xl px-5 py-3.5 shadow-xl">
              <span className="text-3xl">🏆</span>
              <div>
                <strong className="block text-sm font-bold text-gray-900">Top 1</strong>
                <small className="text-xs text-gray-500">Nền tảng xanh 2025</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-[family-name:var(--font-display)] text-4xl font-extrabold text-green-600 mb-1">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-display)] text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">
              Giá trị cốt lõi
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">Ba trụ cột định hướng mọi hoạt động của chúng tôi.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map(({ icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 border-transparent hover:border-green-500">
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-green-50 text-3xl shadow-sm">{icon}</div>
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50">
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
            {solutions.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 border-transparent hover:border-green-500"
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
