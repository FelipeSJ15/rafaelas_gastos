'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (authError) {
                setError('Credenciales inválidas. Por favor verifica tu email y contraseña.')
                setLoading(false)
                return
            }

            // Verificar que el usuario tiene perfil activo
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single()

            if (profileError || !profile || !profile.activo) {
                await supabase.auth.signOut()
                setError('Usuario inactivo. Contacta al administrador.')
                setLoading(false)
                return
            }

            // Redirigir al dashboard
            router.push('/')
            router.refresh()
        } catch (err) {
            setError('Error al iniciar sesión. Intenta nuevamente.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex flex-col items-center justify-center bg-[#28493E] text-white p-12 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#82284C] blur-3xl"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                    <div className="w-32 h-32 bg-white/5 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl border border-white/10 transform rotate-3 hover:rotate-0 transition-all duration-500">
                        <span className="text-7xl drop-shadow-lg">💅</span>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-6xl font-bold font-serif tracking-tight">Rafaelas</h1>
                        <p className="text-xl text-gray-300 max-w-md font-light tracking-wide">
                            Control Financiero & Gestión
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-8 text-xs text-gray-500 font-mono">
                    © {new Date().getFullYear()} Rafaelas System
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center bg-[#EFEFEA] p-8 lg:p-12">
                <div className="w-full max-w-md space-y-10">
                    <div className="text-center lg:text-left space-y-2">
                        <div className="lg:hidden mx-auto w-16 h-16 bg-[#28493E] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                            <span className="text-3xl">💅</span>
                        </div>
                        <h2 className="text-4xl font-bold text-[#28493E] font-serif">Bienvenido</h2>
                        <p className="text-[#28493E]/70 text-lg">Ingresa a tu panel de control</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold text-[#28493E] ml-1">
                                Correo Electrónico
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="ejemplo@rafaelas.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="h-12 bg-white border-gray-200 focus:border-[#82284C] focus:ring-[#82284C]/20 rounded-xl text-base shadow-sm transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-semibold text-[#28493E] ml-1">
                                    Contraseña
                                </label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                className="h-12 bg-white border-gray-200 focus:border-[#82284C] focus:ring-[#82284C]/20 rounded-xl text-base shadow-sm transition-all"
                            />
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                                <p className="text-sm font-medium text-red-700">{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-14 bg-[#82284C] hover:bg-[#6b213f] text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Iniciando...</span>
                                </div>
                            ) : 'Iniciar Sesión'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
