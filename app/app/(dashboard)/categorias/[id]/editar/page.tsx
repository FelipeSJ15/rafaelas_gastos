import { createClient } from '@/lib/supabase/server'
import { getCategories } from '@/lib/actions/data'
import { CategoryForm } from '@/components/categorias/category-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const [categorias, { data: categoria }] = await Promise.all([
        getCategories(),
        supabase.from('categorias').select('*').eq('id', id).single()
    ])

    if (!categoria) {
        notFound()
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/categorias">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Editar Categoría</h1>
                    <p className="text-gray-500">Modifica los datos de la categoría</p>
                </div>
            </div>

            <CategoryForm categoria={categoria} categoriasPadre={categorias} />
        </div>
    )
}
