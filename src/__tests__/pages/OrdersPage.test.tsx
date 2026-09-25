import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OrdersPage from "../../pages/OrdersPage";
import { Order, Book, CartItem } from "../../types";
import { BOOKS } from "../../data/books";

const makeOrder = (id: string, status: Order["status"], books = [BOOKS[0]]): Order => ({
  id,
  placedAt: "2024-07-21T10:00:00.000Z",
  items: books.map((b) => ({ book: b, quantity: 1 })),
  subtotal: books.reduce((s, b) => s + b.price, 0),
  tax: 48,
  discount: 0,
  total: books.reduce((s, b) => s + b.price, 0) + 48,
  status,
  address: "123 Main Street, Mumbai",
});

const defaultProps = {
  orders: [] as Order[],
  cartItems: [] as CartItem[],
  wishlist: [] as Book[],
  onAddToCart: jest.fn(),
  onUpdateQty: jest.fn(),
  onRemove: jest.fn(),
  onToggleWishlist: jest.fn(),
};

const renderPage = (props = {}) =>
  render(
    <MemoryRouter>
      <OrdersPage {...defaultProps} {...props} />
    </MemoryRouter>
  );

describe("OrdersPage — empty state", () => {
  it("renders My Orders heading", () => {
    renderPage();
    expect(screen.getByText("My Orders")).toBeInTheDocument();
  });

  it("shows empty state message", () => {
    renderPage();
    expect(screen.getByText("You haven't placed any orders yet.")).toBeInTheDocument();
  });

  it("shows Start Shopping button in empty state", () => {
    renderPage();
    expect(screen.getByText("Start Shopping")).toBeInTheDocument();
  });
});

describe("OrdersPage — with orders", () => {
  const orders = [
    makeOrder("BW00000001", "Processing", [BOOKS[0]]),
    makeOrder("BW00000002", "Delivered", [BOOKS[1]]),
  ];

  it("renders order IDs", () => {
    renderPage({ orders });
    expect(screen.getByText("Order #BW00000001")).toBeInTheDocument();
    expect(screen.getByText("Order #BW00000002")).toBeInTheDocument();
  });

  it("renders status badges", () => {
    renderPage({ orders });
    expect(screen.getAllByText("Processing").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Delivered").length).toBeGreaterThan(0);
  });

  it("renders order date", () => {
    renderPage({ orders });
    expect(screen.getAllByText(/Placed on/i).length).toBeGreaterThan(0);
  });

  it("renders filter tabs including All, Delivered, Cancelled", () => {
    renderPage({ orders });
    expect(screen.getAllByText(/^All/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^Cancelled/).length).toBeGreaterThan(0);
  });
});

describe("OrdersPage — filtering", () => {
  const orders = [
    makeOrder("BW00000001", "Processing"),
    makeOrder("BW00000002", "Delivered"),
    makeOrder("BW00000003", "Shipped"),
  ];

  it("shows all orders when All tab is active", () => {
    renderPage({ orders });
    expect(screen.getByText("Order #BW00000001")).toBeInTheDocument();
    expect(screen.getByText("Order #BW00000002")).toBeInTheDocument();
  });

  it("filters to only Delivered orders when Delivered tab clicked", () => {
    renderPage({ orders });
    const tabs = screen.getAllByRole("button", { name: /^Delivered/ });
    fireEvent.click(tabs[0]);
    expect(screen.getByText("Order #BW00000002")).toBeInTheDocument();
    expect(screen.queryByText("Order #BW00000001")).not.toBeInTheDocument();
  });

  it("shows 'No orders match your filter' when filter returns nothing", () => {
    renderPage({ orders });
    const tabs = screen.getAllByRole("button", { name: /^Cancelled/ });
    fireEvent.click(tabs[0]);
    expect(screen.getByText("No orders match your filter.")).toBeInTheDocument();
  });

  it("filters by search input matching order ID", () => {
    renderPage({ orders });
    const input = screen.getByPlaceholderText(/Search by order ID/i);
    fireEvent.change(input, { target: { value: "BW00000003" } });
    expect(screen.getByText("Order #BW00000003")).toBeInTheDocument();
    expect(screen.queryByText("Order #BW00000001")).not.toBeInTheDocument();
  });

  it("filters by search input matching book title", () => {
    renderPage({ orders });
    const input = screen.getByPlaceholderText(/Search by order ID/i);
    fireEvent.change(input, { target: { value: BOOKS[0].title.toLowerCase() } });
    expect(screen.getAllByText("Order #BW00000001").length).toBeGreaterThan(0);
  });
});

describe("OrdersPage — expand/collapse order card", () => {
  const orders = [makeOrder("BW00000001", "Processing", [BOOKS[0]])];

  it("expands order to show details when header is clicked", () => {
    renderPage({ orders });
    fireEvent.click(screen.getByText("Order #BW00000001"));
    expect(screen.getByText("Items")).toBeInTheDocument();
    expect(screen.getByText("Price Breakdown")).toBeInTheDocument();
  });

  it("shows stepper when expanded for non-cancelled order", () => {
    renderPage({ orders });
    fireEvent.click(screen.getByText("Order #BW00000001"));
    // STATUS_STEPS labels should appear inside expanded card
    expect(screen.getAllByText("Processing").length).toBeGreaterThan(0);
  });

  it("shows cancelled message for cancelled orders", () => {
    const cancelledOrders = [makeOrder("BW99", "Cancelled")];
    renderPage({ orders: cancelledOrders });
    fireEvent.click(screen.getByText("Order #BW99"));
    expect(screen.getByText("This order was cancelled.")).toBeInTheDocument();
  });

  it("shows delivery address when expanded", () => {
    renderPage({ orders });
    fireEvent.click(screen.getByText("Order #BW00000001"));
    expect(screen.getByText("123 Main Street, Mumbai")).toBeInTheDocument();
  });

  it("collapses when header is clicked again", () => {
    renderPage({ orders });
    fireEvent.click(screen.getByText("Order #BW00000001")); // expand
    fireEvent.click(screen.getByText("Order #BW00000001")); // collapse
    expect(screen.queryByText("Price Breakdown")).not.toBeInTheDocument();
  });
});

describe("OrdersPage — recommendations sidebar", () => {
  it("hides recommendations sidebar when orders are empty", () => {
    renderPage();
    expect(screen.queryByText("Recommended for You")).not.toBeInTheDocument();
  });

  it("shows recommendations sidebar when orders exist (books with genre overlap)", () => {
    // Order contains The Art of Focus (Self Help) → recommendations should include
    // other Self Help books not yet ordered
    const orders = [makeOrder("BW1", "Processing", [BOOKS[0]])];
    renderPage({ orders });
    expect(screen.getByText("Recommended for You")).toBeInTheDocument();
    expect(screen.getByText("Based on your order history")).toBeInTheDocument();
  });
});
