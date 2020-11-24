import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const storedProducts = await AsyncStorage.getItem(
        '@GoMarketplace: products',
      );
      if (storedProducts) setProducts(JSON.parse(storedProducts));
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      // TODO ADD A NEW ITEM TO THE CART
      const { id } = product;
      const existProduct = products.findIndex(p => {
        return p.id === id;
      });

      let setStorageProducts;
      if (existProduct !== -1) {
        const incrementProduct = products.map((item: Product) => {
          if (item.id === id) {
            const quantity = item.quantity + 1;
            return { ...item, quantity };
          }
          return item;
        });
        setStorageProducts = incrementProduct;
        setProducts(setStorageProducts);
      } else {
        const newProducts = [...products, { ...product, quantity: 1 }];
        setStorageProducts = newProducts;
        setProducts(setStorageProducts);
      }
      await AsyncStorage.setItem(
        '@GoMarketplace: products',
        JSON.stringify(setStorageProducts),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      const incrementProduct = products.map((item: Product) => {
        if (item.id === id) {
          const quantity = item.quantity + 1;
          return { ...item, quantity };
        }
        return item;
      });
      const setStorageProducts = incrementProduct;
      setProducts(setStorageProducts);
      await AsyncStorage.setItem(
        '@GoMarketplace: products',
        JSON.stringify(setStorageProducts),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      const cart = products.map(product =>
        product.id === id
          ? { ...product, quantity: product.quantity - 1 }
          : product,
      );

      const UpdatedProducts = cart.filter(product => product.quantity > 0);
      setProducts(UpdatedProducts);
      await AsyncStorage.setItem(
        '@GoMarketplace: products',
        JSON.stringify(UpdatedProducts),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
