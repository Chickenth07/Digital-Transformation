import { useState } from "react";
import api from "../api";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/contact", form);
      setStatus("success");
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl border-[1.5px] border-gray-300 focus:border-green-500 outline-none text-sm text-gray-800 bg-white transition-colors font-[family-name:var(--font-sans)]";

  const infos = [
    {
      icon: "📍",
      label: "Địa chỉ",
      value: "Tầng 18, Center Building, 01 Nguyễn Huy Tưởng, Hà Nội",
    },
    {
      icon: "📞",
      label: "Điện thoại",
      value: "0918.650.033",
      href: "tel:0918650033",
    },
    {
      icon: "✉️",
      label: "Email",
      value: "info@digitaltransformation.vn",
      href: "mailto:info@digitaltransformation.vn",
    },
    { icon: "🕐", label: "Giờ làm việc", value: "Thứ 2 – Thứ 6: 8:00 – 17:30" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-green-50 via-white to-slate-50 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-4">
            📞 Liên hệ
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Bắt đầu hành trình
            <br />
            <span className="text-green-600">xanh hóa tòa nhà</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
            Đăng ký tư vấn miễn phí — chuyên gia của chúng tôi sẽ phân tích hiện
            trạng và đề xuất lộ trình phù hợp.
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Info cards */}
          <div className="flex flex-col gap-6">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-gray-900">
              Thông tin liên hệ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {infos.map(({ icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex gap-4 items-start p-5 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-xl shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm font-medium text-green-600 hover:underline"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-700 leading-snug">
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-64">
              <iframe
                title="Bản đồ"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.8955897476985!2d105.82295!3d21.009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAwJzMyLjQiTiAxMDXCsDQ5JzIyLjYiRQ!5e0!3m2!1svi!2svn!4v1680000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Form */}
          <div className="bg-gray-50 rounded-3xl p-8 shadow-sm">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold text-gray-900 mb-6">
              Gửi yêu cầu tư vấn
            </h2>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Họ & tên *"
                  required
                  className={inputCls}
                />
                <input
                  name="company"
                  value={form.company}
                  onChange={onChange}
                  placeholder="Tên tòa nhà / đơn vị"
                  className={inputCls}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Email *"
                  required
                  className={inputCls}
                />
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="Số điện thoại"
                  className={inputCls}
                />
              </div>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                placeholder="Mô tả nhu cầu của bạn…"
                rows={4}
                className={`${inputCls} resize-y`}
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="px-6 py-3 rounded-full bg-green-600 text-white font-semibold text-sm hover:bg-green-700 disabled:opacity-60 transition-colors"
              >
                {status === "sending" ? "Đang gửi…" : "✉️ Gửi đăng ký tư vấn"}
              </button>
              {status === "success" && (
                <div className="px-4 py-3 rounded-xl bg-green-100 text-green-700 text-sm font-medium">
                  ✅ Đã nhận! Chúng tôi sẽ liên hệ sớm nhất.
                </div>
              )}
              {status === "error" && (
                <div className="px-4 py-3 rounded-xl bg-red-100 text-red-700 text-sm font-medium">
                  ❌ Có lỗi xảy ra. Vui lòng thử lại.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
