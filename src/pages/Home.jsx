import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import Footer from '../layout/Footer'
import HotelBooking from '../components/HotelBooking'

function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <>
      {/* Combined Header & Hero Section */}
      <section 
        className="relative"
        style={{
          backgroundImage: 'url(/img/VinhHaLong.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10">
          {/* Header Navigation */}
          <header className="flex items-center justify-between gap-4 py-4 px-4">
            <div className="font-bold text-xl lg:text-2xl text-white drop-shadow-md">Ecotour</div> 
            
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-white drop-shadow-md">Xin chào, {user.name}!</span>
                  <button 
                    onClick={logout}
                    className="px-4 py-2 rounded-md bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2 rounded-md bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                >
                  Đăng nhập
                </button>
              )}
            </div>
          </header>

          {/* Hero Content */}
          <div className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-4xl font-bold text-white mb-8 text-center drop-shadow-lg">
                Tận hưởng Việt Nam với Ecotour
              </h1>
              <HotelBooking />
            </div>
          </div>
        </div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <main>
        <div className="space-y-8 px-4">

      <section id="tours" className="rounded-2xl p-8 lg:p-12 bg-gradient-to-br from-emerald-400/20 to-blue-500/20">
        <h2 className="text-2xl font-semibold mb-3">Tour nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <article className="border border-gray-200/60 rounded-xl p-4 bg-white/5 hover:shadow-lg transition">
            <img className='rounded-xl' src="/public/img/cucphuong.jpg" alt="Rừng Cúc Phương" />
            <h3>Rừng Cúc Phương</h3>
            <p>Hành trình khám phá khu rừng quốc gia lâu đời nhất Việt Nam.</p>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm">Khám phá</button>
              <button className="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 text-sm">Chi tiết</button>
            </div>
          </article>
          <article className="border border-gray-200/60 rounded-xl p-4 bg-white/5 hover:shadow-lg transition">
            <img className='rounded-xl' src="/public/img/phongnha.jpg" alt="Vườn Quốc gia Phong Nha" />
            <h3>Vườn Quốc gia Phong Nha</h3>
            <p>Trải nghiệm hệ thống hang động kỳ vĩ và thiên nhiên hoang sơ.</p>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm">Khám phá</button>
              <button className="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 text-sm">Chi tiết</button>
            </div>
          </article>
          <article className="border border-gray-200/60 rounded-xl p-4 bg-white/5 hover:shadow-lg transition">
            <img className='rounded-xl' src="/public/img/condao.jpg" alt="Côn Đảo Xanh" />
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
        </div>

        <Footer />
      </main>
    </>
  )
}

export default Home


