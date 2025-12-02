import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../layout/Header'
import Footer from '../layout/Footer'
import { getTour } from '../services/api'
import { useAuth } from '../context/AuthContext'

function TourDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [tour, setTour] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    adults: 1,
    children: 0,
    startDate: '',
    notes: ''
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [activeImage, setActiveImage] = useState('')

  useEffect(() => {
    if (user) {
      setBookingData((prev) => ({
        ...prev,
        name: prev.name || user.name,
        email: prev.email || user.email
      }))
    }
  }, [user])

  useEffect(() => {
    const loadTour = async () => {
      try {
        const data = await getTour(id)
        setTour(data)
      } catch (err) {
        setPageError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadTour()
  }, [id])

  useEffect(() => {
    if (tour) {
      setActiveImage(tour.image || (tour.images && tour.images[0]) || '/img/default.jpg')
    }
  }, [tour])

  const formatPrice = (price) => {
    if (price === undefined || price === null) return 'Liên hệ'
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    setBookingLoading(true)
    setBookingError('')

    try {
      const payload = {
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        adults: Number(bookingData.adults) || 1,
        children: Number(bookingData.children) || 0,
        startDate: bookingData.startDate,
        notes: bookingData.notes
      }

      navigate('/checkout', {
        state: {
          tourId: tour.id,
          tour,
          bookingData: payload
        }
      })
    } catch (err) {
      setBookingError(err.message)
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Đang tải thông tin tour...</p>
        </main>
        <Footer />
      </>
    )
  }

  if (pageError) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <p className="text-red-600 mb-4">{pageError}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md"
          >
            Quay lại
          </button>
        </main>
        <Footer />
      </>
    )
  }

  if (!tour) {
    return null
  }

  const adultPrice = tour.adultPrice ?? tour.price
  const childPrice = tour.childPrice
  const adultsCount = Number(bookingData.adults) || 0
  const childrenCount = Number(bookingData.children) || 0
  const totalGuests = Math.max(adultsCount + childrenCount, 1)
  const estimatedTotal =
    (adultPrice || 0) * adultsCount +
    (childPrice ?? adultPrice ?? 0) * childrenCount
  const heroImage = activeImage || tour.image || (tour.images && tour.images[0]) || '/img/default.jpg'

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="text-emerald-600 hover:underline mb-4 inline-flex items-center gap-2"
          >
            <span aria-hidden="true">←</span> Quay lại
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src={heroImage}
                alt={tour.name}
                className="w-full h-80 object-cover"
                onError={(e) => { e.target.src = '/img/default.jpg' }}
              />
              {tour.images && tour.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4 border-t border-gray-100">
                  {tour.images.map((img, index) => (
                    <button
                      type="button"
                      key={`${img}-${index}`}
                      onClick={() => setActiveImage(img)}
                      className={`rounded-lg overflow-hidden border ${img === activeImage ? 'border-emerald-500' : 'border-transparent'} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    >
                      <img
                        src={img}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-20 object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm uppercase tracking-wide text-emerald-600 font-semibold">
                    Ecotour đề xuất
                  </p>
                  <h1 className="text-3xl font-bold text-gray-900 mt-2">{tour.name}</h1>
                  <p className="text-gray-600 mt-1">{tour.location}</p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {tour.duration && (
                    <span className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                      ⏱ {tour.duration}
                    </span>
                  )}
                  <span className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                    🌿 Du lịch sinh thái
                  </span>
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {tour.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Giá người lớn</p>
                  <p className="text-3xl font-bold text-emerald-600">{formatPrice(adultPrice)}</p>
                </div>
                {childPrice !== null && childPrice !== undefined && (
                  <div>
                    <p className="text-sm text-gray-500">Giá trẻ em</p>
                    <p className="text-xl font-semibold text-emerald-500">{formatPrice(childPrice)}</p>
                  </div>
                )}
                <ul className="text-sm text-gray-500 list-disc list-inside">
                  <li>Đã bao gồm hướng dẫn viên và bảo hiểm</li>
                  <li>Miễn phí hủy trong 24h đầu</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Đặt tour ngay</h2>
                {bookingError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    {bookingError}
                  </div>
                )}
                <form className="space-y-4" onSubmit={handleBookingSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={bookingData.name}
                      onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={bookingData.email}
                      onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                      placeholder="Ví dụ: 0901234567"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Người lớn
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={bookingData.adults}
                        onChange={(e) => setBookingData({ ...bookingData, adults: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trẻ em
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={bookingData.children}
                        onChange={(e) => setBookingData({ ...bookingData, children: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày khởi hành
                    </label>
                    <input
                      type="date"
                      value={bookingData.startDate}
                      onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600 space-y-1">
                    <p>
                      Tổng số khách: <span className="font-semibold text-gray-900">{totalGuests}</span>
                    </p>
                    {adultPrice !== null && adultPrice !== undefined && (
                      <p>
                        Ước tính chi phí:{' '}
                        <span className="font-semibold text-emerald-600">
                          {totalGuests > 0 ? formatPrice(estimatedTotal) : 'Liên hệ'}
                        </span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú thêm
                    </label>
                    <textarea
                      rows="3"
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Ví dụ: dị ứng đồ biển, yêu cầu riêng..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {bookingLoading ? 'Đang gửi yêu cầu...' : 'Đặt tour ngay'}
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    * Ecotour sẽ liên hệ xác nhận và hướng dẫn thanh toán
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default TourDetail

