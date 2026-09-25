import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Book, CartItem } from "../types";
import BookCard from "../components/BookCard";

interface WishlistPageProps {
  wishlist: Book[];
  onToggleWishlist: (book: Book) => void;
  cartItems: CartItem[];
  onAddToCart: (book: Book) => void;
  onUpdateQty: (bookId: number, qty: number) => void;
  onRemove: (bookId: number) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({
  wishlist,
  onToggleWishlist,
  cartItems,
  onAddToCart,
  onUpdateQty,
  onRemove,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
      <div className="flex items-center gap-3 mb-6">
        <Heart size={20} className="text-white fill-white" />
        <h1 className="text-white text-xl font-bold">My Wishlist</h1>
        {wishlist.length > 0 && (
          <span className="text-muted text-sm">({wishlist.length} book{wishlist.length !== 1 ? "s" : ""})</span>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted">
          <Heart size={52} className="opacity-20" />
          <p className="text-base">Your wishlist is empty.</p>
          <p className="text-sm text-muted text-center max-w-xs">
            Click the heart icon on any book to save it here for later.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 px-5 py-2 bg-accent text-white text-sm rounded hover:bg-blue-600 transition-colors"
          >
            Browse Books
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {wishlist.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              cartQty={cartItems.find((i) => i.book.id === book.id)?.quantity ?? 0}
              onAddToCart={onAddToCart}
              onUpdateQty={onUpdateQty}
              onRemove={onRemove}
              wishlisted={true}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
