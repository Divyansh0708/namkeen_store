import { FiStar } from 'react-icons/fi';

export default function StarRating({ rating = 0, size = 16, showValue = false }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={size}
          className={
            star <= Math.floor(rating)
              ? 'text-amber-400 fill-amber-400'
              : star - 0.5 <= rating
              ? 'text-amber-400 fill-amber-200'
              : 'text-gray-200 fill-gray-200'
          }
        />
      ))}
      {showValue && <span className="text-sm font-semibold text-gray-600 ml-1">{rating.toFixed(1)}</span>}
    </div>
  );
}
