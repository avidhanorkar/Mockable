import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
const C1 = () => {
    return (
        <div className='flex flex-col gap-14 items-center  h-[80vh]'>
            <div className='flex flex-col gap-8 items-center'>
                <div className='border border-gray-300 px-3 w-fit py-1 rounded-full'>
                    <p className='text-white'>✨ The Future of Interview Preparation</p>
                </div>
                <div className='flex flex-col items-center justify-center gap-5'>
                    <h1 className='text-8xl font-bold text-white text-center '>Stop Hoping. Start Preparing. Start Winning!</h1>
                    <p className='text-gray-200 text-xl text-center'>Meet <span className='text-white font-bold'>Mockable</span> - An AI Mock Interview Platform,<br /> engineered to sharpen your interview skills and secure your future.</p>
                </div>
            </div>

            <div className='flex flex-row gap-10'>

                <Link to={'/register'}>
                    <Button className='bg-white text-black px-10 py-6 w-fit rounded-md text-lg font-semibold hover:bg-gray-200'>
                        Get Started
                    </Button>
                </Link>
                <Button className='border border-white text-white px-10 py-6 w-fit rounded-md text-lg font-semibold hover:bg-white hover:text-black'>
                    Watch Demo
                </Button>
            </div>
        </div>
    )
}

export default C1