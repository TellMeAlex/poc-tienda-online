import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Calcular total del carrito
  const getTotal = () => {
    return items.reduce((total, item) => {
      const itemPrice = item.discount
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  // Obtener cantidad total de items
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Añadir producto al carrito
  const addToCart = (product, quantity = 1, selectedSize = null, selectedColor = null) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.id === product.id &&
                item.selectedSize === selectedSize &&
                item.selectedColor === selectedColor
      );

      if (existingItem) {
        // Si ya existe, incrementar cantidad
        return prevItems.map(item =>
          item.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si no existe, añadir nuevo item
        return [...prevItems, {
          ...product,
          quantity,
          selectedSize,
          selectedColor,
          addedAt: new Date().toISOString()
        }];
      }
    });

    // Mostrar el carrito brevemente cuando se añade un item
    setIsCartOpen(true);
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId, selectedSize = null, selectedColor = null) => {
    setItems(prevItems =>
      prevItems.filter(item =>
        !(item.id === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor)
      )
    );
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, quantity, selectedSize = null, selectedColor = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Limpiar carrito
  const clearCart = () => {
    setItems([]);
    setIsCartOpen(false);
  };

  // Verificar si un producto está en el carrito
  const isInCart = (productId) => {
    return items.some(item => item.id === productId);
  };

  // Obtener cantidad de un producto en el carrito
  const getProductQuantity = (productId, selectedSize = null, selectedColor = null) => {
    const item = items.find(
      item => item.id === productId &&
              item.selectedSize === selectedSize &&
              item.selectedColor === selectedColor
    );
    return item ? item.quantity : 0;
  };

  // Abrir/cerrar carrito
  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const value = {
    items,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getTotalItems,
    isInCart,
    getProductQuantity,
    toggleCart,
    openCart,
    closeCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};
