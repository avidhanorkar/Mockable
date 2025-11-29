import Navbar from './Components/Navbar'
import Landing from './Pages/Landing'
import Footer from './Components/Footer'
import Login from './Pages/Login'
import NotFound from './Pages/NotFound'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
const App = () => {
  return (
    <div className='bg-[#161616] min-h-screen overflow-y-hidden'>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  )
}

export default App