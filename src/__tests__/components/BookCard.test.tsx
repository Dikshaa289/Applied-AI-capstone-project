import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BookCard, { BookCover } from "../../components/BookCard";
import { Book } from "../../types";

const mockBook: Book = {
  id: 1,
  title: "The Art of Focus",
  author: "Arjun Patel",
  description: "Practical guide to mastering focus.",
  format: "Paperback",
  genres: ["Non-fiction", "Self Help"],
  price: 399,
  delivery: "Mon, 21 Jul",
  coverColor: "#fff",
  coverText: "THE ART OF FOCUS",
  coverBg: "#f5f0e8",
};

const renderCard = (props = {}) =>
  render(
    <MemoryRouter>
      <BookCard book={mockBook} {...props} />
    </MemoryRouter>
  );

// ── BookCover ────────────────────────────────────────────────────────────────

describe("BookCover", () => {
  it("renders cover text", () => {
    render(
      <MemoryRouter>
        <BookCover book={mockBook} />
      </MemoryRouter>
    );
    expect(screen.getByText("THE ART OF FOCUS")).toBeInTheDocument();
  });

  it("applies correct background colour", () => {
    const { container } = render(
      <MemoryRouter>
        <BookCover book={mockBook} />
      </MemoryRouter>
    );
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveStyle({ backgroundColor: "#f5f0e8" });
  });

  it("applies sm size class", () => {
    const { container } = render(
      <MemoryRouter>
        <BookCover book={mockBook} size="sm" />
      </MemoryRouter>
    );
    expect(container.firstChild).toHaveClass("w-16");
  });

  it("applies lg size class", () => {
    const { container } = render(
      <MemoryRouter>
        <BookCover book={mockBook} size="lg" />
      </MemoryRouter>
    );
    expect(container.firstChild).toHaveClass("w-40");
  });
});

// ── BookCard — basic render ──────────────────────────────────────────────────

describe("BookCard render", () => {
  it("renders title, author, price, format and delivery", () => {
    renderCard();
    expect(screen.getByText("The Art of Focus")).toBeInTheDocument();
    expect(screen.getByText("Arjun Patel")).toBeInTheDocument();
    expect(screen.getByText("₹399")).toBeInTheDocument();
    expect(screen.getByText("Paperback")).toBeInTheDocument();
    expect(screen.getByText("Mon, 21 Jul")).toBeInTheDocument();
  });

  it("renders genres", () => {
    renderCard();
    expect(screen.getByText("Non-fiction")).toBeInTheDocument();
    expect(screen.getByText("Self Help")).toBeInTheDocument();
  });

  it("does not render heart button when onToggleWishlist is not provided", () => {
    renderCard();
    expect(screen.queryByLabelText(/wishlist/i)).not.toBeInTheDocument();
  });

  it("does not render cart controls when onAddToCart is not provided", () => {
    renderCard();
    expect(screen.queryByText("Add to Cart")).not.toBeInTheDocument();
  });

  it("renders cover with compact sm size", () => {
    const { container } = renderCard({ compact: true });
    expect(container.querySelector(".w-16")).toBeInTheDocument();
  });
});

// ── BookCard — Add to Cart button ────────────────────────────────────────────

describe("BookCard Add to Cart", () => {
  it("shows Add to Cart button when cartQty is 0", () => {
    renderCard({ onAddToCart: jest.fn(), cartQty: 0 });
    expect(screen.getByText("Add to Cart")).toBeInTheDocument();
  });

  it("calls onAddToCart when button is clicked", () => {
    const onAddToCart = jest.fn();
    renderCard({ onAddToCart, cartQty: 0 });
    fireEvent.click(screen.getByText("Add to Cart"));
    expect(onAddToCart).toHaveBeenCalledWith(mockBook);
  });

  it("shows stepper when cartQty > 0", () => {
    renderCard({ onAddToCart: jest.fn(), cartQty: 2, onUpdateQty: jest.fn() });
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByLabelText("Increase quantity")).toBeInTheDocument();
    expect(screen.getByLabelText("Decrease quantity")).toBeInTheDocument();
  });

  it("hides Add to Cart button when cartQty > 0", () => {
    renderCard({ onAddToCart: jest.fn(), cartQty: 1, onUpdateQty: jest.fn() });
    expect(screen.queryByText("Add to Cart")).not.toBeInTheDocument();
  });
});

// ── BookCard — stepper interactions ─────────────────────────────────────────

describe("BookCard stepper", () => {
  it("calls onUpdateQty with incremented value on + click", () => {
    const onUpdateQty = jest.fn();
    renderCard({ onAddToCart: jest.fn(), cartQty: 2, onUpdateQty });
    fireEvent.click(screen.getByLabelText("Increase quantity"));
    expect(onUpdateQty).toHaveBeenCalledWith(1, 3);
  });

  it("calls onUpdateQty with decremented value when qty > 1", () => {
    const onUpdateQty = jest.fn();
    renderCard({ onAddToCart: jest.fn(), cartQty: 3, onUpdateQty, onRemove: jest.fn() });
    fireEvent.click(screen.getByLabelText("Decrease quantity"));
    expect(onUpdateQty).toHaveBeenCalledWith(1, 2);
  });

  it("calls onRemove when qty is 1 and − is clicked", () => {
    const onRemove = jest.fn();
    renderCard({ onAddToCart: jest.fn(), cartQty: 1, onUpdateQty: jest.fn(), onRemove });
    fireEvent.click(screen.getByLabelText("Decrease quantity"));
    expect(onRemove).toHaveBeenCalledWith(1);
  });
});

// ── BookCard — wishlist ──────────────────────────────────────────────────────

describe("BookCard wishlist", () => {
  it("shows hollow heart when not wishlisted", () => {
    renderCard({ onToggleWishlist: jest.fn(), wishlisted: false });
    expect(screen.getByLabelText("Add to wishlist")).toBeInTheDocument();
  });

  it("shows filled heart label when wishlisted", () => {
    renderCard({ onToggleWishlist: jest.fn(), wishlisted: true });
    expect(screen.getByLabelText("Remove from wishlist")).toBeInTheDocument();
  });

  it("calls onToggleWishlist when heart is clicked", () => {
    const onToggleWishlist = jest.fn();
    renderCard({ onToggleWishlist });
    fireEvent.click(screen.getByLabelText("Add to wishlist"));
    expect(onToggleWishlist).toHaveBeenCalledWith(mockBook);
  });
});
