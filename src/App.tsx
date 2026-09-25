import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import BookDetailPage from "./pages/BookDetailPage";
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import OrdersPage from "./pages/OrdersPage";
import WishlistPage from "./pages/WishlistPage";
import { CartItem, Book, Order } from "./types";

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<Book[]>([]);

  const handleAddToCart = (book: Book) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.book.id === book.id);
      if (existing) {
        return prev.map((i) => i.book.id === book.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { book, quantity: 1 }];
    });
  };

  const handleUpdateQty = (bookId: number, qty: number) => {
    setCartItems((prev) => prev.map((i) => i.book.id === bookId ? { ...i, quantity: qty } : i));
  };

  const handleRemove = (bookId: number) => {
    setCartItems((prev) => prev.filter((i) => i.book.id !== bookId));
  };

  const handleToggleWishlist = (book: Book) => {
    setWishlist((prev) =>
      prev.some((w) => w.id === book.id)
        ? prev.filter((w) => w.id !== book.id)
        : [...prev, book]
    );
  };

  const handlePaymentSuccess = () => {
    setPurchasedItems(cartItems);
    const subtotal = cartItems.reduce((s, i) => s + i.book.price * i.quantity, 0);
    const tax = Math.round(subtotal * 0.12);
    const newOrder: Order = {
      id: `BW${Date.now().toString().slice(-8)}`,
      placedAt: new Date().toISOString(),
      items: cartItems.map((i) => ({ book: i.book, quantity: i.quantity })),
      subtotal,
      tax,
      discount: 0,
      total: subtotal + tax,
      status: "Processing",
      address: "Address on file",
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen bg-dark text-white overflow-hidden">
        <Navbar cartItems={cartItems} />
        <div className="flex flex-1 overflow-hidden">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  onAddToCart={handleAddToCart}
                  onUpdateQty={handleUpdateQty}
                  onRemove={handleRemove}
                  cartItems={cartItems}
                  wishlist={wishlist}
                  onToggleWishlist={handleToggleWishlist}
                />
              }
            />
            <Route
              path="/book/:id"
              element={
                <BookDetailPage
                  onAddToCart={handleAddToCart}
                  onUpdateQty={handleUpdateQty}
                  onRemove={handleRemove}
                  cartItems={cartItems}
                  wishlist={wishlist}
                  onToggleWishlist={handleToggleWishlist}
                />
              }
            />
            <Route
              path="/cart"
              element={
                <CartPage
                  cartItems={cartItems}
                  onUpdateQty={handleUpdateQty}
                  onRemove={handleRemove}
                />
              }
            />
            <Route path="/payment" element={<PaymentPage cartItems={cartItems} onPaymentSuccess={handlePaymentSuccess} />} />
            <Route path="/payment-success" element={<PaymentSuccessPage purchasedItems={purchasedItems} />} />
            <Route
              path="/orders"
              element={
                <OrdersPage
                  orders={orders}
                  cartItems={cartItems}
                  wishlist={wishlist}
                  onAddToCart={handleAddToCart}
                  onUpdateQty={handleUpdateQty}
                  onRemove={handleRemove}
                  onToggleWishlist={handleToggleWishlist}
                />
              }
            />
            <Route
              path="/wishlist"
              element={
                <WishlistPage
                  wishlist={wishlist}
                  onToggleWishlist={handleToggleWishlist}
                  cartItems={cartItems}
                  onAddToCart={handleAddToCart}
                  onUpdateQty={handleUpdateQty}
                  onRemove={handleRemove}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
