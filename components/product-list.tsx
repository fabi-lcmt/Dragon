"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <Link key={product.id} href={`/productos/${product.id}`}>
          <Card className="h-full overflow-hidden transition-all hover:shadow-md">
            <div className="relative aspect-square">
              <Image
                src={product.image || "/placeholder.svg?height=300&width=300"}
                alt={product.name}
                fill
                className="object-contain p-4"
              />
              <div className="absolute right-2 top-2">
                <Badge
                  variant={product.stock > 0 ? "default" : "destructive"}
                  className={product.stock > 0 ? "bg-orange-500" : ""}
                >
                  {product.stock > 0 ? `Disponible: ${product.stock}` : "Agotado"}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold line-clamp-1">{product.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {product.description || "Figura coleccionable de Dragon Ball Z"}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <p className="font-bold text-orange-500">${(product.price / 100).toFixed(2)}</p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
