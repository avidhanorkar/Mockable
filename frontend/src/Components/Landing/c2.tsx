import React from 'react'

const C2 = () => {
    return (
        <div className='text-white flex flex-col items-center gap-10 mb-20'>
            <div className='flex flex-col gap-5 text-center'>
                <p className='text-6xl font-bold text-center'>Why you don't succeed <br /> in <span className='underline'>interview</span> calls?</p>
                <p className='text-gray-300'>Well, there are multiple problems but the most affecting are: </p>
            </div>
            <div className='flex flex-row gap-5'>
                <div className='flex flex-col gap-3 mt-10 border border-gray-300 p-5 rounded-xl'>
                    <p className='text-2xl font-semibold'>Lack of Realistic Practice</p>
                    <p className='text-gray-300 text-lg w-96'>Many candidates struggle to find realistic interview practice opportunities, leading to unpreparedness during actual interviews.</p>
                </div>

                <div className='flex flex-col gap-3 mt-10 border border-gray-300 p-5 rounded-xl'>
                    <p className='text-2xl font-semibold'>Inconsistent Feedback</p>
                    <p className='text-gray-300 text-lg w-96'>Without consistent and constructive feedback, candidates find it challenging to identify and improve their weaknesses.</p>
                </div>
                <div className='flex flex-col gap-3 mt-10 border border-gray-300 p-5 rounded-xl'>
                    <p className='text-2xl font-semibold'>High Anxiety Levels</p>
                    <p className='text-gray-300 text-lg w-96'>Interview anxiety can hinder performance, making it difficult for candidates to showcase their true potential.</p>
                </div>
            </div>
        </div>
    )
}

export default C2