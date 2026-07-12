import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import axios from 'axios'
import useGoogleAuth from "../config/googleAuth"
import { Sparkles, ArrowRight } from 'lucide-react'
import { API_BASE_URL } from '../config/api'
import { useSEO } from '../hooks/useSEO'

const Register = () => {
    useSEO({
      title: 'Sign Up Free – Mockable AI Mock Interview Platform',
      description: 'Create your free Mockable account. Get personalized AI interview questions, real-time speech analysis, and detailed feedback reports to land your dream job faster.',
      canonical: 'https://mockableinterviews.vercel.app/register',
    })
    const navigate = useNavigate()
    const { login } = useAuth()
    const googleLogin = useGoogleAuth()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        const user = {
            name,
            email,
            password
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/v1/auth/register`, user, {
                withCredentials: true
            })
            login(response.data.token, response.data.user)
            const hasApiKey = localStorage.getItem('gemini_api_key');
            navigate(hasApiKey ? '/dashboard' : '/api-setup')
        } catch (error) {
            console.error("Registration failed", error)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center relative px-6 py-24 overflow-hidden">
            {/* Ambient Background Dotted Grid */}
            <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-45" />
            <div className="absolute left-1/2 top-1/2 h-[350px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.015] blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-sm rounded-2xl border border-neutral-900 bg-neutral-950/40 p-8 shadow-2xl backdrop-blur-xl">
                {/* Header Logo & Spark */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex size-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950 mb-4">
                        <Sparkles className="size-4 text-white/80" />
                    </div>
                    <h1 className="font-sans text-xl font-medium tracking-tight text-white">Create Account</h1>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mt-1">
                        CALIBRATE INTERVIEW READINESS
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2.5">
                        <input
                            type="text"
                            placeholder="FULL NAME"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-900 rounded-full px-4 py-2.5 font-mono text-[10px] tracking-wider uppercase text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-800 transition-colors"
                            required
                        />
                        <input
                            type="email"
                            placeholder="EMAIL ADDRESS"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-900 rounded-full px-4 py-2.5 font-mono text-[10px] tracking-wider uppercase text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-800 transition-colors"
                            required
                        />
                        <input
                            type="password"
                            placeholder="PASSWORD"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-900 rounded-full px-4 py-2.5 font-mono text-[10px] tracking-wider uppercase text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-800 transition-colors"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-black py-2.5 rounded-full font-mono text-[10px] font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                        Sign Up <ArrowRight className="size-3" />
                    </button>
                </form>

                {/* Divider */}
                <div className="relative py-5">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-neutral-900"></span>
                    </div>
                    <div className="relative flex justify-center text-[9px] uppercase">
                        <span className="bg-neutral-950 px-2.5 font-mono text-neutral-600">Or continue with</span>
                    </div>
                </div>

                {/* Google Auth button */}
                <button
                    onClick={() => googleLogin()}
                    className="w-full bg-neutral-950 border border-neutral-850 text-neutral-350 py-2.5 rounded-full font-mono text-[10px] font-semibold uppercase tracking-wider hover:bg-neutral-900 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#FFFFFF"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#FFFFFF"
                            fillOpacity="0.7"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FFFFFF"
                            fillOpacity="0.5"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#FFFFFF"
                            fillOpacity="0.8"
                        />
                    </svg>
                    Google Account
                </button>

                <div className="mt-6 flex flex-col gap-2.5 text-center font-mono text-[9px]">
                    <p className="text-neutral-500">
                        Already have an account?{' '}
                        <button onClick={() => navigate('/login')} className="text-white hover:underline cursor-pointer">
                            Sign In
                        </button>
                    </p>
                    <button onClick={() => navigate('/')} className="text-neutral-400 hover:text-white cursor-pointer mt-1">
                        Back to system homepage
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Register
