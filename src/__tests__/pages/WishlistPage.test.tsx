import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import WishlistPage from "../../pages/WishlistPage";
import { Book, CartItem } from "../../types";
import { BOOKS } from "../../data/books";

const book = BOOKS[0];

const defaultProps = {
  wishlist: [] as Book[],
  onToggleWishlist: jest.fn(),
  cartItems: [] as CartItem[],
  onAddToCart: jest.fn(),
  onUpdateQty: jest.fn(),
  onRemove: jest.fn(),
};

const renderPage = (props = {}) =>
  render(
    <MemoryRouter>
      <WishlistPage {...defaultProps} {...props} />
    </MemoryRouter>
  );

describe("WishlistPage — empty state", () => {
  it("renders My Wishlist heading", () => {
    renderPage();
    expect(screen.getByText("My Wishlist")).toBeInTheDocument();
  });

  it("shows empty state message when wishlist is empty", () => {
    renderPage();
    expect(screen.getByText("Your wishlist is empty.")).toBeInTheDocument();
  });

  it("shows Browse Books button in empty state", () => {
    renderPage();
    expect(screen.getByText("Browse Books")).toBeInTheDocument();
  });

  it("does not show item count when empty", () => {
    renderPage();
    expect(screen.queryByText(/book[s]?/)).not.toBeInTheDocument();
  });
});

describe("WishlistPage — with books", () => {
  it("renders wishlisted book title", () => {
    renderPage({ wishlist: [book] });
    expect(screen.getAllByText(book.title).length).toBeGreaterThan(0);
  });

  it("shows count of wishlisted books (singular)", () => {
    renderPage({ wishlist: [book] });
    expect(screen.getByText("(1 book)")).toBeInTheDocument();
  });

  it("shows count of wishlisted books (plural)", () => {
    renderPage({ wishlist: [BOOKS[0], BOOKS[1]] });
    expect(screen.getByText("(2 books)")).toBeInTheDocument();
  });

  it("renders Add to Cart button for each wishlisted book", () => {
    renderPage({ wishlist: [book] });
    expect(screen.getAllByText("Add to Cart").length).toBeGreaterThan(0);
  });

  it("calls onAddToCart when Add to Cart clicked", () => {
    const onAddToCart = jest.fn();
    renderPage({ wishlist: [book], onAddToCart });
    fireEvent.click(screen.getAllByText("Add to Cart")[0]);
    expect(onAddToCart).toHaveBeenCalledWith(book);
  });

  it("shows 'Remove from wishlist' heart for each item (all are wishlisted=true)", () => {
    renderPage({ wishlist: [book] });
    expect(screen.getAllByLabelText("Remove from wishlist").length).toBeGreaterThan(0);
  });

  it("calls onToggleWishlist when heart is clicked", () => {
    const onToggleWishlist = jest.fn();
    renderPage({ wishlist: [book], onToggleWishlist });
    fireEvent.click(screen.getByLabelText("Remove from wishlist"));
    expect(onToggleWishlist).toHaveBeenCalledWith(book);
  });

  it("shows stepper for book already in cart", () => {
    const cartItems: CartItem[] = [{ book, quantity: 2 }];
    renderPage({ wishlist: [book], cartItems });
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
