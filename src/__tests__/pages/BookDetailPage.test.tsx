import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BookDetailPage from "../../pages/BookDetailPage";
import { Book, CartItem } from "../../types";
import { BOOKS } from "../../data/books";

const book = BOOKS[6]; // Joy of Minimalism — id:7, genres: ["Non-fiction","Self Help"]

const defaultProps = {
  onAddToCart: jest.fn(),
  onUpdateQty: jest.fn(),
  onRemove: jest.fn(),
  cartItems: [] as CartItem[],
  wishlist: [] as Book[],
  onToggleWishlist: jest.fn(),
};

const renderDetail = (bookId: number = book.id, props = {}) =>
  render(
    <MemoryRouter initialEntries={[`/book/${bookId}`]}>
      <Routes>
        <Route
          path="/book/:id"
          element={<BookDetailPage {...defaultProps} {...props} />}
        />
      </Routes>
    </MemoryRouter>
  );

describe("BookDetailPage — valid book", () => {
  it("renders book title", () => {
    renderDetail();
    expect(screen.getAllByText(/Joy of Minimalism/i).length).toBeGreaterThan(0);
  });

  it("renders author name", () => {
    renderDetail();
    expect(screen.getAllByText(/Daniel Reed/i).length).toBeGreaterThan(0);
  });

  it("renders price", () => {
    renderDetail();
    expect(screen.getByText("₹149")).toBeInTheDocument();
  });

  it("renders format", () => {
    renderDetail();
    expect(screen.getAllByText("Paperback").length).toBeGreaterThan(0);
  });

  it("renders genre tags", () => {
    renderDetail();
    expect(screen.getAllByText("Non-fiction").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Self Help").length).toBeGreaterThan(0);
  });

  it("renders delivery information", () => {
    renderDetail();
    expect(screen.getAllByText("Mon, 21 Jul").length).toBeGreaterThan(0);
  });

  it("renders breadcrumb with Home link", () => {
    renderDetail();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renders About the writer section", () => {
    renderDetail();
    expect(screen.getByText("About the writer")).toBeInTheDocument();
  });

  it("renders Reviews section", () => {
    renderDetail();
    expect(screen.getByText("Reviews")).toBeInTheDocument();
  });

  it("renders Related Reads sidebar heading", () => {
    renderDetail();
    expect(screen.getByText("Related Reads")).toBeInTheDocument();
  });
});

describe("BookDetailPage — not found", () => {
  it("renders 'Book not found' for unknown id", () => {
    renderDetail(9999);
    expect(screen.getByText("Book not found.")).toBeInTheDocument();
  });
});

describe("BookDetailPage — Add to Cart / stepper", () => {
  it("shows Add to Cart button when not in cart", () => {
    renderDetail();
    expect(screen.getByText("Add to Cart")).toBeInTheDocument();
  });

  it("calls onAddToCart when Add to Cart is clicked", () => {
    const onAddToCart = jest.fn();
    renderDetail(book.id, { onAddToCart });
    fireEvent.click(screen.getByText("Add to Cart"));
    expect(onAddToCart).toHaveBeenCalledWith(book);
  });

  it("shows stepper when book is in cart", () => {
    const cartItems: CartItem[] = [{ book, quantity: 3 }];
    renderDetail(book.id, { cartItems });
    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
  });

  it("calls onUpdateQty on + click when in cart", () => {
    const onUpdateQty = jest.fn();
    const cartItems: CartItem[] = [{ book, quantity: 2 }];
    renderDetail(book.id, { cartItems, onUpdateQty });
    fireEvent.click(screen.getByLabelText("Increase quantity"));
    expect(onUpdateQty).toHaveBeenCalledWith(book.id, 3);
  });

  it("calls onRemove when qty is 1 and − clicked", () => {
    const onRemove = jest.fn();
    const cartItems: CartItem[] = [{ book, quantity: 1 }];
    renderDetail(book.id, { cartItems, onRemove });
    fireEvent.click(screen.getByLabelText("Decrease quantity"));
    expect(onRemove).toHaveBeenCalledWith(book.id);
  });

  it("calls onUpdateQty on decrement when qty > 1", () => {
    const onUpdateQty = jest.fn();
    const cartItems: CartItem[] = [{ book, quantity: 4 }];
    renderDetail(book.id, { cartItems, onUpdateQty });
    fireEvent.click(screen.getByLabelText("Decrease quantity"));
    expect(onUpdateQty).toHaveBeenCalledWith(book.id, 3);
  });
});

describe("BookDetailPage — wishlist", () => {
  it("shows 'Add to Wishlist' when not wishlisted", () => {
    renderDetail();
    expect(screen.getByText("Add to Wishlist")).toBeInTheDocument();
  });

  it("shows 'Wishlisted' label when book is in wishlist", () => {
    renderDetail(book.id, { wishlist: [book] });
    expect(screen.getByText("Wishlisted")).toBeInTheDocument();
  });

  it("calls onToggleWishlist when wishlist button is clicked", () => {
    const onToggleWishlist = jest.fn();
    renderDetail(book.id, { onToggleWishlist });
    fireEvent.click(screen.getByText("Add to Wishlist"));
    expect(onToggleWishlist).toHaveBeenCalledWith(book);
  });
});

describe("BookDetailPage — review form", () => {
  it("renders the review textarea", () => {
    renderDetail();
    expect(screen.getByPlaceholderText("Placeholder text")).toBeInTheDocument();
  });

  it("updates review text on input", () => {
    renderDetail();
    const textarea = screen.getByPlaceholderText("Placeholder text");
    fireEvent.change(textarea, { target: { value: "Great book!" } });
    expect(screen.getByDisplayValue("Great book!")).toBeInTheDocument();
  });

  it("truncates review text at 100 characters", () => {
    renderDetail();
    const textarea = screen.getByPlaceholderText("Placeholder text");
    const longText = "a".repeat(120);
    fireEvent.change(textarea, { target: { value: longText } });
    expect((textarea as HTMLTextAreaElement).value.length).toBeLessThanOrEqual(100);
  });

  it("renders the Submit button", () => {
    renderDetail();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });

  it("renders existing review by John Smith", () => {
    renderDetail();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });
});
