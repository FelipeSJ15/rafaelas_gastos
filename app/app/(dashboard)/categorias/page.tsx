import { createClient } from '@/lib/supabase/server'
import { getCategories } from '@/lib/actions/data'
import { CategoryList } from '@/components/categorias/category-list'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function CategoriasPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Obtener perfil para verificar rol
    const { data: profile } = await supabase
        .from('profiles')
        .select('rol')
        .eq('id', user?.id)
        .single()

    const isAdmin = profile?.rol === 'admin'
    const categorias = await getCategories()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
                    <p className="text-gray-500 mt-1">Organiza tus conceptos de ingresos y gastos</p>
                </div>
                {isAdmin && (
                    <Link href="/categorias/nueva">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nueva Categoría
                        </Button>
                    </Link>
                )}
            </div>

            <CategoryList categorias={categorias} isAdmin={isAdmin} />
        </div>
    )
}
