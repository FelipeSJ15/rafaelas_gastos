'use server'

import { createClient } from '@/lib/supabase/server'

export async function getAccounts() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('cuentas')
        .select('*')
        .eq('activa', true)
        .order('nombre')

    return data || []
}

export async function getAccountsWithBalance() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('vista_saldos_cuentas')
        .select('*')
        .eq('activa', true)
        .order('nombre')

    return data || []
}

export async function getCategories() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('categorias')
        .select('*')
        .eq('activa', true)
        .order('nombre')

    return data || []
}

export async function getChartData(startDate: string | null, endDate: string | null) {
    const supabase = await createClient()

    let query = supabase
        .from('movimientos')
        .select('fecha, tipo, monto')
        .eq('anulado', false)

    if (startDate && endDate) {
        query = query.gte('fecha', startDate).lte('fecha', endDate)
    }

    const { data } = await query

    if (!data) return []

    // Group by date
    const grouped = data.reduce((acc, curr) => {
        const date = curr.fecha.split('T')[0] // Assuming ISO string
        if (!acc[date]) {
            acc[date] = { date, ingresos: 0, egresos: 0 }
        }
        if (curr.tipo === 'ingreso') {
            acc[date].ingresos += Number(curr.monto)
        } else if (curr.tipo === 'egreso') {
            acc[date].egresos += Number(curr.monto)
        }
        return acc
    }, {} as Record<string, { date: string, ingresos: number, egresos: number }>)

    // Sort by date
    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date))
}
