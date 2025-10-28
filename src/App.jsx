import './App.css'
import Home from './pages/Home.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

function App() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  )
}

export default App
