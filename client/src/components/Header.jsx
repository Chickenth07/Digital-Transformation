import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Tin tức',   href: '/tin-tuc' },
  { label: 'Giải pháp', href: '/#solutions' },
  { label: 'Sản phẩm',  href: '/#product' },
  { label: 'Về chúng tôi', href: '/#about' },
  { label: 'Liên hệ',   href: '/#contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`sticky top-0 z-50 h-[72px] flex items-center transition-all duration-300 ${
      scrolled
        ? 'bg-white/97 border-b border-gray-200 shadow-md backdrop-blur-md'
        : 'bg-white/85 backdrop-blur-md'
    }`}>
      <div className="max-w-[1200px] mx-auto px-6 w-full flex items-center gap-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="text-3xl">🌿</span>
          <div>
            <span className="block font-[family-name:var(--font-display)] text-[15px] font-extrabold text-gray-900 leading-tight tracking-tight">
              Digital Transformation
            </span>
            <span className="block text-[10px] font-semibold text-green-600 uppercase tracking-widest">
              Smart · Green · Building
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {NAV.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                pathname === href
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3 ml-auto">
          <a
            href="/#contact"
            className="hidden lg:inline-flex items-center px-5 py-2 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors duration-200 shadow-sm"
          >
            Đăng ký demo
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden flex flex-col gap-[5px] p-1 rounded"
            aria-label="menu"
          >
            <span className={`block w-5.5 h-0.5 bg-gray-800 rounded transition-all duration-300 origin-center ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block w-5.5 h-0.5 bg-gray-800 rounded transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5.5 h-0.5 bg-gray-800 rounded transition-all duration-300 origin-center ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden absolute top-[72px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg flex flex-col transition-all duration-200 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none -translate-y-2'
      }`}>
        {NAV.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="px-6 py-3 text-[15px] font-medium text-gray-700 border-b border-gray-100 hover:text-green-600 hover:bg-gray-50 transition-colors"
          >
            {label}
          </a>
        ))}
        <a href="/#contact" className="mx-6 my-3 text-center px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-semibold">
          Đăng ký demo
        </a>
      </div>
    </header>
  );
}
