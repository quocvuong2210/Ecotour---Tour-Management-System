import React from "react";
import { motion } from "framer-motion";

function Home() {
  return (
    <main className="space-y-16">
      {/* Header */}
      <motion.header
        className="flex items-center justify-between gap-4 px-6 py-4 bg-white shadow sticky top-0 z-50"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="font-bold text-xl lg:text-2xl text-emerald-700">
          🌿 Ecotour
        </div>
        <nav>
          <ul className="flex list-none gap-6 p-0 m-0 text-gray-700">
            <li>
              <a className="hover:text-emerald-600 transition" href="#tours">
                Tours
              </a>
            </li>
            <li>
              <a className="hover:text-emerald-600 transition" href="#about">
                Về chúng tôi
              </a>
            </li>
            <li>
              <a className="hover:text-emerald-600 transition" href="#contact">
                Liên hệ
              </a>
            </li>
          </ul>
        </nav>
        <button className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition">
          Đặt tour
        </button>
      </motion.header>

      {/* Hero section */}
      <section
        className="relative h-[60vh] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: "url('/src/assets/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="bg-black/40 p-8 rounded-xl"
        >
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            Khám phá thiên nhiên Việt Nam
          </h1>
          <p className="text-lg lg:text-xl">
            Hành trình xanh – Trải nghiệm bền vững
          </p>
        </motion.div>
      </section>

      {/* Tours */}
      <section id="tours" className="px-6 lg:px-12">
        <motion.h2
          className="text-3xl font-semibold mb-6 text-emerald-700"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          Tour nổi bật
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tour 1 */}
          <motion.article
            className="border border-gray-200 rounded-xl overflow-hidden shadow hover:shadow-xl transition bg-white"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src="/src/assets/tour1.jpg"
              alt="Rừng Cúc Phương"
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">Rừng Cúc Phương</h3>
              <p className="text-gray-600">
                Khám phá khu rừng quốc gia lâu đời nhất Việt Nam.
              </p>
              <div className="flex gap-2 mt-3">
                <button className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm">
                  Khám phá
                </button>
                <button className="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 text-sm">
                  Chi tiết
                </button>
              </div>
            </div>
          </motion.article>

          {/* Tour 2 */}
          <motion.article
            className="border border-gray-200 rounded-xl overflow-hidden shadow hover:shadow-xl transition bg-white"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src="/src/assets/tour2.jpg"
              alt="Phong Nha"
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">Vườn Quốc gia Phong Nha</h3>
              <p className="text-gray-600">
                Trải nghiệm hệ thống hang động kỳ vĩ và thiên nhiên hoang sơ.
              </p>
              <div className="flex gap-2 mt-3">
                <button className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm">
                  Khám phá
                </button>
                <button className="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 text-sm">
                  Chi tiết
                </button>
              </div>
            </div>
          </motion.article>

          {/* Tour 3 */}
          <motion.article
            className="border border-gray-200 rounded-xl overflow-hidden shadow hover:shadow-xl transition bg-white"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src="/src/assets/tour3.jpg"
              alt="Côn Đảo"
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">Côn Đảo Xanh</h3>
              <p className="text-gray-600">
                Gặp gỡ rùa biển và tìm hiểu hệ sinh thái biển đa dạng.
              </p>
              <div className="flex gap-2 mt-3">
                <button className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm">
                  Khám phá
                </button>
                <button className="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 text-sm">
                  Chi tiết
                </button>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* About */}
      <motion.section
        id="about"
        className="px-6 lg:px-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold mb-3">Tại sao chọn Ecotour?</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>Du lịch bền vững, thân thiện với môi trường</li>
          <li>Hỗ trợ cộng đồng địa phương</li>
          <li>Trải nghiệm chân thực, an toàn</li>
        </ul>
      </motion.section>

      {/* Footer */}
      <footer
        className="border-t border-gray-200 pt-6 px-6 lg:px-12 bg-gray-50"
        id="contact"
      >
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div>
            <h4 className="font-semibold">Ecotour</h4>
            <p className="text-gray-500">
              Hành trình xanh cho tương lai bền vững.
            </p>
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
        </motion.div>
        <div className="mt-6 text-center text-gray-500">
          © {new Date().getFullYear()} Ecotour
        </div>
      </footer>
    </main>
  );
}

export default Home;
