import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NewsList from './pages/NewsList';
import ArticleDetail from './pages/ArticleDetail';
import Admin from './pages/Admin';
import './index.css';

function Layout({ children }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <>
      {!isAdmin && <Header />}
      <main className="min-h-screen">{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center">
      <span className="text-6xl">🌿</span>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-gray-900">
        404 – Không tìm thấy trang
      </h1>
      <a href="/" className="px-6 py-3 rounded-full bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors">
        Về trang chủ
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/gioi-thieu"      element={<About />} />
          <Route path="/lien-he"         element={<Contact />} />
          <Route path="/tin-tuc"         element={<NewsList />} />
          <Route path="/bai-viet/:id"    element={<ArticleDetail />} />
          <Route path="/admin"           element={<Admin />} />
          <Route path="/admin/*"         element={<Admin />} />
          <Route path="*"               element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
