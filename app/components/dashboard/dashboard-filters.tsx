'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

const ranges = [
    { value: 'today', label: 'Hoy' },
    { value: 'yesterday', label: 'Ayer' },
    { value: 'this_week', label: 'Esta Semana' },
    { value: 'this_month', label: 'Este Mes' },
    { value: 'last_month', label: 'Mes Pasado' },
    { value: 'last_3_months', label: 'Últimos 3 Meses' },
    { value: 'last_6_months', label: 'Últimos 6 Meses' },
    { value: 'this_year', label: 'Este Año' },
    { value: 'all', label: 'Todo (Histórico)' },
]

export function DashboardFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentRange = searchParams.get('range') || 'this_month'

    const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        const params = new URLSearchParams(searchParams)
        params.set('range', value)
        router.push(`/?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border/50 shadow-sm">
            <span className="text-sm font-medium text-muted-foreground">Periodo:</span>
            <div className="relative">
                <select
                    value={currentRange}
                    onChange={handleRangeChange}
                    className="appearance-none w-[180px] bg-background border border-border text-foreground py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm cursor-pointer transition-all"
                >
                    {ranges.map((range) => (
                        <option key={range.value} value={range.value}>
                            {range.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                    <ChevronDown className="h-4 w-4" />
                </div>
            </div>
        </div>
    )
}
