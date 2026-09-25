import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PaymentPage from "../../pages/PaymentPage";
import { CartItem } from "../../types";
import { BOOKS } from "../../data/books";

const cartItems: CartItem[] = [
  { book: BOOKS[6], quantity: 1 }, // Joy of Minimalism ₹149
  { book: BOOKS[2], quantity: 1 }, // The Path to Success ₹359
];

const renderPayment = (props = {}) =>
  render(
    <MemoryRouter>
      <PaymentPage
        cartItems={cartItems}
        onPaymentSuccess={jest.fn()}
        {...props}
      />
    </MemoryRouter>
  );

describe("PaymentPage — layout", () => {
  it("renders Complete Payment heading", () => {
    renderPayment();
    expect(screen.getByText("Complete Payment")).toBeInTheDocument();
  });

  it("shows correct payable amount (subtotal × 1.12)", () => {
    // (149 + 359) * 1.12 = 508 * 1.12 = 568.96 → round → 569
    renderPayment();
    expect(screen.getByText(/Payable Amount:.*569/)).toBeInTheDocument();
  });

  it("renders all payment method tabs", () => {
    renderPayment();
    expect(screen.getByText("Credit Card")).toBeInTheDocument();
    expect(screen.getByText("Debit card")).toBeInTheDocument();
    expect(screen.getByText("UPI")).toBeInTheDocument();
    expect(screen.getByText("Wallet")).toBeInTheDocument();
  });

  it("renders Pay Now button", () => {
    renderPayment();
    expect(screen.getByText("Pay Now")).toBeInTheDocument();
  });
});

describe("PaymentPage — Credit Card form", () => {
  it("renders Card Number input by default (Credit Card tab)", () => {
    renderPayment();
    expect(screen.getByPlaceholderText("XXXX-XXXX-XXXX-XXXX")).toBeInTheDocument();
  });

  it("renders Name on Card input", () => {
    renderPayment();
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
  });

  it("renders CVV and Date of Expiry inputs", () => {
    renderPayment();
    expect(screen.getByPlaceholderText("XXX")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("MM/YYYY")).toBeInTheDocument();
  });

  it("accepts card number input", () => {
    renderPayment();
    const cardInput = screen.getByPlaceholderText("XXXX-XXXX-XXXX-XXXX");
    fireEvent.change(cardInput, { target: { value: "4111111111111111" } });
    expect(screen.getByDisplayValue("4111111111111111")).toBeInTheDocument();
  });
});

describe("PaymentPage — tab switching", () => {
  it("shows UPI ID input when UPI tab is selected", () => {
    renderPayment();
    fireEvent.click(screen.getByText("UPI"));
    expect(screen.getByPlaceholderText("yourname@upi")).toBeInTheDocument();
  });

  it("shows wallet options when Wallet tab is selected", () => {
    renderPayment();
    fireEvent.click(screen.getByText("Wallet"));
    expect(screen.getByText("Paytm")).toBeInTheDocument();
    expect(screen.getByText("PhonePe")).toBeInTheDocument();
  });

  it("shows Debit card form fields when Debit card tab is selected", () => {
    renderPayment();
    fireEvent.click(screen.getByText("Debit card"));
    expect(screen.getByPlaceholderText("XXXX-XXXX-XXXX-XXXX")).toBeInTheDocument();
  });

  it("switching back to Credit Card shows card form", () => {
    renderPayment();
    fireEvent.click(screen.getByText("UPI"));
    fireEvent.click(screen.getByText("Credit Card"));
    expect(screen.getByPlaceholderText("XXXX-XXXX-XXXX-XXXX")).toBeInTheDocument();
  });
});

describe("PaymentPage — Pay Now", () => {
  it("calls onPaymentSuccess when Pay Now is clicked", () => {
    const onPaymentSuccess = jest.fn();
    renderPayment({ onPaymentSuccess });
    fireEvent.click(screen.getByText("Pay Now"));
    expect(onPaymentSuccess).toHaveBeenCalled();
  });
});
