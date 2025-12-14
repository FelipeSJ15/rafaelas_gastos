'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, TrendingUp, Wallet, Tag, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/lib/hooks/use-user'
import { cn } from '@/lib/utils/cn'

const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Movimientos', href: '/movimientos', icon: TrendingUp },
    { name: 'Cuentas', href: '/cuentas', icon: Wallet },
    { name: 'Categorías', href: '/categorias', icon: Tag },
]

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { profile, loading } = useUser()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    if (loading) {
        return null
    }

    return (
        <div className="flex h-screen w-64 flex-col bg-[#28493E] text-white shadow-xl">
            {/* Logo */}
            <div className="flex h-20 items-center px-6 border-b border-[#3a6355]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">💅</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold font-serif tracking-wide">Rafaelas</h1>
                        <p className="text-xs text-gray-300">Control Financiero</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-4 py-6">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-[#82284C] text-white shadow-md translate-x-1'
                                    : 'text-gray-300 hover:bg-[#3a6355] hover:text-white hover:translate-x-1'
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* User info */}
            <div className="border-t border-[#3a6355] p-6 bg-[#234036]">
                <div className="mb-4">
                    <p className="text-sm font-bold text-white">{profile?.nombre_completo || profile?.email}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">
                        {profile?.rol === 'admin' ? 'Administrador' : 'Usuario'}
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#82284C] hover:text-white transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    )
}
