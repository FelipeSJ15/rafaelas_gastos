'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Pencil, ChevronRight } from 'lucide-react'
import { deleteCategory } from '@/lib/actions/categories'
import Link from 'next/link'
import type { Categoria } from '@/types/models'

interface CategoryListProps {
    categorias: Categoria[]
    isAdmin?: boolean
}

export function CategoryList({ categorias, isAdmin }: CategoryListProps) {
    const ingresos = categorias.filter(c => c.tipo === 'ingreso' && !c.parent_id)
    const egresos = categorias.filter(c => c.tipo === 'egreso' && !c.parent_id)

    const getSubcategorias = (parentId: string) =>
        categorias.filter(c => c.parent_id === parentId)

    const CategoryItem = ({ cat }: { cat: Categoria }) => {
        const subs = getSubcategorias(cat.id)

        return (
            <div className="border-b border-gray-100 last:border-0">
                <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 group">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">{cat.nombre}</span>
                        {subs.length > 0 && (
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                {subs.length} sub
                            </span>
                        )}
                    </div>
                    {isAdmin && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/categorias/${cat.id}/editar`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Pencil className="w-4 h-4 text-gray-500" />
                                </Button>
                            </Link>
                            <form action={async () => { await deleteCategory(cat.id) }}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Subcategorías */}
                {subs.length > 0 && (
                    <div className="bg-gray-50/50 pl-8 pr-4 py-1">
                        {subs.map(sub => (
                            <div key={sub.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 group/sub">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <ChevronRight className="w-3 h-3 text-gray-400" />
                                    {sub.nombre}
                                </div>
                                {isAdmin && (
                                    <div className="flex gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                        <Link href={`/categorias/${sub.id}/editar`}>
                                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                                <Pencil className="w-3 h-3 text-gray-500" />
                                            </Button>
                                        </Link>
                                        <form action={async () => { await deleteCategory(sub.id) }}>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-red-600">
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Ingresos */}
            <Card>
                <CardHeader className="bg-green-50 border-b border-green-100">
                    <CardTitle className="text-green-700 text-lg">Ingresos</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {ingresos.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            No hay categorías de ingreso
                        </div>
                    ) : (
                        ingresos.map(cat => <CategoryItem key={cat.id} cat={cat} />)
                    )}
                </CardContent>
            </Card>

            {/* Egresos */}
            <Card>
                <CardHeader className="bg-red-50 border-b border-red-100">
                    <CardTitle className="text-red-700 text-lg">Egresos</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {egresos.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            No hay categorías de egreso
                        </div>
                    ) : (
                        egresos.map(cat => <CategoryItem key={cat.id} cat={cat} />)
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
