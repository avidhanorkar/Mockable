import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Github, Menu, X, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/authContext'

const navItems = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Comparison', href: '/#comparison' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' },
]

const Navbar = () => {
  const { user, logout } = useAuth()
  const { scrollY } = useScroll()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Transform scale and opacity of navbar on scroll
  const navY = useTransform(scrollY, [0, 100], [16, 8])
  const navWidth = useTransform(scrollY, [0, 100], ['92%', '85%'])
  const navBg = useTransform(
    scrollY,
    [0, 100],
    ['rgba(8, 8, 8, 0.4)', 'rgba(8, 8, 8, 0.85)']
  )
  const navBorder = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0.04)', 'rgba(255, 255, 255, 0.08)']
  )
  const shadow = useTransform(
    scrollY,
    [0, 100],
    ['none', '0 20px 40px -15px rgba(0, 0, 0, 0.7)']
  )

  return (
    <motion.header
      style={{
        y: navY,
        width: navWidth,
        backgroundColor: navBg,
        borderColor: navBorder,
        boxShadow: shadow,
      }}
      className="fixed inset-x-0 mx-auto z-50 flex h-14 max-w-5xl items-center justify-between rounded-full border px-6 backdrop-blur-xl transition-all duration-300"
    >
      {/* Brand logo */}
      <Link to="/" className="group flex items-center gap-2 text-white">
        <div className="relative flex size-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition duration-300 group-hover:border-white/30 overflow-hidden">
          {/* <Sparkles className="size-3.5 text-white/80 transition-transform group-hover:scale-110" /> */}
          <img src="/logo.png" alt="Mockable Logo" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
        </div>
        <span className="font-mono text-sm font-medium tracking-tight text-neutral-200">
          mockable<span className="text-white/40">.ai</span>
        </span>
      </Link>

      {/* Nav items for desktop */}
      <nav className="hidden items-center gap-6 lg:flex">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="font-mono text-[11px] tracking-wider uppercase text-neutral-400 transition-colors duration-200 hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Actions */}
      <div className="hidden items-center gap-4 lg:flex">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="text-neutral-400 transition hover:text-white"
          aria-label="Github"
        >
          <Github className="size-4" />
        </a>

        <div className="h-4 w-[1px] bg-white/10" />

        {user ? (
          <>
            <button
              onClick={() => logout()}
              className="font-mono text-[11px] text-neutral-350 hover:text-white cursor-pointer transition-colors duration-200"
            >
              Sign Out
            </button>
            <Link
              to="/api-setup"
              className="font-mono text-[11px] text-neutral-350 hover:text-white cursor-pointer transition-colors duration-200"
            >
              API Key
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-1 rounded-full bg-white px-4 py-1.5 font-mono text-[11px] font-semibold text-black transition hover:bg-neutral-200"
            >
              Dashboard <ArrowRight className="size-3" />
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="font-mono text-[11px] text-neutral-300 hover:text-white"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-white px-4 py-1.5 font-mono text-[11px] font-semibold text-black transition hover:bg-neutral-200"
            >
              Start Free
            </Link>
          </>
        )}
      </div>

      {/* Mobile menu triggers */}
      <div className="flex items-center gap-3 lg:hidden">
        {user ? (
          <Link
            to="/dashboard"
            className="rounded-full bg-white px-3.5 py-1.5 font-mono text-[10px] font-semibold text-black transition hover:bg-neutral-200"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            to="/register"
            className="rounded-full bg-white px-3.5 py-1.5 font-mono text-[10px] font-semibold text-black transition hover:bg-neutral-200"
          >
            Start Free
          </Link>
        )}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-neutral-400 hover:text-white focus:outline-none"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-16 z-40 flex flex-col gap-4 rounded-3xl border border-white/10 bg-neutral-950/95 p-6 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-white/5 pb-2 font-mono text-xs tracking-wider uppercase text-neutral-400 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
            
            {user ? (
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="font-mono text-xs text-neutral-350 hover:text-white cursor-pointer"
                >
                  Sign Out
                </button>
                <div className="flex items-center gap-4">
                  <Link
                    to="/api-setup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-mono text-xs text-neutral-350 hover:text-white"
                  >
                    API Key
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-full bg-white px-4 py-1.5 font-mono text-[11px] font-semibold text-black hover:bg-neutral-200"
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-mono text-xs text-neutral-300 hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full bg-white px-4 py-2 font-mono text-xs font-semibold text-black hover:bg-neutral-200"
                >
                  Create Account
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Navbar
