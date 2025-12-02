import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { updateUserProfile, getUserProfile } from '../services/api'
import Header from '../layout/Header'
import Footer from '../layout/Footer'

function Settings() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('account')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    day: '',
    month: '',
    year: '',
    city: '',
    emails: []
  })

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    
    // Load user profile data
    loadUserProfile()
  }, [user, navigate])

  const loadUserProfile = async () => {    if (!user) return
    
    try {
      const profile = await getUserProfile()
      if (profile) {
        setFormData({
          name: profile.name || user.name || '',
          gender: profile.gender || '',
          day: profile.day || '',
          month: profile.month || '',
          year: profile.year || '',
          city: profile.city || '',
          emails: profile.emails || [user.email]
        })
      } else {
        setFormData({
          name: user.name || '',
          gender: '',
          day: '',
          month: '',
          year: '',
          city: '',
          emails: [user.email]
        })
      }
    } catch (err) {
      console.error('Error loading profile:', err)
      setFormData({
        name: user.name || '',
        gender: '',
        day: '',
        month: '',
        year: '',
        city: '',
        emails: [user.email]
      })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const updatedProfile = await updateUserProfile({
        name: formData.name,
        gender: formData.gender,
        day: formData.day,
        month: formData.month,
        year: formData.year,
        city: formData.city,
        emails: formData.emails
      })
      
      // Update user in context
      updateUser({
        ...user,
        name: updatedProfile.name || user.name,
        ...updatedProfile
      })
      
      setSuccess('Cập nhật thông tin thành công!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi cập nhật thông tin')
    } finally {
      setLoading(false)
    }
  }

  const handleAddEmail = () => {
    if (formData.emails.length < 3) {
      setFormData(prev => ({
        ...prev,
        emails: [...prev.emails, '']
      }))
    }
  }

  const handleEmailChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.map((email, i) => i === index ? value : email)
    }))
  }

  const handleRemoveEmail = (index) => {
    if (formData.emails.length > 1) {
      setFormData(prev => ({
        ...prev,
        emails: prev.emails.filter((_, i) => i !== index)
      }))
    }
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const months = [
    'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu',
    'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'
  ]

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString())
  const years = Array.from({ length: 100 }, (_, i) => (2024 - i).toString())

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
              {/* User Profile Section */}
              <div className="flex flex-col items-center mb-6 pb-6 border-b">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-semibold mb-3">
                  {getInitials(user.name)}
                </div>
                <h3 className="font-semibold text-lg mb-1">{user.name}</h3>
                <p className="text-sm text-gray-500 mb-3">Email</p>
                <div className="w-full bg-amber-50 border border-amber-200 rounded px-3 py-2 text-sm text-amber-800 flex items-center justify-between">
                  <span>Bạn là thành viên Bronze Priority</span>
                  <span>→</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1">
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  <span className="text-lg">0</span>
                  <span className="text-sm">Điểm</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-sm">Thẻ của tôi</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-sm">Đặt chỗ của tôi</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-sm">Danh sách giao dịch</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-sm">Refunds</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-blue-600 bg-blue-50 rounded">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium">Tài khoản</span>
                </a>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-semibold mb-6">Cài đặt</h1>
              
              {/* Tabs */}
              <div className="border-b mb-6">
                <div className="flex gap-6">
                  <button
                    onClick={() => setActiveTab('account')}
                    className={`pb-4 px-1 font-medium ${
                      activeTab === 'account'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Thông tin tài khoản
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`pb-4 px-1 font-medium ${
                      activeTab === 'security'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Mật khẩu & Bảo mật
                  </button>
                </div>
              </div>

              {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                  {success}
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}

              {activeTab === 'account' && (
                <>
                  {/* Personal Data Section */}
                  <section className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Dữ liệu cá nhân</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tên đầy đủ
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nhập tên đầy đủ"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Tên trong hồ sơ được rút ngắn từ họ tên của bạn.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giới tính
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày sinh
                        </label>
                        <div className="flex gap-2">
                          <select
                            name="day"
                            value={formData.day}
                            onChange={handleInputChange}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Ngày</option>
                            {days.map(day => (
                              <option key={day} value={day}>{day}</option>
                            ))}
                          </select>
                          <select
                            name="month"
                            value={formData.month}
                            onChange={handleInputChange}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Tháng</option>
                            {months.map((month, index) => (
                              <option key={index} value={index + 1}>{month}</option>
                            ))}
                          </select>
                          <select
                            name="year"
                            value={formData.year}
                            onChange={handleInputChange}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Năm</option>
                            {years.map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Thành phố cư trú
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Thành phố cư trú"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Có lẽ để sau
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? 'Đang lưu...' : 'Lưu'}
                      </button>
                    </div>
                  </section>

                  {/* Email Section */}
                  <section>
                    <h2 className="text-lg font-semibold mb-2">Email</h2>
                    <p className="text-sm text-gray-600 mb-4">
                      Chỉ có thể sử dụng tối đa 3 email
                    </p>
                    
                    <div className="space-y-3">
                      {formData.emails.map((email, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => handleEmailChange(index, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập email"
                          />
                          {formData.emails.length > 1 && (
                            <button
                              onClick={() => handleRemoveEmail(index)}
                              className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                            >
                              Xóa
                            </button>
                          )}
                        </div>
                      ))}
                      
                      {formData.emails.length < 3 && (
                        <button
                          onClick={handleAddEmail}
                          className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Thêm email
                        </button>
                      )}
                    </div>
                  </section>
                </>
              )}

              {activeTab === 'security' && (
                <div className="text-center py-12 text-gray-500">
                  Tính năng đang được phát triển...
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Settings

