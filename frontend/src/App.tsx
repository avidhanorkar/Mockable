import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

import ProtectedRoute from './routes/Protected'
import PublicRoute from './routes/Public'

import Navbar from './Components/Navbar'
import Landing from './Pages/Landing'
import Footer from './Components/Footer'
import Login from './Pages/Login'
import Register from './Pages/Register'
import NotFound from './Pages/NotFound'
import Dashboard from './Pages/Dashboard'
import InterviewSetup from './Pages/InterviewSetup'
import Interview from './Pages/Interview'
import Report from './Pages/Report'


const client = import.meta.env.VITE_GOOGLE_CLIENT_ID

const App = () => {
  return (
    <div className='bg-[#161616] min-h-screen overflow-y-hidden'>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={client}>
          <Navbar />
          <div className='pt-40 pb-20'>
            <Routes>
              <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="*" element={<NotFound />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/interview-setup" element={<ProtectedRoute><InterviewSetup /></ProtectedRoute>} />
              <Route path="/interview" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
              <Route path="/report/:id" element={<ProtectedRoute><Report /></ProtectedRoute>} />
            </Routes>
          </div>
          <Footer />
        </GoogleOAuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App