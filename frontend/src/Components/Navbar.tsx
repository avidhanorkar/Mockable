import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/authContext'

const Navbar = () => {
    const { user } = useAuth();
    return (
        <div className='fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-8 py-4 flex-row'>
            <h1 className='text-white text-3xl font-bold'>Mockable</h1>

            <div className='text-gray-200 flex flex-row gap-5'>
                <div className="group relative cursor-pointer w-fit">
                    <p className="text-white/80 group-hover:text-white transition">About</p>
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                </div>
                <div className="group relative cursor-pointer w-fit">
                    <p className="text-white/80 group-hover:text-white transition">Pricing</p>
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                </div>
                <div className="group relative cursor-pointer w-fit">
                    <p className="text-white/80 group-hover:text-white transition">Contact</p>
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                </div>

            </div>
            <div className='flex flex-row gap-2'>
                {user ? (
                    <Link to={'/dashboard'}>
                        <Button className='bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-gray-200'>Dashboard</Button>
                    </Link>
                ) : (
                    <>
                        <Link to={'/login'}>
                            <Button className='bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-gray-200'>Sign In</Button>
                        </Link>
                        <Link to={'/register'}>
                            <Button className='border-white border shadow-xs shadow-white hover:text-black hover:shadow-md text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-200'>Sign Up</Button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}

export default Navbar