import React from 'react'

const Footer = () => {
  return (
    <div className="h-40 bg-black px-20 relative flex items-center overflow-hidden">
      <div className="flex flex-col gap-2 w-full">
        <p className="text-white text-xl font-bold">Mockable - A Mock Interview Platform</p>
        <p className="text-white">© 2024 Mockable. All rights reserved.</p>
      </div>

      <p className="text-white font-bold text-5xl absolute -bottom-2 -right-2 text-right">
        Made for Job Seekers, Made by Job Seekers.
      </p>
    </div>
  )
}

export default Footer
