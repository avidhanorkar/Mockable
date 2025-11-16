import Navbar from './Components/Navbar'
import Landing from './Pages/Landing'
import Footer from './Components/Footer'
const App = () => {
  return (
    <div className='bg-[#161616] min-h-screen overflow-y-hidden'>
      <Navbar />
      <Landing />
      <Footer />
    </div>
  )
}

export default App