export default function Footer() {
  const social = [
    {
      label: "Facebook",
      icon: (
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      ),
    },
    {
      label: "LinkedIn",
      icon: (
        <>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </>
      ),
    },
    {
      label: "YouTube",
      icon: (
        <>
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
          <polygon
            fill="white"
            points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
          />
        </>
      ),
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-[1200px] mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <img
              src="/Logo.jpg"
              alt="Vận hành số - Chuyển đổi xanh"
              className="h-10 w-auto object-contain"
            />
            <div>
              <strong className="block text-[15px] font-extrabold text-white font-[family-name:var(--font-display)]">
                Vận hành số
              </strong>
              <small className="text-[10px] font-semibold text-green-500 uppercase tracking-widest">
                Chuyển đổi xanh
              </small>
            </div>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            Nền tảng vận hành thông minh & bền vững cho tòa nhà hiện đại Việt
            Nam. Tối ưu chi phí, giảm phát thải, nâng cao trải nghiệm cư dân.
          </p>
          <div className="flex gap-3">
            {social.map(({ label, icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/8 text-gray-400 hover:bg-green-600 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="17"
                  height="17"
                >
                  {icon}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Solutions */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
            Giải pháp
          </h4>
          <ul className="space-y-2.5">
            {["Vận hành số", "Vận hành xanh", "AI phân tích năng lượng"].map(
              (t) => (
                <li key={t}>
                  <a
                    href="/#solutions"
                    className="text-sm text-gray-500 hover:text-green-500 transition-colors"
                  >
                    {t}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
            Tổ chức
          </h4>
          <ul className="space-y-2.5">
            {[
              ["Về chúng tôi", "/#about"],
              ["Kiến thức", "/tin-tuc"],
              ["Liên hệ", "/#contact"],
            ].map(([t, h]) => (
              <li key={t}>
                <a
                  href={h}
                  className="text-sm text-gray-500 hover:text-green-500 transition-colors"
                >
                  {t}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
            Liên hệ
          </h4>
          <div className="space-y-2 text-sm text-gray-500">
            <p>📍 Tầng 18, Center Building, 01 Nguyễn Huy Tưởng, Hà Nội</p>
            <p>
              📞{" "}
              <a
                href="tel:0918650033"
                className="hover:text-green-500 transition-colors"
              >
                0918.650.033
              </a>
            </p>
            <p>
              ✉️{" "}
              <a
                href="mailto:info@digitaltransformation.vn"
                className="hover:text-green-500 transition-colors"
              >
                info@digital…vn
              </a>
            </p>
          </div>
          <div className="mt-4">
            <span className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold text-green-500 border border-green-800 bg-green-900/20">
              🌱 Net Zero 2050
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 py-4">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-600">
          <span>© 2026 Vận hành số · Chuyển đổi xanh. Bảo lưu mọi quyền.</span>
          <span>Vận hành thông minh – Bền vững tương lai</span>
        </div>
      </div>
    </footer>
  );
}
