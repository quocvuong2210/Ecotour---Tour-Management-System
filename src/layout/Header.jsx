import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import AuthModal from '../components/AuthModal'

function Header({ transparent = false }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
    navigate('/')
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const headerClasses = transparent 
    ? "flex items-center justify-between gap-4 py-4 px-4 bg-transparent"
    : "flex items-center justify-between gap-4 py-4 px-4 bg-white shadow-sm"
  
  const logoClasses = transparent
    ? "font-bold text-xl lg:text-2xl cursor-pointer text-white drop-shadow-md"
    : "font-bold text-xl lg:text-2xl cursor-pointer"
  
  const buttonClasses = transparent
    ? "flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
    : "flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
  
  const nameClasses = transparent
    ? "text-sm font-medium hidden sm:block text-white drop-shadow-md"
    : "text-sm font-medium hidden sm:block"
  
  const loginButtonClasses = transparent
    ? "px-4 py-2 rounded-md bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
    : "px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700"

  return (
    <>
      <header className={headerClasses}>
        <div 
          className={logoClasses}
          onClick={() => navigate('/')}
        >
          Ecotour
        </div> 
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={buttonClasses}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                  {getInitials(user.name)}
                </div>
                <span className={nameClasses}>{user.name}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${transparent ? 'text-white' : ''} ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        navigate('/admin')
                        setIsDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Quản lý Admin
                    </button>
                  )}
                  <button
                    onClick={() => {
                      navigate('/settings')
                      setIsDropdownOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Cài đặt tài khoản
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className={loginButtonClasses}
            >
              Đăng nhập
            </button>
          )}
        </div>
      </header>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}

export default Header
