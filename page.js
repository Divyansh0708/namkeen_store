'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { wishlistAPI } from '../../lib/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    wishlistAPI.get().then(({ data }) => setProducts(data.wishlist?.products || [])).finally(() => setLoading(false));
  }, [isLoggedIn]);

  const handleRemove = async (productId) => {
    try {
      await wishlistAPI.toggle(productId);
      setProducts(prev => prev.filter(p => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch { toast.error('Failed'); }
  };

  if (!isLoggedIn) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">❤️</div>
        <h2 className="font-display text-2xl font-bold mb-4">Your Wishlist Awaits</h2>
        <Link href="/auth/login?redirect=/wishlist" className="btn-primary">Login to View Wishlist</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="font-display text-3xl font-bold text-dark mb-8 flex items-center gap-3">
          <FiHeart className="text-red-500" /> My Wishlist
          {products.length > 0 && <span className="text-primary-500 text-2xl">({products.length} items)</span>}
        </h1>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(8).fill(null).map((_, i) => <div key={i} className="h-64 skeleton rounded-2xl" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="font-bold text-xl text-gray-700 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Save products you love for later!</p>
            <Link href="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => {
              const effectivePrice = product.offerPrice || product.price;
              const discount = product.offerPrice ? Math.round(((product.price - product.offerPrice) / product.price) * 100) : 0;
              return (
                <div key={product._id} className="card overflow-hidden group">
                  <div className="relative aspect-square bg-gray-50">
                    <Link href={`/products/${product.slug}`}>
                      <Image src={product.images?.[0] || 'https://via.placeholder.com/300'} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </Link>
                    {discount > 0 && <span className="absolute top-2 left-2 badge bg-red-500 text-white text-xs">{discount}% OFF</span>}
                    <button onClick={() => handleRemove(product._id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                  <div className="p-3">
                    <Link href={`/products/${product.slug}`} className="font-bold text-sm text-gray-800 hover:text-primary-600 line-clamp-2 leading-snug">{product.name}</Link>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="font-extrabold text-gray-900">₹{effectivePrice}</span>
                        {discount > 0 && <span className="text-xs text-gray-400 line-through ml-1.5">₹{product.price}</span>}
                      </div>
                      <button onClick={() => addToCart(product._id)}
                        disabled={product.stock === 0}
                        className="w-8 h-8 bg-primary-500 hover:bg-primary-600 text-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-orange">
                        <FiShoppingCart size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
