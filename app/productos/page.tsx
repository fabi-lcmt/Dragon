"use client"

import ProductList from "@/components/product-list"
import { useProducts } from "@/lib/products-context"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function ProductosPage() {
  const { products } = useProducts()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="mb-8 text-3xl font-bold">Productos de Dragon Ball Z</h1>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Productos de Dragon Ball Z</h1>
      <ProductList products={products} />
    </div>
  )
}
