import React from 'react'

function Home() {
  return (
    <main className="space-y-8">
      <header className="flex items-center justify-between gap-4">
        <div className="font-bold text-xl lg:text-2xl">Ecotour</div>
        <nav>
          <ul className="flex list-none gap-4 p-0 m-0">
            <li><a className="hover:underline" href="#tours">Tours</a></li>
            <li><a className="hover:underline" href="#about">Về chúng tôi</a></li>
            <li><a className="hover:underline" href="#contact">Liên hệ</a></li>
          </ul>
        </nav>
        <button className="px-4 py-2 rounded-md border border-transparent bg-gray-900 text-white hover:opacity-90">Đặt tour</button>
      </header>

      <section id="tours" className="rounded-2xl p-8 lg:p-12 bg-gradient-to-br from-emerald-400/20 to-blue-500/20">
        <h2 className="text-2xl font-semibold mb-3">Tour nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <article className="border border-gray-200/60 rounded-xl p-4 bg-white/5 hover:shadow-lg transition">
            <h3>Rừng Cúc Phương</h3>
            <p>Hành trình khám phá khu rừng quốc gia lâu đời nhất Việt Nam.</p>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm">Khám phá</button>
              <button className="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 text-sm">Chi tiết</button>
            </div>
          </article>
          <article className="border border-gray-200/60 rounded-xl p-4 bg-white/5 hover:shadow-lg transition">
            <h3>Vườn Quốc gia Phong Nha</h3>
            <p>Trải nghiệm hệ thống hang động kỳ vĩ và thiên nhiên hoang sơ.</p>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm">Khám phá</button>
              <button className="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 text-sm">Chi tiết</button>
            </div>
          </article>
          <article className="border border-gray-200/60 rounded-xl p-4 bg-white/5 hover:shadow-lg transition">
            <h3>Côn Đảo Xanh</h3>
            <p>Gặp gỡ rùa biển và tìm hiểu hệ sinh thái biển đa dạng.</p>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm">Khám phá</button>
              <button className="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 text-sm">Chi tiết</button>
            </div>
          </article>
        </div>
      </section>

      <section id="about">
        <h2 className="text-xl font-semibold mb-3">Tại sao chọn Ecotour?</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Du lịch bền vững, thân thiện với môi trường</li>
          <li>Hỗ trợ cộng đồng địa phương</li>
          <li>Trải nghiệm chân thực, an toàn</li>
        </ul>
      </section>

      <footer className="border-t border-gray-200 pt-4" id="contact">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <h4 className="font-semibold">Ecotour</h4>
            <p className="text-gray-500">Hành trình xanh cho tương lai bền vững.</p>
          </div>
          <div>
            <h4 className="font-semibold">Liên hệ</h4>
            <p className="text-gray-500">Email: contact@ecotour.vn</p>
            <p className="text-gray-500">Hotline: 0900 123 456</p>
          </div>
          <div>
            <h4 className="font-semibold">Theo dõi</h4>
            <p className="text-gray-500">Facebook • Instagram • YouTube</p>
          </div>
        </div>
        <div className="mt-4 text-center text-gray-500">© {new Date().getFullYear()} Ecotour</div>
      </footer>
    </main>
  )
}

export default Home


