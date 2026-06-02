'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiHeart, FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { wishlistAPI } from '../../lib/api';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const [inWishlist, setInWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  const discount = product.offerPrice && product.price > product.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  const effectivePrice = product.offerPrice || product.price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setAddingToCart(true);
    await addToCart(product._id, 1);
    setAddingToCart(false);
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) { toast.error('Please login first'); return; }
    try {
      const { data } = await wishlistAPI.toggle(product._id);
      setInWishlist(data.inWishlist);
      toast.success(data.action === 'added' ? 'Added to wishlist ❤️' : 'Removed from wishlist');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <Link href={`/products/${product.slug}`} className="group card overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={product.images?.[0] || 'https://via.placeholder.com/400x400?text=Namkeen'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="badge bg-red-500 text-white text-[10px]">{discount}% OFF</span>
          )}
          {product.isBestSeller && (
            <span className="badge bg-amber-400 text-amber-900 text-[10px]">⭐ Best Seller</span>
          )}
          {product.isNew && (
            <span className="badge bg-green-500 text-white text-[10px]">NEW</span>
          )}
        </div>

        {/* Out of stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-bold text-sm px-4 py-1.5 rounded-full">Out of Stock</span>
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-4 group-hover:translate-x-0">
          <button
            onClick={handleToggleWishlist}
            className={`w-9 h-9 rounded-xl shadow-md flex items-center justify-center transition-colors ${inWishlist ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'}`}
            title="Add to wishlist"
          >
            <FiHeart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
          <Link href={`/products/${product.slug}`}
            className="w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-600 hover:bg-primary-50 hover:text-primary-500 transition-colors"
            onClick={(e) => e.stopPropagation()}
            title="Quick view"
          >
            <FiEye size={16} />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {product.category && (
          <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider">
            {product.category.icon} {product.category.name}
          </span>
        )}
        <h3 className="font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors text-sm md:text-base">
          {product.name}
        </h3>
        {product.weight && (
          <span className="text-xs text-gray-400 font-medium">{product.weight}</span>
        )}

        {/* Rating */}
        {product.numReviews > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map((star) => (
                <FiStar key={star} size={12}
                  className={star <= Math.round(product.ratings) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.numReviews})</span>
          </div>
        )}

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-gray-900">₹{effectivePrice}</span>
            {discount > 0 && (
              <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addingToCart}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600 text-white shadow-orange hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            {addingToCart ? (
              <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
            ) : (
              <FiShoppingCart size={14} />
            )}
            Add
          </button>
        </div>
      </div>
    </Link>
  );
}
