export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCartState] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = getCart();
    setCartState(storedCart);
  }, []);

  const addToCart = (item: CartItem) => {
    const updatedCart = [...cart, item];
    setCartState(updatedCart);
    setCart(updatedCart);
  };

  const updateCartItem = (index: number, quantity: number) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = quantity;
    setCartState(updatedCart);
    setCart(updatedCart);
  };

  const removeCartItem = (index: number) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCartState(updatedCart);
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCartState([]);
    setCart([]);
  };

  const saveTempProduct = (product: CartItem) => {
    saveTemporaryProduct(product);
  };

  const loadTempProduct = (): CartItem | null => {
    return getTemporaryProduct();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
        saveTempProduct,
        loadTempProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
