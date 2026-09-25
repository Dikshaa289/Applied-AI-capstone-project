import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, BookOpen } from "lucide-react";
import { CartItem } from "../types";
import { BookCover } from "../components/BookCard";

interface PaymentSuccessPageProps {
  purchasedItems: CartItem[];
}

const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({ purchasedItems }) => {
  const navigate = useNavigate();

  return (
    /* Full-screen illustrated background — same as PaymentPage */
    <div
      className="flex-1 flex flex-col overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, #1b3a5c 0%, #0d2137 60%, #14213d 100%)",
      }}
    >
      {/* Decorative floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-10 left-16 w-32 h-40 rounded rotate-[-15deg] opacity-70" style={{ background: "linear-gradient(135deg,#c87941,#9a5a25)" }} />
        <div className="absolute top-8 right-10 w-12 h-36 rounded rotate-[8deg] opacity-60" style={{ background: "linear-gradient(135deg,#2a7a8a,#1e5a6a)" }} />
        <div className="absolute bottom-20 left-10 w-36 h-28 rounded rotate-[5deg] opacity-60" style={{ background: "linear-gradient(135deg,#c87941,#7a4520)" }} />
        <div className="absolute bottom-10 left-1/3 w-48 h-28 rounded rotate-[-5deg] opacity-50" style={{ background: "linear-gradient(135deg,#d4a05a,#a07030)" }} />
        <div className="absolute bottom-6 right-16 w-40 h-32 rounded rotate-[3deg] opacity-50" style={{ background: "linear-gradient(135deg,#d4a05a,#b08040)" }} />
        <div className="absolute bottom-4 right-14 w-32 h-8 rounded" style={{ background: "#f0f0e0", opacity: 0.4 }} />
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-[#c8a040] rotate-45 opacity-70" />
        <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-[#2a7a8a] rotate-45 opacity-70" />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#c87941] rotate-45 opacity-60" />
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-[#e84c1e] rotate-45 opacity-60" />
      </div>

      {/* Success modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-[#1e2336] border border-[#2e3447] rounded-xl shadow-2xl w-full max-w-2xl px-8 py-8">
          {/* Check icon */}
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle size={28} className="text-white fill-green-500" />
            </div>
          </div>

          <p className="text-white text-center text-lg font-medium mb-6">
            Your purchase of the<br />following reads is successful
          </p>

          {/* Purchased book list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {purchasedItems.map(({ book }) => (
              <div key={book.id} className="flex gap-3">
                <BookCover book={book} size="md" />
                <div className="flex flex-col min-w-0">
                  <h3 className="text-white font-semibold text-sm">{book.title}</h3>
                  <p className="text-[#3b7ef8] text-xs">by {book.author}</p>
                  <p className="text-[#8892a4] text-xs mt-1 line-clamp-2">{book.description}</p>
                  <p className="text-[#8892a4] text-xs">{book.format}</p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {book.genres.map((g) => (
                      <span key={g} className="text-[#3b7ef8] text-xs">{g}</span>
                    ))}
                  </div>
                  <p className="text-white font-bold text-sm mt-1">₹{book.price}</p>
                  <p className="text-[#8892a4] text-xs">
                    Delivery by <span className="text-white font-medium">{book.delivery}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-8 py-2.5 bg-[#3b7ef8] text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
            >
              <BookOpen size={15} />
              Continue your Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
