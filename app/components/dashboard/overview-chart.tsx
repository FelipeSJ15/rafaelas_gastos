'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/format'

interface OverviewChartProps {
    data: {
        date: string
        ingresos: number
        egresos: number
    }[]
}

export function OverviewChart({ data }: OverviewChartProps) {
    if (data.length === 0) {
        return (
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Resumen de Movimientos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">
                        No hay datos para mostrar en este periodo
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Resumen de Movimientos</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => {
                                    // Adjust for timezone issues by appending time
                                    const date = new Date(value + 'T00:00:00')
                                    return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
                                }}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-lg border bg-white p-3 shadow-lg">
                                                <div className="text-sm font-medium mb-2 text-gray-500">
                                                    {new Date(label + 'T00:00:00').toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            Ingresos
                                                        </span>
                                                        <span className="font-bold text-emerald-600">
                                                            {formatCurrency(payload[0].value as number)}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            Egresos
                                                        </span>
                                                        <span className="font-bold text-[#82284C]">
                                                            {formatCurrency(payload[1].value as number)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Bar
                                dataKey="ingresos"
                                fill="#10b981"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={50}
                            />
                            <Bar
                                dataKey="egresos"
                                fill="#82284C"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={50}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
