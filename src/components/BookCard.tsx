import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Minus, Plus } from "lucide-react";
import { Book } from "../types";

interface BookCardProps {
  book: Book;
  /** Current quantity in cart (0 means not in cart) */
  cartQty?: number;
  onAddToCart?: (book: Book) => void;
  onUpdateQty?: (bookId: number, qty: number) => void;
  onRemove?: (bookId: number) => void;
  wishlisted?: boolean;
  onToggleWishlist?: (book: Book) => void;
  compact?: boolean;
}

/** Coloured rectangle book cover with centred title text */
const BookCover: React.FC<{ book: Book; size?: "sm" | "md" | "lg" }> = ({ book, size = "md" }) => {
  const dims = { sm: "w-16 h-24", md: "w-24 h-36", lg: "w-40 h-56" };
  return (
    <div
      className={`${dims[size]} rounded flex-shrink-0 flex items-center justify-center overflow-hidden`}
      style={{ backgroundColor: book.coverBg }}
    >
      <span
        className="text-center px-1 font-extrabold leading-tight uppercase"
        style={{
          color: book.coverColor,
          fontSize: size === "lg" ? "0.85rem" : size === "md" ? "0.6rem" : "0.5rem",
        }}
      >
        {book.coverText}
      </span>
    </div>
  );
};

const BookCard: React.FC<BookCardProps> = ({
  book,
  cartQty = 0,
  onAddToCart,
  onUpdateQty,
  onRemove,
  wishlisted = false,
  onToggleWishlist,
  compact = false,
}) => {
  const navigate = useNavigate();

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartQty === 1) {
      onRemove?.(book.id);
    } else {
      onUpdateQty?.(book.id, cartQty - 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateQty?.(book.id, cartQty + 1);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(book);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist?.(book);
  };

  return (
    <div
      className="flex gap-4 cursor-pointer group"
      onClick={() => navigate(`/book/${book.id}`)}
    >
      <BookCover book={book} size={compact ? "sm" : "md"} />

      <div className="flex flex-col justify-start min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-accent transition-colors line-clamp-2">
            {book.title}
          </h3>
          {/* Heart — only show when wishlist handler is provided */}
          {onToggleWishlist && (
            <button
              onClick={handleWishlist}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="flex-shrink-0 mt-0.5 transition-transform hover:scale-110"
            >
              <Heart
                size={16}
                className={`transition-colors ${
                  wishlisted
                    ? "text-white fill-white"
                    : "text-muted fill-transparent stroke-muted hover:stroke-white"
                }`}
              />
            </button>
          )}
        </div>

        <p className="text-accent text-xs mt-0.5 hover:underline cursor-pointer">{book.author}</p>
        <p className="text-muted text-xs mt-1 line-clamp-2 leading-relaxed">{book.description}</p>
        <p className="text-muted text-xs mt-1">{book.format}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {book.genres.map((g) => (
            <span key={g} className="text-accent text-xs hover:underline cursor-pointer">
              {g}
            </span>
          ))}
        </div>
        <p className="text-white font-bold text-base mt-1.5">₹{book.price}</p>
        <p className="text-muted text-xs">
          Delivery by <span className="text-white font-medium">{book.delivery}</span>
        </p>

        {/* Cart controls — shown only when onAddToCart or quantity controls are provided */}
        {onAddToCart && (
          <div className="mt-2" onClick={(e) => e.stopPropagation()}>
            {cartQty === 0 ? (
              /* "Add to Cart" button */
              <button
                onClick={handleAddToCart}
                className="px-3 py-1 bg-accent text-white text-xs rounded hover:bg-blue-600 transition-colors w-max"
              >
                Add to Cart
              </button>
            ) : (
              /* Inline stepper */
              <div className="flex items-center gap-0 w-max border border-border rounded overflow-hidden">
                <button
                  onClick={handleDecrement}
                  className="w-7 h-7 flex items-center justify-center text-white hover:bg-surface transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={12} />
                </button>
                <span className="w-7 h-7 flex items-center justify-center text-white text-xs font-medium border-x border-border select-none">
                  {cartQty}
                </span>
                <button
                  onClick={handleIncrement}
                  className="w-7 h-7 flex items-center justify-center text-white hover:bg-surface transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={12} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { BookCover };
export default BookCard;
