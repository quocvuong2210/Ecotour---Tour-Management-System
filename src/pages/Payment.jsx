import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../layout/Header'
import Footer from '../layout/Footer'

function Payment() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('store')
  const [completed, setCompleted] = useState(false)

  if (!state?.bookingId || !state?.tour) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy thông tin thanh toán.</p>
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

  const { tour, contact, estimatedTotal, totalGuests } = state

  const formatPrice = (price) => {
    if (price === undefined || price === null || Number.isNaN(Number(price))) return 'Liên hệ'
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
  }

  const handleComplete = () => {
    setCompleted(true)
    setTimeout(() => {
      navigate('/')
    }, 2500)
  }

  return (
    <>
      <Header />
      <main className="bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 space-y-6">
          <nav className="flex items-center text-sm text-gray-500 gap-2">
            {['Đặt', 'Xem lại', 'Thanh toán', 'Vé điện tử'].map((step, index) => (
              <React.Fragment key={step}>
                <div className={`flex items-center gap-2 ${index === 2 ? 'text-emerald-600 font-semibold' : ''}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${index === 2 ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-300'}`}>
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
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Chọn phương thức thanh toán</h2>
                    <p className="text-sm text-gray-500">Sau khi thanh toán, chúng tôi sẽ gửi vé điện tử qua email.</p>
                  </div>
                  <span className="text-sm text-gray-400">Mã đặt: {state.bookingId}</span>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-4 p-4 border rounded-2xl cursor-pointer hover:border-emerald-400">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'store'}
                      onChange={() => setPaymentMethod('store')}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold">Thanh toán tại cửa hàng</p>
                      <p className="text-sm text-gray-500">
                        Đến trực tiếp văn phòng Ecotour để thanh toán bằng tiền mặt hoặc quẹt thẻ. Giữ email xác nhận để đối chiếu.
                      </p>
                    </div>
                  </label>

                  <label className="flex flex-col gap-4 p-4 border rounded-2xl cursor-pointer hover:border-emerald-400">
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'bank'}
                        onChange={() => setPaymentMethod('bank')}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-semibold">Chuyển khoản VietinBank</p>
                        <p className="text-sm text-gray-500">
                          Chuyển khoản tới tài khoản VietinBank của Ecotour, nội dung ghi rõ mã đặt và số điện thoại.
                        </p>
                      </div>
                    </div>
                    <img
                      src="/img/nganhang.jpg"
                      alt="VietinBank"
                      className="rounded-xl border border-gray-100 object-cover w-full"
                    />
                    <div className="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-xl p-3">
                      <p>Ngân hàng TMCP Công Thương Việt Nam (VietinBank)</p>
                      <p>Chi nhánh: Hà Nội</p>
                      <p>Chủ TK: CÔNG TY DU LỊCH ECOTOUR</p>
                      <p>Số TK: 123 456 789</p>
                    </div>
                  </label>
                </div>

                {completed ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700">
                    Thanh toán đã được ghi nhận! Chúng tôi sẽ gửi vé điện tử vào email của bạn trong giây lát.
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <button
                      onClick={handleComplete}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                    >
                      Hoàn tất thanh toán
                    </button>
                  </div>
                )}
              </section>
            </div>

            <aside className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 text-sm">
                <div className="flex gap-3">
                  <img
                    src={tour.image || '/img/default.jpg'}
                    alt={tour.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold">{tour.name}</p>
                    <p className="text-gray-500">{tour.location}</p>
                    <p className="text-xs text-gray-400 mt-1">Số khách: {totalGuests}</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Liên hệ</span>
                    <span className="font-medium">{contact.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium">{contact.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Điện thoại</span>
                    <span className="font-medium">{contact.phone}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100 space-y-1">
                  <div className="flex justify-between text-gray-500">
                    <span>Tạm tính</span>
                    <span>{formatPrice(estimatedTotal)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng thanh toán</span>
                    <span className="text-emerald-600">{formatPrice(estimatedTotal)}</span>
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

export default Payment

