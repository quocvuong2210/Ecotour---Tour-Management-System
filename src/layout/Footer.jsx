import React from 'react'

function Footer() {
  return (
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
  )
}

export default Footer
