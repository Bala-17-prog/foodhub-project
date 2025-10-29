import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    const storedRestaurant = localStorage.getItem('cartRestaurant');
    
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    if (storedRestaurant) {
      setRestaurant(JSON.parse(storedRestaurant));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
      localStorage.removeItem('cartRestaurant');
      setRestaurant(null);
    }
  }, [cart]);

  // Save restaurant to localStorage
  useEffect(() => {
    if (restaurant) {
      localStorage.setItem('cartRestaurant', JSON.stringify(restaurant));
    }
  }, [restaurant]);

  // Add item to cart
  const addToCart = (item, itemRestaurant) => {
    console.log('=== ADD TO CART DEBUG ===');
    console.log('Item:', item);
    console.log('Item Restaurant:', itemRestaurant);
    console.log('Current Restaurant in Cart:', restaurant);

    // Validate restaurant data
    if (!itemRestaurant || !itemRestaurant._id) {
      toast.error('Restaurant information is missing. Please try again.');
      console.error('Invalid restaurant data:', itemRestaurant);
      return;
    }

    // Check if item is from a different restaurant
    if (restaurant && restaurant._id !== itemRestaurant._id) {
      const confirm = window.confirm(
        `Your cart contains items from ${restaurant.name}. Do you want to clear your cart and add items from ${itemRestaurant.name}?`
      );
      
      if (!confirm) {
        return;
      }
      
      // Clear cart and set new restaurant
      setCart([]);
      setRestaurant(itemRestaurant);
    } else if (!restaurant) {
      console.log('Setting restaurant for the first time:', itemRestaurant);
      setRestaurant(itemRestaurant);
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex((cartItem) => cartItem._id === item._id);

    if (existingItemIndex > -1) {
      // Update quantity
      const newCart = [...cart];
      newCart[existingItemIndex].qty += 1;
      setCart(newCart);
      toast.success('Item quantity updated');
    } else {
      // Add new item
      setCart([...cart, { ...item, qty: 1 }]);
      toast.success('Item added to cart');
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const newCart = cart.filter((item) => item._id !== itemId);
    setCart(newCart);
    toast.info('Item removed from cart');
  };

  // Update item quantity
  const updateQuantity = (itemId, qty) => {
    if (qty < 1) {
      removeFromCart(itemId);
      return;
    }

    const newCart = cart.map((item) =>
      item._id === itemId ? { ...item, qty } : item
    );
    setCart(newCart);
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setRestaurant(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('cartRestaurant');
    toast.info('Cart cleared');
  };

  // Calculate totals
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  };

  const getItemsCount = () => {
    return cart.reduce((count, item) => count + item.qty, 0);
  };

  const getTaxAmount = () => {
    const subtotal = getCartTotal();
    return +(subtotal * 0.05).toFixed(2);
  };

  const getDeliveryFee = () => {
    return cart.length > 0 ? 30 : 0;
  };

  const getGrandTotal = () => {
    return getCartTotal() + getTaxAmount() + getDeliveryFee();
  };

  const value = {
    cart,
    restaurant,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemsCount,
    getTaxAmount,
    getDeliveryFee,
    getGrandTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
