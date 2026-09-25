import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PaymentSuccessPage from "../../pages/PaymentSuccessPage";
import { CartItem } from "../../types";
import { BOOKS } from "../../data/books";

const purchasedItems: CartItem[] = [
  { book: BOOKS[6], quantity: 1 }, // Joy of Minimalism
  { book: BOOKS[2], quantity: 1 }, // The Path to Success
];

const renderSuccess = (items: CartItem[] = purchasedItems) =>
  render(
    <MemoryRouter>
      <PaymentSuccessPage purchasedItems={items} />
    </MemoryRouter>
  );

describe("PaymentSuccessPage", () => {
  it("renders success message", () => {
    renderSuccess();
    expect(screen.getByText(/Your purchase of the/i)).toBeInTheDocument();
    expect(screen.getByText(/following reads is successful/i)).toBeInTheDocument();
  });

  it("renders all purchased book titles", () => {
    renderSuccess();
    expect(screen.getByText("Joy of Minimalism")).toBeInTheDocument();
    expect(screen.getByText("The Path to Success")).toBeInTheDocument();
  });

  it("renders author names for purchased books", () => {
    renderSuccess();
    expect(screen.getByText(/Daniel Reed/i)).toBeInTheDocument();
    expect(screen.getByText(/James Wright/i)).toBeInTheDocument();
  });

  it("renders prices", () => {
    renderSuccess();
    expect(screen.getByText("₹149")).toBeInTheDocument();
    expect(screen.getByText("₹359")).toBeInTheDocument();
  });

  it("renders Continue your Shopping button", () => {
    renderSuccess();
    expect(screen.getByText("Continue your Shopping")).toBeInTheDocument();
  });

  it("renders empty modal gracefully with no purchased items", () => {
    renderSuccess([]);
    expect(screen.getByText(/following reads is successful/i)).toBeInTheDocument();
  });

  it("renders book covers for each purchased item", () => {
    renderSuccess();
    // covers render the coverText
    expect(screen.getAllByText(/THE JOY OF MINIMALISM/i).length).toBeGreaterThan(0);
  });
});
