import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'

function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <>
      <header className="flex items-center justify-between gap-4 py-4">
        <div className="font-bold text-xl lg:text-2xl">Ecotour</div> 
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">Xin chào, {user.name}!</span>
              <button 
                onClick={logout}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700"
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
