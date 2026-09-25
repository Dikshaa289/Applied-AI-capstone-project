import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { CartItem } from "../types";

interface PaymentPageProps {
  cartItems: CartItem[];
  onPaymentSuccess: () => void;
}

type PaymentMethod = "Credit Card" | "Debit card" | "UPI" | "Wallet";

const METHODS: PaymentMethod[] = ["Credit Card", "Debit card", "UPI", "Wallet"];

const inputCls =
  "w-full bg-[#1e2336] border border-[#2e3447] text-white text-sm rounded px-3 py-2 placeholder-[#4a5568] focus:outline-none focus:border-[#3b7ef8] transition-colors";

const PaymentPage: React.FC<PaymentPageProps> = ({ cartItems, onPaymentSuccess }) => {
  const navigate = useNavigate();
  const [method, setMethod] = useState<PaymentMethod>("Credit Card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [upiId, setUpiId] = useState("");

  const total = cartItems.reduce((s, i) => s + i.book.price * i.quantity, 0);
  const payable = Math.round(total * 1.12);

  const handlePay = () => {
    onPaymentSuccess();
    navigate("/payment-success");
  };

  return (
    /* Full-screen illustrated background */
    <div
      className="flex-1 flex flex-col overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, #1b3a5c 0%, #0d2137 60%, #14213d 100%)",
      }}
    >
      {/* Decorative floating book shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-10 left-16 w-32 h-40 rounded rotate-[-15deg] opacity-70" style={{ background: "linear-gradient(135deg,#c87941,#9a5a25)" }} />
        <div className="absolute top-8 right-10 w-12 h-36 rounded rotate-[8deg] opacity-60" style={{ background: "linear-gradient(135deg,#2a7a8a,#1e5a6a)" }} />
        <div className="absolute bottom-20 left-10 w-36 h-28 rounded rotate-[5deg] opacity-60" style={{ background: "linear-gradient(135deg,#c87941,#7a4520)" }} />
        <div className="absolute bottom-10 left-1/3 w-48 h-28 rounded rotate-[-5deg] opacity-50" style={{ background: "linear-gradient(135deg,#d4a05a,#a07030)" }} />
        <div className="absolute bottom-6 right-16 w-40 h-32 rounded rotate-[3deg] opacity-50" style={{ background: "linear-gradient(135deg,#d4a05a,#b08040)" }} />
        <div className="absolute bottom-4 right-14 w-32 h-8 rounded" style={{ background: "#f0f0e0", opacity: 0.4 }} />
        {/* Squiggles and diamonds */}
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-[#c8a040] rotate-45 opacity-70" />
        <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-[#2a7a8a] rotate-45 opacity-70" />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#c87941] rotate-45 opacity-60" />
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-[#e84c1e] rotate-45 opacity-60" />
      </div>

      {/* Payment modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-[#1e2336] border border-[#2e3447] rounded-xl shadow-2xl w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2e3447]">
            <h2 className="text-white font-semibold text-base">Complete Payment</h2>
            <span className="text-white font-bold text-sm">Payable Amount: ₹{payable}</span>
          </div>

          <div className="flex">
            {/* Method tabs */}
            <div className="flex flex-col border-r border-[#2e3447] py-4 min-w-[110px]">
              {METHODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`text-left px-4 py-3 text-sm transition-colors ${
                    method === m
                      ? "text-white bg-[#252b40] border-l-2 border-[#3b7ef8]"
                      : "text-[#8892a4] hover:text-white hover:bg-[#252b40]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Form */}
            <div className="flex-1 p-6 space-y-4">
              {(method === "Credit Card" || method === "Debit card") && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[#8892a4] text-xs mb-1 block">Card Number</label>
                      <input
                        className={inputCls}
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={19}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[#8892a4] text-xs mb-1 block">Name on Card</label>
                      <input
                        className={inputCls}
                        placeholder="Name"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[#8892a4] text-xs mb-1 block">CVV</label>
                      <input
                        className={inputCls}
                        placeholder="XXX"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        maxLength={4}
                        type="password"
                      />
                    </div>
                    <div>
                      <label className="text-[#8892a4] text-xs mb-1 block">Date of Expiry</label>
                      <input
                        className={inputCls}
                        placeholder="MM/YYYY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        maxLength={7}
                      />
                    </div>
                  </div>
                </>
              )}

              {method === "UPI" && (
                <div>
                  <label className="text-[#8892a4] text-xs mb-1 block">UPI ID</label>
                  <input
                    className={inputCls}
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
              )}

              {method === "Wallet" && (
                <div className="space-y-3">
                  {["Paytm", "PhonePe", "Amazon Pay", "Mobikwik"].map((w) => (
                    <label key={w} className="flex items-center gap-2 cursor-pointer text-[#8892a4] text-sm hover:text-white transition-colors">
                      <input type="radio" name="wallet" value={w} className="accent-[#3b7ef8]" />
                      {w}
                    </label>
                  ))}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={handlePay}
                  className="flex items-center gap-2 px-6 py-2 bg-[#3b7ef8] text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
                >
                  <CreditCard size={14} />
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
