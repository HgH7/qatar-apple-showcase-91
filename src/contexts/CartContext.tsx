import { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItemProperties {
  color?: string;
  storage?: string;
  size?: string;
}

export interface CartItem {
  productId: number;
  productSlug: string;
  name: { en: string; ar: string };
  price: number;
  quantity: number;
  properties: CartItemProperties;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: number, properties: CartItemProperties) => void;
  updateQuantity: (productId: number, properties: CartItemProperties, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getItemKey = (productId: number, properties: CartItemProperties): string => {
  return `${productId}-${properties.color || ''}-${properties.storage || ''}-${properties.size || ''}`;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.properties.color === newItem.properties.color &&
          item.properties.storage === newItem.properties.storage &&
          item.properties.size === newItem.properties.size
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }

      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (productId: number, properties: CartItemProperties) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.properties.color === properties.color &&
            item.properties.storage === properties.storage &&
            item.properties.size === properties.size
          )
      )
    );
  };

  const updateQuantity = (productId: number, properties: CartItemProperties, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId, properties);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId &&
        item.properties.color === properties.color &&
        item.properties.storage === properties.storage &&
        item.properties.size === properties.size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
