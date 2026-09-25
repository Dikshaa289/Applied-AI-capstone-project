import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { CartItem } from "../types";
import { BookCover } from "../components/BookCard";

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQty: (bookId: number, qty: number) => void;
  onRemove: (bookId: number) => void;
}

const inputCls =
  "w-full bg-surface border border-border text-white text-xs rounded px-3 py-2 placeholder-muted focus:outline-none focus:border-accent transition-colors";

const CartPage: React.FC<CartPageProps> = ({ cartItems, onUpdateQty, onRemove }) => {
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    addressLine: "",
    email: "",
    city: "",
    pin: "",
    phone: "",
    state: "",
    country: "India",
    useSaved: false,
  });

  const subtotal = cartItems.reduce((s, i) => s + i.book.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.12);
  const total = subtotal + tax - discount;

  const handleApplyCoupon = () => {
    if (coupon.toLowerCase() === "save100") setDiscount(100);
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted px-6">
        <p className="text-lg">Your cart is empty.</p>
        <button onClick={() => navigate("/")} className="px-4 py-2 bg-accent text-white text-sm rounded hover:bg-blue-600 transition-colors">
          Browse Books
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 md:px-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted mb-3 flex items-center gap-1 flex-wrap">
        <Link to="/" className="text-accent hover:underline">Home</Link>
        <span>/</span>
        <span className="text-muted">Non-Fiction</span>
        <span>/</span>
        <span className="text-muted">Self Help</span>
        <span>/</span>
        <span className="text-muted">{cartItems[0]?.book.title}</span>
        <span>/</span>
        <span className="text-white">Checkout</span>
        <span>/</span>
      </nav>

      <h1 className="text-white text-xl font-bold mb-4">Shopping Cart</h1>

      {/* Cart items */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cartItems.map(({ book, quantity }) => (
            <div key={book.id} className="flex gap-4">
              <BookCover book={book} size="md" />
              <div className="flex flex-col justify-between min-w-0 flex-1">
                <div>
                  <h3 className="text-white font-semibold text-sm">{book.title}</h3>
                  <p className="text-accent text-xs">by {book.author}</p>
                  <p className="text-muted text-xs mt-1 line-clamp-2">{book.description}</p>
                  <p className="text-muted text-xs">{book.format}</p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {book.genres.map((g) => (
                      <span key={g} className="text-accent text-xs">{g}</span>
                    ))}
                  </div>
                  <p className="text-white font-bold text-base mt-1">₹{book.price}</p>
                  <p className="text-muted text-xs">
                    Delivery by <span className="text-white font-medium">{book.delivery}</span>
                  </p>
                </div>
                {/* Quantity controls */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-white text-sm w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => quantity > 1 ? onUpdateQty(book.id, quantity - 1) : onRemove(book.id)}
                    className="w-6 h-6 flex items-center justify-center rounded border border-border text-white hover:bg-surface transition-colors text-base"
                  >
                    −
                  </button>
                  <button
                    onClick={() => onUpdateQty(book.id, quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center rounded border border-border text-white hover:bg-surface transition-colors text-base"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Address + Order Summary row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Address */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-white font-semibold text-base mb-4">Address</h2>
          <label className="flex items-center gap-2 text-muted text-xs mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={address.useSaved}
              onChange={(e) => setAddress((a) => ({ ...a, useSaved: e.target.checked }))}
              className="accent-accent"
            />
            Use Saved Address
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className={inputCls}
              placeholder="First Name"
              value={address.firstName}
              onChange={(e) => setAddress((a) => ({ ...a, firstName: e.target.value }))}
            />
            <input
              className={inputCls}
              placeholder="Last Name"
              value={address.lastName}
              onChange={(e) => setAddress((a) => ({ ...a, lastName: e.target.value }))}
            />
            <input
              className={`${inputCls} sm:col-span-2`}
              placeholder="Address Line 2"
              value={address.addressLine}
              onChange={(e) => setAddress((a) => ({ ...a, addressLine: e.target.value }))}
            />
            <input
              className={`${inputCls} sm:col-span-2`}
              placeholder="e-mail"
              type="email"
              value={address.email}
              onChange={(e) => setAddress((a) => ({ ...a, email: e.target.value }))}
            />
            <input
              className={inputCls}
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
            />
            <input
              className={inputCls}
              placeholder="000000"
              value={address.pin}
              onChange={(e) => setAddress((a) => ({ ...a, pin: e.target.value }))}
            />
            {/* Phone with country code */}
            <div className="flex gap-2">
              <select className="bg-surface border border-border text-muted text-xs rounded px-2 py-2 focus:outline-none focus:border-accent w-16 flex-shrink-0">
                <option>+91</option>
                <option>+1</option>
                <option>+44</option>
              </select>
              <input
                className={inputCls}
                placeholder="12345567890"
                value={address.phone}
                onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))}
              />
            </div>
            <input
              className={inputCls}
              placeholder="State"
              value={address.state}
              onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
            />
            <select
              className={`${inputCls} sm:col-span-2`}
              value={address.country}
              onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))}
            >
              <option>India</option>
              <option>United States</option>
              <option>United Kingdom</option>
            </select>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-4">
          {/* Decorative image */}
          <div className="h-44 rounded bg-[#1a3060] flex items-center justify-center overflow-hidden">
            <div className="flex gap-4 opacity-80">
              <div className="w-16 h-24 rounded" style={{ background: "linear-gradient(135deg,#e07b39,#c0522a)" }} />
              <div className="w-10 h-28 rounded self-end" style={{ background: "linear-gradient(135deg,#2a7a8a,#1e5a6a)" }} />
            </div>
          </div>

          <div>
            <h2 className="text-white font-semibold text-base mb-3">Grand Total</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Price ({cartItems.length} items)</span>
                <span className="text-white">₹{subtotal}.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Tax</span>
                <span className="text-white">₹{tax}.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Delivery Charges</span>
                <span className="text-accent font-medium">Free</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="flex gap-2 mt-3">
              <input
                className="flex-1 bg-surface border border-border text-white text-xs rounded px-3 py-2 placeholder-muted focus:outline-none focus:border-accent transition-colors"
                placeholder="Apply Coupon"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-accent text-white text-xs font-medium rounded hover:bg-blue-600 transition-colors"
              >
                Apply
              </button>
            </div>

            {discount > 0 && (
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-muted">Discount</span>
                <span className="text-green-400">−₹{discount}</span>
              </div>
            )}

            <div className="flex justify-between mt-3 border-t border-border pt-3">
              <span className="text-white font-semibold">Total Amount</span>
              <span className="text-white font-bold text-base">₹{total}</span>
            </div>

            <button
              onClick={() => navigate("/payment")}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-accent text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
            >
              <CreditCard size={15} />
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
