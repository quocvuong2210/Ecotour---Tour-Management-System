import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../layout/Header'
import Footer from '../layout/Footer'
import { getTour, bookTour } from '../services/api'

function Checkout() {
  const { state } = useLocation()
  const navigate = useNavigate()

  const initialBooking = state?.bookingData || {
    name: '',
    email: '',
    phone: '',
    adults: 1,
    children: 0,
    startDate: '',
    notes: ''
  }

  const [tour, setTour] = useState(state?.tour || null)
  const [tourId, setTourId] = useState(state?.tourId || null)
  const [contact, setContact] = useState({
    title: 'Anh',
    fullName: initialBooking.name,
    phone: initialBooking.phone,
    email: initialBooking.email
  })
  const [bookingInfo, setBookingInfo] = useState(initialBooking)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (state?.tour) {
      setTour(state.tour)
    } else if (state?.tourId) {
      setTourId(state.tourId)
    }
  }, [state])

  useEffect(() => {
    const fetchTour = async () => {
      if (!tour && tourId) {
        try {
          const data = await getTour(tourId)
          setTour(data)
        } catch (err) {
          setError(err.message)
        }
      }
    }
    fetchTour()
  }, [tour, tourId])

  if (!state?.bookingData && !tourId) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy thông tin đặt tour. Vui lòng chọn tour lại.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md"
          >
            Quay về trang chủ
          </button>
        </main>
        <Footer />
      </>
    )
  }

  const formatPrice = (price) => {
    if (price === undefined || price === null || Number.isNaN(Number(price))) return 'Liên hệ'
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
  }

  const adults = Number(bookingInfo.adults) || 0
  const children = Number(bookingInfo.children) || 0
  const totalGuests = Math.max(adults + children, 1)
  const adultPrice = tour?.adultPrice ?? tour?.price ?? 0
  const childPrice = tour?.childPrice ?? adultPrice
  const estimatedTotal = adultPrice * adults + childPrice * children

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!tour) return

    setLoading(true)
    setError('')

    try {
      const payload = {
        name: contact.fullName || bookingInfo.name,
        email: contact.email,
        phone: contact.phone,
        adults,
        children,
        startDate: bookingInfo.startDate,
        notes: bookingInfo.notes
      }

      const response = await bookTour(tour.id, payload)

      navigate('/payment', {
        state: {
          bookingId: response.bookingId,
          tour,
          contact: payload,
          totalGuests,
          estimatedTotal,
          paymentDueDate: bookingInfo.startDate
        }
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <nav className="flex items-center text-sm text-gray-500 gap-2">
            {['Đặt', 'Xem lại', 'Thanh toán', 'Vé điện tử'].map((step, index) => (
              <React.Fragment key={step}>
                <div className={`flex items-center gap-2 ${index === 1 ? 'text-emerald-600 font-semibold' : ''}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${index === 1 ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-300'}`}>
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </div>
                {index < 3 && <span>—</span>}
              </React.Fragment>
            ))}
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold">Đặt chỗ của tôi</h2>
                  <p className="text-sm text-gray-500">Điền thông tin và xem lại đặt chỗ.</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 p-4 border border-emerald-100 rounded-xl bg-emerald-50">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 font-semibold">
                      {contact.fullName ? contact.fullName.charAt(0).toUpperCase() : 'KH'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{contact.fullName || 'Khách hàng Ecotour'}</p>
                      <p className="text-xs text-gray-500">Đăng nhập để lưu lịch sử đặt chỗ</p>
                    </div>
                    <button className="ml-auto text-sm text-emerald-600 hover:underline">Đăng nhập</button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">Thông tin liên hệ</h3>
                      <span className="text-sm text-emerald-600">Lưu</span>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Danh xưng *</label>
                          <select
                            value={contact.title}
                            onChange={(e) => setContact({ ...contact, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="Anh">Anh</option>
                            <option value="Chị">Chị</option>
                            <option value="Mr">Mr</option>
                            <option value="Ms">Ms</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên *</label>
                          <input
                            type="text"
                            value={contact.fullName}
                            onChange={(e) => setContact({ ...contact, fullName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Điện thoại di động *</label>
                          <div className="flex">
                            <select className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-sm">
                              <option value="+84">+84</option>
                            </select>
                            <input
                              type="tel"
                              value={contact.phone}
                              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md"
                              required
                              placeholder="Ví dụ: 0901234567"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">VD: +84 901234567 trong đó 901234567 là số di động</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                          <input
                            type="email"
                            value={contact.email}
                            onChange={(e) => setContact({ ...contact, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                            placeholder="email@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Người lớn</label>
                          <input
                            type="number"
                            min="1"
                            value={bookingInfo.adults}
                            onChange={(e) => setBookingInfo({ ...bookingInfo, adults: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Trẻ em</label>
                          <input
                            type="number"
                            min="0"
                            value={bookingInfo.children}
                            onChange={(e) => setBookingInfo({ ...bookingInfo, children: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tham quan</label>
                        <input
                          type="date"
                          value={bookingInfo.startDate}
                          onChange={(e) => setBookingInfo({ ...bookingInfo, startDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                        <textarea
                          rows="3"
                          value={bookingInfo.notes}
                          onChange={(e) => setBookingInfo({ ...bookingInfo, notes: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Yêu cầu đặc biệt (nếu có)"
                        />
                      </div>

                      {error && (
                        <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">{error}</div>
                      )}

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {loading ? 'Đang xử lý...' : 'Tiếp tục thanh toán'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold">Thông tin đưa đón & địa điểm</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="rounded-2xl overflow-hidden border border-gray-100">
                    <iframe
                      title="Tour location map"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(tour?.location || 'Vietnam')}&output=embed`}
                      className="w-full h-56 border-0"
                      loading="lazy"
                    />
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold">{tour?.location || 'Đang cập nhật'}</p>
                        <p className="text-xs text-gray-500">Nhấn xem bản đồ để mở Google Maps</p>
                      </div>
                      <a
                        href={`https://www.google.com/maps?q=${encodeURIComponent(tour?.location || 'Vietnam')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
                      >
                        Xem bản đồ
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold">Tóm tắt đặt chỗ</h3>
                </div>
                <div className="p-6 space-y-4 text-sm">
                  <div className="flex gap-3">
                    <img
                      src={tour?.image || '/img/default.jpg'}
                      alt={tour?.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold">{tour?.name}</p>
                      <p className="text-gray-500">{tour?.location}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ngày tham quan</span>
                      <span className="font-medium">
                        {bookingInfo.startDate ? new Date(bookingInfo.startDate).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric' }) : 'Chưa chọn'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Áp dụng cho</span>
                      <span className="font-medium">Người lớn: {adults}, Trẻ em: {children}</span>
                    </div>
                  </div>
                  <ul className="space-y-1 text-gray-500 text-xs">
                    <li>• Có hiệu lực vào {bookingInfo.startDate ? new Date(bookingInfo.startDate).toLocaleDateString('vi-VN') : 'ngày tham quan'}</li>
                    <li>• Không hoàn tiền</li>
                    <li>• Không thể đổi lịch</li>
                  </ul>
                  <div className="pt-4 border-t border-gray-100 space-y-1">
                    <div className="flex justify-between text-gray-500">
                      <span>Tạm tính</span>
                      <span>{formatPrice(estimatedTotal)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Tổng thanh toán</span>
                      <span className="text-emerald-600">{formatPrice(estimatedTotal)}</span>
                    </div>
                    <p className="text-xs text-gray-400">Giá đã bao gồm toàn bộ thuế phí.</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Checkout

