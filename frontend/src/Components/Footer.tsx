const Footer = () => {
  return (
    <div className="h-40 bg-black border-t border-white/10 px-20 relative flex items-center overflow-hidden">
      <div className="flex flex-col gap-2 w-full z-10">
        <p className="text-white text-xl font-bold">Mockable - A Mock Interview Platform</p>
        <p className="text-gray-400">© 2025 Mockable. All rights reserved.</p>
      </div>

      <p className="text-[#161616] font-bold text-6xl absolute -bottom-4 right-0 text-right select-none pointer-events-none">
        Made by and for Job Seekers
      </p>
    </div>
  )
}

export default Footer
