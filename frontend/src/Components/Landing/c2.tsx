import { AlertTriangle, BarChart, Frown } from 'lucide-react'

const C2 = () => {
    return (
        <div className='text-white flex flex-col items-center gap-16 mb-32 px-4'>
            <div className='flex flex-col gap-6 text-center max-w-3xl'>
                <h2 className='text-5xl md:text-6xl font-bold text-center leading-tight'>
                    Why you don't succeed <br /> in <span className='underline decoration-gray-400/30 decoration-4 underline-offset-8'>interview</span> calls?
                </h2>
                <p className='text-gray-400 text-xl'>There are multiple problems but the most affecting are: </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full'>
                <div className='flex flex-col gap-5 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:drop-shadow-xl hover:-translate-y-2'>
                    <div className='p-3 bg-gray-500/20 w-fit rounded-lg'>
                        <Frown className='w-8 h-8' />
                    </div>
                    <div>
                        <h3 className='text-2xl font-bold mb-3'>Lack of Feedback</h3>
                        <p className='text-gray-400 text-lg leading-relaxed'>Without constructive feedback, candidates don't know where they went wrong or how to improve, perpetuating a cycle of failure.</p>
                    </div>
                </div>
                <div className='flex flex-col gap-5 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:drop-shadow-xl hover:-translate-y-2'>
                    <div className='p-3 bg-gray-500/20 w-fit rounded-lg'>
                        <BarChart className='w-8 h-8' />
                    </div>
                    <div>
                        <h3 className='text-2xl font-bold mb-3'>Lack of Performance Tracking</h3>
                        <p className='text-gray-400 text-lg leading-relaxed'>Candidates often lack tools to track their progress and identify areas for improvement, making it difficult to measure their growth.</p>
                    </div>
                </div>
                <div className='flex flex-col gap-5 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:drop-shadow-xl hover:-translate-y-2'>
                    <div className='p-3 bg-gray-500/20 w-fit rounded-lg'>
                        <AlertTriangle className='w-8 h-8' />
                    </div>
                    <div>
                        <h3 className='text-2xl font-bold mb-3'>Lack of Realistic Practice</h3>
                        <p className='text-gray-400 text-lg leading-relaxed'>Many candidates struggle to find realistic interview practice opportunities, leading to unpreparedness during actual interviews.</p>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default C2