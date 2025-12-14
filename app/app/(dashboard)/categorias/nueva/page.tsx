import { getCategories } from '@/lib/actions/data'
import { CategoryForm } from '@/components/categorias/category-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function NewCategoryPage() {
    const categorias = await getCategories()

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/categorias">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Nueva Categoría</h1>
                    <p className="text-gray-500">Crea una categoría para clasificar tus movimientos</p>
                </div>
            </div>

            <CategoryForm categoriasPadre={categorias} />
        </div>
    )
}
