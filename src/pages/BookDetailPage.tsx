import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Star, Heart, Minus, Plus } from "lucide-react";
import { BOOKS } from "../data/books";
import { BookCover } from "../components/BookCard";
import BookCard from "../components/BookCard";
import { Book, CartItem } from "../types";

interface BookDetailPageProps {
  onAddToCart: (book: Book) => void;
  onUpdateQty: (bookId: number, qty: number) => void;
  onRemove: (bookId: number) => void;
  cartItems: CartItem[];
  wishlist: Book[];
  onToggleWishlist: (book: Book) => void;
}

const REVIEWS = [
  {
    id: 1,
    author: "John Smith",
    text: "The accordion component delivers large amounts of content in a small space through progressive disclosure. The user gets key details about the underlying content and can choose to expand that content within the constraints of the accordion.",
    rating: 4,
  },
];

const BookDetailPage: React.FC<BookDetailPageProps> = ({
  onAddToCart,
  onUpdateQty,
  onRemove,
  cartItems,
  wishlist,
  onToggleWishlist,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const book = BOOKS.find((b) => b.id === Number(id));
  const [reviewText, setReviewText] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  if (!book) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted">
        <p>Book not found.</p>
      </div>
    );
  }

  const relatedBooks = BOOKS.filter((b) => b.id !== book.id && b.genres.some((g) => book.genres.includes(g))).slice(0, 3);
  const cartQty = cartItems.find((i) => i.book.id === book.id)?.quantity ?? 0;
  const wishlisted = wishlist.some((w) => w.id === book.id);

  return (
    <div className="flex flex-1 overflow-hidden min-h-0">
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-4 flex items-center gap-1 flex-wrap">
          <Link to="/" className="text-accent hover:underline">Home</Link>
          <span>/</span>
          <span className="text-accent hover:underline cursor-pointer">{book.genres[0]}</span>
          <span>/</span>
          <span className="text-white">{book.genres[1] || book.genres[0]}</span>
        </nav>

        {/* Book covers + info */}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex gap-3 flex-shrink-0">
            <BookCover book={book} size="lg" />
            {/* Back cover placeholder */}
            <div className="w-36 h-56 rounded bg-surface border border-border flex items-center justify-center">
              <p className="text-muted text-xs text-center px-2 italic leading-relaxed">
                "A refreshing path to clarity in a cluttered world."
              </p>
            </div>
          </div>

          <div className="flex flex-col min-w-0">
            <h1 className="text-white text-2xl font-bold leading-tight">{book.title}</h1>
            <p className="text-muted text-sm mt-0.5">
              by{" "}
              <span className="text-accent hover:underline cursor-pointer">{book.author}</span>
            </p>
            <p className="text-muted text-sm mt-2">{book.description}</p>
            <p className="text-muted text-sm mt-1">
              Published by: <span className="text-accent hover:underline cursor-pointer">ABC Publishers</span>
            </p>
            <p className="text-muted text-sm mt-1">{book.format}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {book.genres.map((g) => (
                <span key={g} className="text-accent text-xs hover:underline cursor-pointer">{g}</span>
              ))}
            </div>
            <p className="text-white text-3xl font-bold mt-3">₹{book.price}</p>
            <p className="text-muted text-xs">
              Delivery by <span className="text-white font-medium">{book.delivery}</span>
            </p>

            {/* CTA buttons */}
            <div className="flex gap-3 mt-4 flex-wrap items-center">
              {cartQty === 0 ? (
                <button
                  onClick={() => { onAddToCart(book); navigate("/cart"); }}
                  className="flex items-center gap-2 px-5 py-2 bg-accent text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
                >
                  <ShoppingCart size={15} />
                  Add to Cart
                </button>
              ) : (
                <div className="flex items-center gap-0 border border-border rounded overflow-hidden">
                  <button
                    onClick={() => cartQty === 1 ? onRemove(book.id) : onUpdateQty(book.id, cartQty - 1)}
                    className="w-9 h-9 flex items-center justify-center text-white hover:bg-surface transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-9 h-9 flex items-center justify-center text-white text-sm font-medium border-x border-border select-none">
                    {cartQty}
                  </span>
                  <button
                    onClick={() => onUpdateQty(book.id, cartQty + 1)}
                    className="w-9 h-9 flex items-center justify-center text-white hover:bg-surface transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}
              <button
                onClick={() => onToggleWishlist(book)}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className={`flex items-center gap-2 px-5 py-2 border text-sm font-medium rounded transition-colors ${
                  wishlisted
                    ? "bg-surface border-white text-white"
                    : "bg-surface border-border text-white hover:border-muted"
                }`}
              >
                <Heart
                  size={15}
                  className={wishlisted ? "fill-white text-white" : "fill-transparent text-white"}
                />
                {wishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>
            </div>

            {/* Meta */}
            <div className="flex gap-6 mt-4 flex-wrap">
              <div className="flex flex-col">
                <span className="text-muted text-xs">Language</span>
                <span className="text-accent text-xs hover:underline cursor-pointer">English</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted text-xs">Rating</span>
                <div className="flex gap-0.5 mt-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={13} className={s <= 4 ? "text-yellow-400 fill-yellow-400" : "text-muted"} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-muted text-xs">Sells</span>
                <span className="text-white text-xs">145 copies sold</span>
              </div>
            </div>
          </div>
        </div>

        {/* About the writer */}
        <div className="mt-8">
          <h2 className="text-white font-semibold text-base mb-3">About the writer</h2>
          <div className="flex gap-4">
            <div className="w-14 h-14 rounded-full bg-surface border border-border flex-shrink-0 flex items-center justify-center text-muted text-2xl font-bold">
              {book.author.charAt(0)}
            </div>
            <div>
              <p className="text-white font-medium text-sm">{book.author}</p>
              <p className="text-muted text-xs mt-1 leading-relaxed">
                {book.author} is a writer, minimalist, and productivity coach. With a passion for intentional living, he has dedicated his career to helping individuals simplify their lives — one habit, one space, and one thought at a time. He is the author of {book.title}, an acclaimed guide to decluttering both physically and mentally.
              </p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-8">
          <h2 className="text-white font-semibold text-base mb-3">Reviews</h2>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Leave review */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <label className="text-muted text-xs">Leave Your Review</label>
                <span className="text-muted text-xs">{reviewText.length}/100</span>
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value.slice(0, 100))}
                placeholder="Placeholder text"
                rows={5}
                className="w-full bg-surface border border-border text-white text-xs rounded px-3 py-2 placeholder-muted focus:outline-none focus:border-accent resize-none transition-colors"
              />
              {/* Star rating */}
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    className={`cursor-pointer transition-colors ${
                      s <= (hoverRating || userRating) ? "text-yellow-400 fill-yellow-400" : "text-muted"
                    }`}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setUserRating(s)}
                  />
                ))}
              </div>
              <button className="mt-3 flex items-center gap-2 px-5 py-2 bg-accent text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors">
                Submit →
              </button>
            </div>

            {/* Existing review */}
            {REVIEWS.map((rev) => (
              <div key={rev.id} className="flex-1 bg-surface border border-border rounded p-4">
                <p className="text-white font-medium text-sm">{rev.author}</p>
                <p className="text-muted text-xs mt-1 leading-relaxed">{rev.text}</p>
                <div className="flex gap-0.5 mt-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={13} className={s <= rev.rating ? "text-yellow-400 fill-yellow-400" : "text-muted"} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Reads sidebar */}
      <aside className="hidden xl:flex flex-col flex-shrink-0 border-l border-border overflow-y-auto self-stretch">
        <div className="px-5 py-6 flex flex-col gap-5">
        <h2 className="text-white font-semibold text-base mb-4">Related Reads</h2>
        <div className="flex flex-col gap-5">
          {relatedBooks.map((rb) => (
            <BookCard
              key={rb.id}
              book={rb}
              compact
              cartQty={cartItems.find((i) => i.book.id === rb.id)?.quantity ?? 0}
              onAddToCart={onAddToCart}
              onUpdateQty={onUpdateQty}
              onRemove={onRemove}
              wishlisted={wishlist.some((w) => w.id === rb.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
        </div>
      </aside>
    </div>
  );
};

export default BookDetailPage;
