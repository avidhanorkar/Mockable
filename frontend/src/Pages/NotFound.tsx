import { Button } from '../Components/ui/button'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className='bg-[#161616] min-h-screen flex flex-col items-center justify-center relative overflow-hidden'>
            {/* Background decorative elements */}

            <div className='z-10 flex flex-col items-center gap-8 text-center px-4'>
                <div className='relative'>
                    <h1 className='text-[15rem] font-bold text-white/5 leading-none select-none'>404</h1>
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <h2 className='text-6xl font-bold text-white tracking-tight'>Page Not Found</h2>
                    </div>
                </div>

                <p className='text-gray-400 text-xl w-2/3 '>
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <Button
                    onClick={() => navigate('/')}
                    className='mt-4 bg-white text-black px-8 py-6 rounded-md text-lg font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-105'
                >
                    Go Back Home
                </Button>
            </div>
        </div>
    )
}

export default NotFound