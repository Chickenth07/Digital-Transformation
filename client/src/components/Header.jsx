import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { label: 'Trang chủ',              href: '/' },
  { label: 'Giới thiệu',             href: '/gioi-thieu' },
  { label: 'Kiến thức QLVH toà nhà', href: '/tin-tuc?category=chuyen-nganh', full: 'Kiến thức quản lý vận hành toà nhà' },
  { label: 'Chuyển đổi xanh',        href: '/tin-tuc?category=du-an',        full: 'Chuyển đổi xanh trong vận hành' },
  { label: 'Liên hệ',                href: '/lien-he' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname, search } = useLocation();
  const [activeHref, setActiveHref] = useState('/');

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Tự động detect active khi url thay đổi (vd: navigate tới /tin-tuc?category=...)
  useEffect(() => {
    const fullPath = pathname + search;
    const matched = NAV.find(n => {
      const navFull = n.href.split('#')[0]; // bỏ hash, giữ query string
      return navFull === fullPath || navFull === pathname;
    });
    if (matched) {
      setActiveHref(matched.href);
    } else if (pathname === '/') {
      setActiveHref('/');
    }
  }, [pathname, search]);

  const isActive = (href) => activeHref === href;

  return (
    <header
      className={`sticky top-0 z-50 h-[68px] flex items-center transition-all duration-300 ${
        scrolled
          ? 'bg-white/97 border-b border-gray-200 shadow-md backdrop-blur-md'
          : 'bg-white/90 backdrop-blur-md'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-5 w-full flex items-center gap-5">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 shrink-0"
          onClick={() => setActiveHref('/')}
        >
          <img
            src="/Logo.jpg"
            alt="Vận hành số - Chuyển đổi xanh"
            className="h-10 w-auto object-contain"
          />
          <div className="hidden sm:block">
            <span className="block font-[family-name:var(--font-display)] text-[15px] font-extrabold text-gray-900 leading-tight tracking-tight">
              Vận hành số
            </span>
            <span className="block text-[9px] font-semibold text-green-600 uppercase tracking-widest">
              Chuyển đổi xanh
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1">
          {NAV.map(({ label, href, full }) => (
            <a
              key={label}
              href={href}
              title={full || label}
              onClick={() => setActiveHref(href)}
              className={`px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors duration-200 whitespace-nowrap ${
                isActive(href)
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
            className="hidden lg:inline-flex items-center px-4 py-2 rounded-full bg-green-600 text-white text-[12.5px] font-semibold hover:bg-green-700 transition-colors duration-200 shadow-sm whitespace-nowrap"
          >
            Đăng ký demo
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden flex flex-col gap-[5px] p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="menu"
          >
            <span
              className={`block w-5 h-0.5 bg-gray-800 rounded transition-all duration-300 origin-center ${
                open ? 'translate-y-[6px] rotate-45' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-gray-800 rounded transition-all duration-300 ${
                open ? 'opacity-0 scale-x-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-gray-800 rounded transition-all duration-300 origin-center ${
                open ? '-translate-y-[6px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden absolute top-[68px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg flex flex-col transition-all duration-200 overflow-hidden ${
          open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        {NAV.map(({ label, href, full }) => (
          <a
            key={label}
            href={href}
            onClick={() => { setOpen(false); setActiveHref(href); }}
            className={`px-6 py-3.5 text-[14px] font-medium border-b border-gray-100 transition-colors flex items-center justify-between ${
              isActive(href)
                ? 'text-green-600 bg-green-50'
                : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            <span>{full || label}</span>
            <span className="text-gray-300 text-xs">›</span>
          </a>
        ))}
        <div className="px-6 py-4">
          <a
            href="/#contact"
            onClick={() => setOpen(false)}
            className="block text-center px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
          >
            Đăng ký demo miễn phí
          </a>
        </div>
      </div>
    </header>
  );
}
