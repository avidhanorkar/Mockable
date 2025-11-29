import ProtectedRoute from './routes/Protected'
import PublicRoute from './routes/Public'

import Navbar from './Components/Navbar'
import Landing from './Pages/Landing'
import Footer from './Components/Footer'
import Login from './Pages/Login'
import Register from './Pages/Register'
import NotFound from './Pages/NotFound'
import Dashboard from './Pages/Dashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
const App = () => {
  return (
    <div className='bg-[#161616] min-h-screen overflow-y-hidden'>
      <BrowserRouter>
      <Navbar />
        <div className='pt-40 pb-20'>
          <Routes>
            <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="*" element={<NotFound />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        </div>
      <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App