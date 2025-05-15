"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, Loader2, AlertCircle } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useProducts } from "@/lib/products-context"
import { useToast } from "@/components/ui/use-toast"
import type { Product } from "@/lib/types"

export default function ProductoPage() {
  const router = useRouter()
  const params = useParams()
  const { addToCart, removeFromCart, getItemQuantity, isStockAvailable } = useCart()
  const { products, getProduct } = useProducts()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        if (params.id) {
          const productId = Number.parseInt(params.id as string)
          const productData = getProduct(productId)

          if (productData) {
            setProduct(productData)
            setQuantity(getItemQuantity(productData.id))
          } else {
            throw new Error(`Producto con ID ${productId} no encontrado`)
          }
        }
      } catch (error) {
        console.error("Error al cargar el producto:", error)
        router.push("/productos")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, router, getItemQuantity, getProduct])

  // Actualizar el producto cuando cambie en el contexto
  useEffect(() => {
    if (product) {
      const updatedProduct = getProduct(product.id)
      if (updatedProduct) {
        setProduct(updatedProduct)
      }
    }
  }, [products, product, getProduct])

  const handlePrevProduct = () => {
    if (!product || products.length === 0) return
    const currentIndex = products.findIndex((p) => p.id === product.id)
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : products.length - 1
    router.push(`/productos/${products[prevIndex].id}`)
  }

  const handleNextProduct = () => {
    if (!product || products.length === 0) return
    const currentIndex = products.findIndex((p) => p.id === product.id)
    const nextIndex = currentIndex < products.length - 1 ? currentIndex + 1 : 0
    router.push(`/productos/${products[nextIndex].id}`)
  }

  const handleAddToCart = () => {
    if (product) {
      if (product.stock <= 0) {
        toast({
          title: "Producto agotado",
          description: "Este producto está agotado",
          variant: "destructive",
        })
        return
      }

      if (quantity >= product.stock) {
        toast({
          title: "Stock insuficiente",
          description: `Solo hay ${product.stock} unidades disponibles`,
          variant: "destructive",
        })
        return
      }

      const success = addToCart(product)
      if (success) {
        setQuantity((prev) => prev + 1)
      }
    }
  }

  const handleRemoveFromCart = () => {
    if (product && quantity > 0) {
      removeFromCart(product.id)
      setQuantity((prev) => prev - 1)
    }
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container flex items-center justify-center py-16">
        <p>Producto no encontrado</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative min-h-[300px] md:min-h-[500px]">
            <Image
              src={product.image || "/placeholder.svg?height=500&width=500"}
              alt={product.name}
              fill
              className="object-contain p-4"
            />
            <div className="absolute right-4 top-4">
              <Badge
                variant={product.stock > 0 ? "default" : "destructive"}
                className={product.stock > 0 ? "text-md bg-orange-500" : "text-md"}
              >
                {product.stock > 0 ? `Disponible: ${product.stock}` : "Agotado"}
              </Badge>
            </div>
          </div>
          <CardContent className="flex flex-col justify-between p-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="mt-4 text-2xl font-semibold text-orange-500">${(product.price / 100).toFixed(2)}</p>
              <div className="mt-6 space-y-4">
                <p className="text-muted-foreground">
                  {product.description || "Figura coleccionable de alta calidad de Dragon Ball Z."}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {product.stock <= 0 ? (
                <div className="flex items-center rounded-md border border-red-200 bg-red-50 p-3 text-red-600">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  <span>Este producto está agotado</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="icon" onClick={handleRemoveFromCart} disabled={quantity === 0}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleAddToCart}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    {quantity > 0 && (
                      <span className="ml-4 flex items-center text-sm text-muted-foreground">
                        
                      </span>
                    )}
                  </div>

                  {quantity >= product.stock && (
                    <div className="flex items-center rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-600">
                      <AlertCircle className="mr-2 h-5 w-5" />
                      <span>Has alcanzado el límite de stock disponible</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </div>
      </Card>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={handlePrevProduct} className="flex items-center">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Producto anterior
        </Button>
        <Button variant="outline" onClick={handleNextProduct} className="flex items-center">
          Producto siguiente
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
