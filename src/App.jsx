import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Settings from './pages/Settings.jsx'
import Admin from './pages/Admin.jsx'
import TourDetail from './pages/TourDetail.jsx'
import Checkout from './pages/Checkout.jsx'
import Payment from './pages/Payment.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/tours/:id" element={<TourDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
