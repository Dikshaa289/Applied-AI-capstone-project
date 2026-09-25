import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, ShoppingCart, User, Menu, X } from "lucide-react";
import { CartItem } from "../types";

interface NavbarProps {
  cartItems: CartItem[];
}

const Navbar: React.FC<NavbarProps> = ({ cartItems }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-dark border-b border-border sticky top-0 z-50">
      <div className="flex items-center h-12 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-base mr-6 min-w-max">
          <BookOpen size={18} className="text-accent" />
          <span>Book Worm</span>
        </Link>

        {/* Divider */}
        <div className="hidden md:block h-6 w-px bg-border mr-6" />

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-muted">
          <Link to="/orders" className="hover:text-white transition-colors">My Orders</Link>
          <Link to="/wishlist" className="hover:text-white transition-colors">My Wishlist</Link>
          <Link to="/writers" className="hover:text-white transition-colors">My Writers</Link>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Cart + User icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/cart")}
            className="relative text-muted hover:text-white transition-colors"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button className="text-muted hover:text-white transition-colors" aria-label="User account">
            <User size={20} />
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-muted hover:text-white transition-colors ml-1"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-dark border-t border-border px-4 pb-4 pt-2 flex flex-col gap-3 text-sm text-muted">
          <Link to="/orders" className="hover:text-white" onClick={() => setMenuOpen(false)}>My Orders</Link>
          <Link to="/wishlist" className="hover:text-white" onClick={() => setMenuOpen(false)}>My Wishlist</Link>
          <Link to="/writers" className="hover:text-white" onClick={() => setMenuOpen(false)}>My Writers</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
