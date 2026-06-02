'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../lib/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) { setCart(null); return; }
    try {
      setLoading(true);
      const { data } = await cartAPI.get();
      setCart(data.cart);
    } catch (error) {
      console.error('Cart fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isLoggedIn) {
      toast.error('Please login to add items to cart');
      window.location.href = '/auth/login';
      return;
    }
    try {
      const { data } = await cartAPI.add(productId, quantity);
      setCart(data.cart);
      toast.success('Added to cart! 🛒');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateItem = async (productId, quantity) => {
    try {
      const { data } = await cartAPI.update(productId, quantity);
      setCart(data.cart);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await cartAPI.remove(productId);
      setCart(data.cart);
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCart((prev) => prev ? { ...prev, items: [], discount: 0, couponCode: null } : null);
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  };

  const applyCoupon = async (code) => {
    try {
      const { data } = await cartAPI.applyCoupon(code);
      setCart((prev) => prev ? { ...prev, discount: data.discount, couponCode: code } : null);
      toast.success(data.message);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon');
      return false;
    }
  };

  const removeCoupon = async () => {
    try {
      await cartAPI.removeCoupon();
      setCart((prev) => prev ? { ...prev, discount: 0, couponCode: null } : null);
      toast.success('Coupon removed');
    } catch (error) {
      toast.error('Failed to remove coupon');
    }
  };

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const subtotal = cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const discount = cart?.discount || 0;
  const shipping = subtotal >= 499 ? 0 : (subtotal > 0 ? 49 : 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.max(subtotal + tax + shipping - discount, 0);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      itemCount,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      fetchCart,
      addToCart,
      updateItem,
      removeItem,
      clearCart,
      applyCoupon,
      removeCoupon,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
