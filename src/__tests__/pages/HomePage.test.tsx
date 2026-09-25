import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import { Book, CartItem } from "../../types";
import { BOOKS } from "../../data/books";

const defaultProps = {
  onAddToCart: jest.fn(),
  onUpdateQty: jest.fn(),
  onRemove: jest.fn(),
  cartItems: [] as CartItem[],
  wishlist: [] as Book[],
  onToggleWishlist: jest.fn(),
};

const renderPage = (props = {}) =>
  render(
    <MemoryRouter>
      <HomePage {...defaultProps} {...props} />
    </MemoryRouter>
  );

describe("HomePage — default sections", () => {
  it("renders 'Recommended for You' section heading", () => {
    renderPage();
    expect(screen.getByText("Recommended for You")).toBeInTheDocument();
  });

  it("renders 'Bestsellers this Month' section heading", () => {
    renderPage();
    expect(screen.getByText("Bestsellers this Month")).toBeInTheDocument();
  });

  it("renders 'New Launches' section heading", () => {
    renderPage();
    expect(screen.getByText("New Launches")).toBeInTheDocument();
  });

  it("renders books from the first section", () => {
    renderPage();
    expect(screen.getAllByText("The Art of Focus").length).toBeGreaterThan(0);
  });
});

describe("HomePage — search/filter", () => {
  it("shows Search Results heading when search is active", () => {
    renderPage();
    const input = screen.getByPlaceholderText(/search you want to read here/i);
    fireEvent.change(input, { target: { value: "focus" } });
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });

  it("filters books by search text (title)", () => {
    renderPage();
    const input = screen.getByPlaceholderText(/search you want to read here/i);
    fireEvent.change(input, { target: { value: "midnight" } });
    expect(screen.getAllByText(/The Midnight Hour/i).length).toBeGreaterThan(0);
    // "The Art of Focus" should not appear in filtered list
    expect(screen.queryAllByText("The Art of Focus").length).toBe(0);
  });

  it("shows 'No books found' when no results match", () => {
    renderPage();
    const input = screen.getByPlaceholderText(/search you want to read here/i);
    fireEvent.change(input, { target: { value: "zzznomatch" } });
    expect(screen.getByText("No books found.")).toBeInTheDocument();
  });

  it("filters by format (eBook)", () => {
    renderPage();
    const selects = screen.getAllByRole("combobox");
    // Format is 2nd select (index 1)
    fireEvent.change(selects[1], { target: { value: "eBook" } });
    // The Vanishing House is an eBook
    expect(screen.getAllByText(/The Vanishing House/i).length).toBeGreaterThan(0);
  });

  it("filters books Under ₹200 price range", () => {
    renderPage();
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[2], { target: { value: "Under ₹200" } });
    // Joy of Minimalism (₹149) and The Vanishing House (₹99) are under ₹200
    expect(screen.queryAllByText("The Art of Focus").length).toBe(0);
  });

  it("sorts books by Price: Low to High", () => {
    renderPage();
    const input = screen.getByPlaceholderText(/search you want to read here/i);
    fireEvent.change(input, { target: { value: "a" } });
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[3], { target: { value: "Price: Low to High" } });
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });
});

describe("HomePage — cart quantity controls", () => {
  it("shows Add to Cart for a book not in cart", () => {
    renderPage();
    const buttons = screen.getAllByText("Add to Cart");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("calls onAddToCart when Add to Cart is clicked", () => {
    const onAddToCart = jest.fn();
    renderPage({ onAddToCart });
    fireEvent.click(screen.getAllByText("Add to Cart")[0]);
    expect(onAddToCart).toHaveBeenCalled();
  });

  it("shows stepper for a book already in cart", () => {
    const cartItems: CartItem[] = [{ book: BOOKS[0], quantity: 2 }];
    renderPage({ cartItems });
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});

describe("HomePage — wishlist", () => {
  it("calls onToggleWishlist when heart is clicked", () => {
    const onToggleWishlist = jest.fn();
    renderPage({ onToggleWishlist });
    fireEvent.click(screen.getAllByLabelText("Add to wishlist")[0]);
    expect(onToggleWishlist).toHaveBeenCalled();
  });

  it("shows 'Remove from wishlist' label for wishlisted books", () => {
    renderPage({ wishlist: [BOOKS[0]] });
    expect(screen.getAllByLabelText("Remove from wishlist").length).toBeGreaterThan(0);
  });
});
