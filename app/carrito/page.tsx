"use client"

import { useCart } from "@/components/cart-provider"
import { useProducts } from "@/lib/products-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, ShoppingCart, Trash2, AlertCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function CarritoPage() {
  const { items, addToCart, removeFromCart, clearCart, getTotalPrice, checkout, isStockAvailable } = useCart()
  const { getProduct } = useProducts()
  const [processing, setProcessing] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const [stockIssues, setStockIssues] = useState<{ id: number; name: string; requested: number; available: number }[]>(
    [],
  )

  // Verificar problemas de stock cuando cambian los items o los productos
  useEffect(() => {
    const issues = items
      .filter((item) => {
        const currentProduct = getProduct(item.product.id)
        return currentProduct && item.quantity > currentProduct.stock
      })
      .map((item) => {
        const currentProduct = getProduct(item.product.id) || item.product
        return {
          id: item.product.id,
          name: item.product.name,
          requested: item.quantity,
          available: currentProduct.stock,
        }
      })

    setStockIssues(issues)
  }, [items, getProduct])

  const handleCheckout = async () => {
    setProcessing(true)
    try {
      // Verificar stock antes de proceder
      if (stockIssues.length > 0) {
        toast({
          title: "Stock insuficiente",
          description: "Hay problemas de stock en tu carrito. Por favor, revisa las cantidades.",
          variant: "destructive",
        })
        setProcessing(false)
        return
      }

      const success = await checkout()
      if (success) {
        router.push("/productos")
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error)
      toast({
        title: "Error al procesar el pago",
        description: "Ha ocurrido un error al procesar tu pago. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container flex flex-col items-center justify-center py-16 text-center">
        <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="mt-2 text-muted-foreground">Parece que aún no has añadido ningún producto a tu carrito.</p>
        <Button asChild className="mt-8 bg-orange-500 hover:bg-orange-600">
          <Link href="/productos">Ver productos</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Tu Carrito</h1>

      {stockIssues.length > 0 && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            <h3 className="font-semibold">Problemas de stock</h3>
          </div>
          <ul className="ml-7 mt-2 list-disc">
            {stockIssues.map((issue) => (
              <li key={issue.id}>
                {issue.name}: Solicitaste {issue.requested} unidades, pero solo hay {issue.available} disponibles.
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              {items.map((item) => {
                // Obtener el producto actualizado para mostrar el stock actual
                const currentProduct = getProduct(item.product.id) || item.product
                const hasStockIssue = item.quantity > currentProduct.stock

                return (
                  <div key={item.product.id}>
                    <div className="flex flex-col items-start gap-4 sm:flex-row">
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={currentProduct.image || "/placeholder.svg?height=100&width=100"}
                          alt={currentProduct.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium">
                            <Link href={`/productos/${currentProduct.id}`} className="hover:text-orange-500">
                              {currentProduct.name}
                            </Link>
                          </h3>
                          <p className="ml-4 text-lg font-medium">
                            ${((currentProduct.price * item.quantity) / 100).toFixed(2)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {currentProduct.description || "Figura coleccionable de Dragon Ball Z"}
                        </p>
                        <div className="mt-2 flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeFromCart(currentProduct.id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-2 w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => addToCart(currentProduct)}
                            disabled={item.quantity >= currentProduct.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-auto h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => {
                              for (let i = 0; i < item.quantity; i++) {
                                removeFromCart(currentProduct.id)
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {hasStockIssue && (
                          <div className="mt-2 text-xs text-red-500">
                            ¡Solo hay {currentProduct.stock} unidades disponibles!
                          </div>
                        )}
                      </div>
                    </div>
                    <Separator className="my-6" />
                  </div>
                )
              })}
            </CardContent>
            <CardFooter className="flex justify-between px-6 py-4">
              <Button variant="outline" onClick={clearCart} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Vaciar carrito
              </Button>
              <Button asChild>
                <Link href="/productos">Seguir comprando</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold">Resumen del pedido</h2>
              <Separator className="my-4" />
              <div className="space-y-2">
                {items.map((item) => {
                  const currentProduct = getProduct(item.product.id) || item.product
                  return (
                    <div key={item.product.id} className="flex justify-between">
                      <span className="text-muted-foreground">
                        {currentProduct.name} x {item.quantity}
                      </span>
                      <span>${((currentProduct.price * item.quantity) / 100).toFixed(2)}</span>
                    </div>
                  )
                })}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-orange-500">${getTotalPrice().toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="px-6 py-4">
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={handleCheckout}
                disabled={processing || stockIssues.length > 0}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Proceder al pago"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
