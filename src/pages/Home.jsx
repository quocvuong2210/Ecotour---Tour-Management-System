import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../layout/Header'
import Footer from '../layout/Footer'
import HotelBooking from '../components/HotelBooking'
import { getTours, searchTours } from '../services/api'

function Home() {
  const navigate = useNavigate()
  const [tours, setTours] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loadingTours, setLoadingTours] = useState(false)
  const [tourError, setTourError] = useState('')

  useEffect(() => {
    loadTours()
  }, [])

  const loadTours = async (keyword = '') => {
    setLoadingTours(true)
    setTourError('')
    try {
      const tourData = keyword ? await searchTours(keyword) : await getTours()
      setTours(tourData)
    } catch (error) {
      setTourError(error.message)
    } finally {
      setLoadingTours(false)
    }
  }

  const handleSearchTours = (e) => {
    e.preventDefault()
    loadTours(searchTerm.trim())
  }

  const formatPrice = (price) => {
    if (price === undefined || price === null || Number.isNaN(Number(price))) return 'Liên hệ'
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
  }

  const getCoverImage = (tour) => {
    if (tour.image) return tour.image
    if (tour.images && tour.images.length > 0) return tour.images[0]
    return '/img/default.jpg'
  }

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
          <Header transparent={true} />

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

      <main>
        <div className="space-y-8 px-4">

      <section id="tours" className="rounded-2xl p-8 lg:p-12 bg-gradient-to-br from-emerald-400/20 to-blue-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold mb-1">Tour nổi bật</h2>
            <p className="text-gray-600">Tìm kiếm và khám phá các tour sinh thái phù hợp với bạn</p>
          </div>
          <form onSubmit={handleSearchTours} className="flex gap-2 w-full lg:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tour theo tên hoặc địa điểm"
              className="flex-1 lg:w-72 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Tìm tour
            </button>
          </form>
        </div>

        {tourError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {tourError}
          </div>
        )}

        {loadingTours ? (
          <div className="text-center py-8 text-gray-600">Đang tải danh sách tour...</div>
        ) : tours.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            Chưa có tour nào khớp với yêu cầu. Hãy thử từ khóa khác hoặc quay lại sau.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tours.map((tour) => (
              <article key={tour.id} className="border border-gray-200/60 rounded-xl p-4 bg-white/5 hover:shadow-lg transition flex flex-col">
                <img
                  className='rounded-xl h-48 w-full object-cover'
                  src={getCoverImage(tour)}
                  alt={tour.name}
                  onError={(e) => { e.target.src = '/img/default.jpg' }}
                />
                <div className="mt-4 flex-1">
                  <h3 className="text-lg font-semibold">{tour.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{tour.location}</p>
                  <p className="mt-2 text-sm text-gray-700 line-clamp-3">{tour.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Giá người lớn</p>
                    <p className="text-lg font-bold text-emerald-700">{formatPrice(tour.adultPrice ?? tour.price)}</p>
                    {tour.childPrice !== null && tour.childPrice !== undefined && (
                      <p className="text-xs text-gray-500 mt-1">Trẻ em: {formatPrice(tour.childPrice)}</p>
                    )}
                  </div>
                  <button
                    className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 text-sm"
                    onClick={() => navigate(`/tours/${tour.id}`)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
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


