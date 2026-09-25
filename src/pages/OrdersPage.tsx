import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Package,
  Truck,
  MapPin,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Order, OrderStatus, Book, CartItem } from "../types";
import { BookCover } from "../components/BookCard";
import { BOOKS } from "../data/books";
import { getOrderRecommendations } from "../utils/recommendations";

interface OrdersPageProps {
  orders: Order[];
  cartItems: CartItem[];
  wishlist: Book[];
  onAddToCart: (book: Book) => void;
  onUpdateQty: (bookId: number, qty: number) => void;
  onRemove: (bookId: number) => void;
  onToggleWishlist: (book: Book) => void;
}

/* ─── Status helpers ─────────────────────────────────────────────────────── */

const STATUS_STEPS: OrderStatus[] = [
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const statusIcon = (status: OrderStatus) => {
  switch (status) {
    case "Processing":       return <Package   size={14} className="text-yellow-400" />;
    case "Shipped":          return <Truck     size={14} className="text-blue-400" />;
    case "Out for Delivery": return <MapPin    size={14} className="text-accent" />;
    case "Delivered":        return <CheckCircle size={14} className="text-green-400" />;
    case "Cancelled":        return <XCircle   size={14} className="text-red-400" />;
  }
};

const statusColor = (status: OrderStatus) => {
  switch (status) {
    case "Processing":       return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
    case "Shipped":          return "text-blue-400  bg-blue-400/10  border-blue-400/30";
    case "Out for Delivery": return "text-accent    bg-accent/10    border-accent/30";
    case "Delivered":        return "text-green-400 bg-green-400/10 border-green-400/30";
    case "Cancelled":        return "text-red-400   bg-red-400/10   border-red-400/30";
  }
};

/* ─── Status stepper ─────────────────────────────────────────────────────── */

const StatusStepper: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-0 mt-3">
      {STATUS_STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const isLast = idx === STATUS_STEPS.length - 1;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1 min-w-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-colors ${
                  done ? "bg-accent border-accent" : "bg-surface border-border"
                }`}
              >
                {done && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span
                className={`text-[10px] text-center leading-tight max-w-[56px] ${
                  done ? "text-white" : "text-muted"
                }`}
              >
                {step}
              </span>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mb-4 mx-1 transition-colors ${
                  idx < currentIdx ? "bg-accent" : "bg-border"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ─── Single order card ──────────────────────────────────────────────────── */

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const cancelled = order.status === "Cancelled";

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header row */}
      <button
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-surface/40 transition-colors text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">
            Order #{order.id}
          </p>
          <p className="text-muted text-xs mt-0.5">
            Placed on{" "}
            {new Date(order.placedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Thumbnails */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          {order.items.slice(0, 3).map(({ book }) => (
            <BookCover key={book.id} book={book} size="sm" />
          ))}
          {order.items.length > 3 && (
            <span className="text-muted text-xs">+{order.items.length - 3}</span>
          )}
        </div>

        {/* Total */}
        <div className="text-right flex-shrink-0 hidden sm:block">
          <p className="text-white font-bold text-sm">₹{order.total}</p>
          <p className="text-muted text-xs">
            {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
          </p>
        </div>

        {/* Status badge */}
        <span
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium flex-shrink-0 ${statusColor(order.status)}`}
        >
          {statusIcon(order.status)}
          {order.status}
        </span>

        <span className="text-muted flex-shrink-0">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-border px-5 py-5 space-y-5">
          {!cancelled && <StatusStepper status={order.status} />}
          {cancelled && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <XCircle size={16} />
              <span>This order was cancelled.</span>
            </div>
          )}

          {/* Items */}
          <div>
            <p className="text-muted text-xs uppercase tracking-wide mb-3">Items</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {order.items.map(({ book, quantity }) => (
                <div key={book.id} className="flex gap-3">
                  <BookCover book={book} size="sm" />
                  <div className="flex flex-col min-w-0">
                    <p className="text-white font-medium text-sm leading-snug line-clamp-2">
                      {book.title}
                    </p>
                    <p className="text-accent text-xs">{book.author}</p>
                    <p className="text-muted text-xs mt-0.5">{book.format}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-white text-sm font-bold">₹{book.price}</span>
                      <span className="text-muted text-xs">× {quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown + address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-surface rounded-lg p-4 space-y-2">
              <p className="text-muted text-xs uppercase tracking-wide mb-2">Price Breakdown</p>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="text-white">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Tax (12%)</span>
                <span className="text-white">₹{order.tax}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Delivery</span>
                <span className="text-accent font-medium">Free</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Discount</span>
                  <span className="text-green-400">−₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm border-t border-border pt-2 mt-1">
                <span className="text-white font-semibold">Total</span>
                <span className="text-white font-bold">₹{order.total}</span>
              </div>
            </div>

            <div className="bg-surface rounded-lg p-4">
              <p className="text-muted text-xs uppercase tracking-wide mb-2">Delivery Address</p>
              <p className="text-white text-sm leading-relaxed">{order.address}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Recommendation card (matches Books_details "Related Reads" style) ──── */

const RecommendationCard: React.FC<{
  book: Book;
  cartQty: number;
  wishlisted: boolean;
  onAddToCart: (b: Book) => void;
  onUpdateQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  onToggleWishlist: (b: Book) => void;
}> = ({ book, cartQty, wishlisted, onAddToCart, onUpdateQty, onRemove, onToggleWishlist }) => {
  return (
    <div className="flex gap-3 py-4 border-b border-border last:border-b-0">
      {/* Cover — large, matching the screenshot */}
      <Link to={`/book/${book.id}`} className="flex-shrink-0">
        <BookCover book={book} size="md" />
      </Link>

      <div className="flex flex-col min-w-0 flex-1">
        <Link
          to={`/book/${book.id}`}
          className="text-white font-semibold text-sm leading-snug hover:text-accent transition-colors line-clamp-2"
        >
          {book.title}
        </Link>
        <p className="text-accent text-xs mt-0.5 hover:underline cursor-pointer">
          by {book.author}
        </p>
        <p className="text-muted text-xs mt-1 line-clamp-2 leading-relaxed">
          {book.description}
        </p>
        <p className="text-muted text-xs mt-1">{book.format}</p>
        <div className="flex flex-wrap gap-1 mt-0.5">
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

        {/* Cart controls */}
        <div className="flex items-center gap-2 mt-2">
          {cartQty === 0 ? (
            <button
              onClick={() => onAddToCart(book)}
              className="px-3 py-1 bg-accent text-white text-xs rounded hover:bg-blue-600 transition-colors"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center gap-0 border border-border rounded overflow-hidden">
              <button
                onClick={() => cartQty === 1 ? onRemove(book.id) : onUpdateQty(book.id, cartQty - 1)}
                className="w-7 h-7 flex items-center justify-center text-white hover:bg-surface transition-colors text-sm"
              >
                −
              </button>
              <span className="w-7 h-7 flex items-center justify-center text-white text-xs font-medium border-x border-border select-none">
                {cartQty}
              </span>
              <button
                onClick={() => onUpdateQty(book.id, cartQty + 1)}
                className="w-7 h-7 flex items-center justify-center text-white hover:bg-surface transition-colors text-sm"
              >
                +
              </button>
            </div>
          )}

          {/* Heart */}
          <button
            onClick={() => onToggleWishlist(book)}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="ml-1 transition-transform hover:scale-110"
          >
            <svg
              width="16" height="16" viewBox="0 0 24 24"
              className="transition-colors"
              fill={wishlisted ? "white" : "none"}
              stroke={wishlisted ? "white" : "#8892a4"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Filter tabs ─────────────────────────────────────────────────────────── */

const FILTER_TABS: Array<"All" | OrderStatus> = [
  "All",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

/* ─── Page ────────────────────────────────────────────────────────────────── */

const OrdersPage: React.FC<OrdersPageProps> = ({
  orders,
  cartItems,
  wishlist,
  onAddToCart,
  onUpdateQty,
  onRemove,
  onToggleWishlist,
}) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<"All" | OrderStatus>("All");
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) => {
    if (activeFilter !== "All" && o.status !== activeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !o.id.toLowerCase().includes(q) &&
        !o.items.some((i) => i.book.title.toLowerCase().includes(q))
      )
        return false;
    }
    return true;
  });

  const recommendations = getOrderRecommendations(BOOKS, orders, 5);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* ── Main content ── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 min-w-0">
        <h1 className="text-white text-xl font-bold mb-5">My Orders</h1>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            type="text"
            placeholder="Search by order ID or book title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-surface border border-border text-white text-sm rounded px-3 py-2 placeholder-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                activeFilter === tab
                  ? "bg-accent text-white border-accent"
                  : "text-muted border-border hover:text-white hover:border-muted"
              }`}
            >
              {tab}
              <span className="ml-1.5 opacity-60">
                ({tab === "All" ? orders.length : orders.filter((o) => o.status === tab).length})
              </span>
            </button>
          ))}
        </div>

        {/* Order list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted">
            <ShoppingBag size={48} className="opacity-30" />
            {orders.length === 0 ? (
              <>
                <p className="text-base">You haven't placed any orders yet.</p>
                <button
                  onClick={() => navigate("/")}
                  className="px-5 py-2 bg-accent text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  Start Shopping
                </button>
              </>
            ) : (
              <p className="text-base">No orders match your filter.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>

      {/* ── Recommendations sidebar ── */}
      {recommendations.length > 0 && (
        <aside className="hidden xl:flex flex-col flex-shrink-0 border-l border-border overflow-y-auto self-stretch">
          <div className="sticky top-0 bg-dark border-b border-border px-5 py-4 z-10">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-accent" />
              <h2 className="text-white font-semibold text-base">Recommended for You</h2>
            </div>
            <p className="text-muted text-xs mt-0.5">Based on your order history</p>
          </div>
          <div className="px-5">
            {recommendations.map((book) => (
              <RecommendationCard
                key={book.id}
                book={book}
                cartQty={cartItems.find((i) => i.book.id === book.id)?.quantity ?? 0}
                wishlisted={wishlist.some((w) => w.id === book.id)}
                onAddToCart={onAddToCart}
                onUpdateQty={onUpdateQty}
                onRemove={onRemove}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </aside>
      )}
    </div>
  );
};

export default OrdersPage;
