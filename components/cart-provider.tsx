"use client"

import type { Product } from "@/lib/types"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useProducts } from "@/lib/products-context"
import { toast } from "@/components/ui/use-toast"

interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product) => boolean
  removeFromCart: (productId: number) => void
  clearCart: () => void
  getItemQuantity: (productId: number) => number
  getTotalPrice: () => number
  checkout: () => Promise<boolean>
  isStockAvailable: (product: Product, quantity: number) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { updateStock, getProduct } = useProducts()

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items))
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [items])

  const isStockAvailable = (product: Product, quantity: number) => {
    // Obtenemos el producto actualizado para verificar el stock actual
    const currentProduct = getProduct(product.id) || product
    return currentProduct.stock >= quantity
  }

  const addToCart = (product: Product) => {
    let success = false

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id)

      // Obtenemos el producto actualizado para verificar el stock actual
      const currentProduct = getProduct(product.id) || product

      if (existingItem) {
        // Verificar si hay suficiente stock para agregar uno más
        if (existingItem.quantity < currentProduct.stock) {
          success = true
          return prevItems.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1, product: currentProduct } : item,
          )
        } else {
          toast({
            title: "Stock insuficiente",
            description: `Solo hay ${currentProduct.stock} unidades disponibles de ${currentProduct.name}`,
            variant: "destructive",
          })
          return prevItems
        }
      }

      // Si es un producto nuevo, verificar que haya stock
      if (currentProduct.stock > 0) {
        success = true
        return [...prevItems, { product: currentProduct, quantity: 1 }]
      } else {
        toast({
          title: "Producto agotado",
          description: `${currentProduct.name} está agotado`,
          variant: "destructive",
        })
        return prevItems
      }
    })

    return success
  }

  const removeFromCart = (productId: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === productId)

      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
        )
      }

      return prevItems.filter((item) => item.product.id !== productId)
    })
  }

  const clearCart = () => {
    setItems([])
  }

  const getItemQuantity = (productId: number) => {
    const item = items.find((item) => item.product.id === productId)
    return item ? item.quantity : 0
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity) / 100, 0)
  }

  const checkout = async () => {
    try {
      // Verificar que todos los productos tengan stock suficiente
      for (const item of items) {
        const currentProduct = getProduct(item.product.id) || item.product

        if (item.quantity > currentProduct.stock) {
          toast({
            title: "Stock insuficiente",
            description: `No hay suficiente stock de ${currentProduct.name}. Solo quedan ${currentProduct.stock} unidades.`,
            variant: "destructive",
          })
          return false
        }
      }

      // Actualizar el stock de cada producto
      for (const item of items) {
        const currentProduct = getProduct(item.product.id) || item.product
        const newStock = currentProduct.stock - item.quantity
        updateStock(item.product.id, newStock)
      }

      // Limpiar el carrito después de la compra exitosa
      clearCart()

      toast({
        title: "¡Compra exitosa!",
        description: "Tu pedido ha sido procesado correctamente.",
      })

      return true
    } catch (error) {
      console.error("Error al procesar la compra:", error)
      toast({
        title: "Error al procesar la compra",
        description: "Ha ocurrido un error al procesar tu compra. Inténtalo de nuevo.",
        variant: "destructive",
      })
      return false
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        getItemQuantity,
        getTotalPrice,
        checkout,
        isStockAvailable,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
