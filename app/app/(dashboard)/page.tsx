import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, PieChart, Wallet, Building2, CreditCard, Banknote } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/format'
import { DashboardFilters } from '@/components/dashboard/dashboard-filters'
import { getAccountsWithBalance, getChartData } from '@/lib/actions/data'
import { OverviewChart } from '@/components/dashboard/overview-chart'
import {
    startOfDay, endOfDay, subDays, startOfWeek, endOfWeek,
    startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear
} from 'date-fns'

async function getDashboardStats(startDate: string | null, endDate: string | null) {
    const supabase = await createClient()

    // Obtener saldo total (este es global, no depende del filtro de fecha)
    const { data: saldoData } = await supabase.rpc('calcular_saldo_total')
    const saldoTotal = saldoData || 0

    // Construir query dinámica
    let query = supabase
        .from('movimientos')
        .select('tipo, monto')
        .eq('anulado', false)

    // Aplicar filtro de fecha solo si no es "Todo"
    if (startDate && endDate) {
        query = query.gte('fecha', startDate).lte('fecha', endDate)
    }

    const { data: movimientos } = await query

    let ingresosMes = 0
    let egresosMes = 0

    movimientos?.forEach((mov) => {
        if (mov.tipo === 'ingreso') {
            ingresosMes += Number(mov.monto)
        } else if (mov.tipo === 'egreso') {
            egresosMes += Number(mov.monto)
        }
    })

    const resultadoMes = ingresosMes - egresosMes

    return {
        saldoTotal,
        ingresosMes,
        egresosMes,
        resultadoMes,
    }
}

async function getRecentMovements() {
    const supabase = await createClient()

    const { data } = await supabase
        .from('vista_movimientos_completos')
        .select('*')
        .eq('anulado', false)
        .order('fecha', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(5)

    return data || []
}

const accountIcons = {
    banco: Building2,
    efectivo: Banknote,
    tarjeta: CreditCard,
    billetera: Wallet,
}

const accountColors = {
    banco: 'text-secondary bg-secondary/10',
    efectivo: 'text-emerald-600 bg-emerald-50',
    tarjeta: 'text-primary bg-primary/10',
    billetera: 'text-amber-600 bg-amber-50',
}

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ range?: string }>
}) {
    const params = await searchParams
    const range = params.range || 'this_month'

    const now = new Date()
    let startDate: string | null = null
    let endDate: string | null = null

    // Lógica para calcular fechas según el rango seleccionado
    switch (range) {
        case 'today':
            startDate = startOfDay(now).toISOString()
            endDate = endOfDay(now).toISOString()
            break
        case 'yesterday':
            const yesterday = subDays(now, 1)
            startDate = startOfDay(yesterday).toISOString()
            endDate = endOfDay(yesterday).toISOString()
            break
        case 'this_week':
            // Semana empieza el Lunes (1)
            startDate = startOfWeek(now, { weekStartsOn: 1 }).toISOString()
            endDate = endOfWeek(now, { weekStartsOn: 1 }).toISOString()
            break
        case 'this_month':
            startDate = startOfMonth(now).toISOString()
            endDate = endOfDay(now).toISOString()
            break
        case 'last_month':
            const lastMonth = subMonths(now, 1)
            startDate = startOfMonth(lastMonth).toISOString()
            endDate = endOfMonth(lastMonth).toISOString()
            break
        case 'last_3_months':
            startDate = startOfMonth(subMonths(now, 3)).toISOString()
            endDate = endOfDay(now).toISOString()
            break
        case 'last_6_months':
            startDate = startOfMonth(subMonths(now, 6)).toISOString()
            endDate = endOfDay(now).toISOString()
            break
        case 'this_year':
            startDate = startOfYear(now).toISOString()
            endDate = endOfDay(now).toISOString()
            break
        case 'all':
            startDate = null
            endDate = null
            break
        default:
            startDate = startOfMonth(now).toISOString()
            endDate = endOfDay(now).toISOString()
    }

    const stats = await getDashboardStats(startDate, endDate)
    const recentMovements = await getRecentMovements()
    const accounts = await getAccountsWithBalance()
    const chartData = await getChartData(startDate, endDate)

    const statsCards = [
        {
            title: 'Saldo Total',
            value: stats.saldoTotal,
            icon: DollarSign,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            description: 'Balance global actual'
        },
        {
            title: 'Ingresos',
            value: stats.ingresosMes,
            icon: TrendingUp,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            description: 'En el periodo seleccionado'
        },
        {
            title: 'Egresos',
            value: stats.egresosMes,
            icon: TrendingDown,
            color: 'text-rose-600',
            bgColor: 'bg-rose-50',
            description: 'En el periodo seleccionado'
        },
        {
            title: 'Resultado',
            value: stats.resultadoMes,
            icon: PieChart,
            color: stats.resultadoMes >= 0 ? 'text-secondary' : 'text-rose-600',
            bgColor: stats.resultadoMes >= 0 ? 'bg-secondary/10' : 'bg-rose-50',
            description: 'Balance del periodo'
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground font-serif">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Resumen financiero</p>
                </div>
                <DashboardFilters />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statsCards.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${stat.color}`}>
                                {formatCurrency(stat.value)}
                            </div>
                            <p className="text-xs text-muted-foreground/80 mt-1">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Chart Section */}
            <OverviewChart data={chartData} />

            <div className="grid gap-6 md:grid-cols-2">
                {/* Cuentas */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Mis Cuentas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {accounts.map((account) => {
                                const Icon = accountIcons[account.tipo as keyof typeof accountIcons] || Building2
                                const colorClass = accountColors[account.tipo as keyof typeof accountColors] || accountColors.banco

                                return (
                                    <div key={account.id} className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-muted/20 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${colorClass}`}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{account.nombre}</p>
                                                <p className="text-xs text-muted-foreground capitalize">{account.tipo}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-semibold ${account.saldo && account.saldo < 0 ? 'text-rose-600' : 'text-foreground'}`}>
                                                {formatCurrency(account.saldo || 0)}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                            {accounts.length === 0 && (
                                <p className="text-center text-muted-foreground py-4">No hay cuentas registradas</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Movements */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Movimientos Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentMovements.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">
                                No hay movimientos registrados
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {recentMovements.map((mov) => (
                                    <div
                                        key={mov.id}
                                        className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-muted/20 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`p-2 rounded-lg ${mov.tipo === 'ingreso'
                                                    ? 'bg-emerald-50'
                                                    : mov.tipo === 'egreso'
                                                        ? 'bg-rose-50'
                                                        : 'bg-secondary/10'
                                                    }`}
                                            >
                                                {mov.tipo === 'ingreso' ? (
                                                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                                                ) : mov.tipo === 'egreso' ? (
                                                    <TrendingDown className="h-4 w-4 text-rose-600" />
                                                ) : (
                                                    <PieChart className="h-4 w-4 text-secondary" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {mov.categoria_nombre || 'Transferencia'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {mov.cuenta_destino_nombre || mov.cuenta_origen_nombre}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p
                                                className={`font-semibold ${mov.tipo === 'ingreso'
                                                    ? 'text-emerald-600'
                                                    : mov.tipo === 'egreso'
                                                        ? 'text-rose-600'
                                                        : 'text-secondary'
                                                    }`}
                                            >
                                                {mov.tipo === 'egreso' ? '-' : '+'}
                                                {formatCurrency(Number(mov.monto))}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(mov.fecha).toLocaleDateString('es-CO')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
