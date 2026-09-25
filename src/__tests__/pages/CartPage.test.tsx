import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CartPage from "../../pages/CartPage";
import { CartItem } from "../../types";
import { BOOKS } from "../../data/books";

const book1 = BOOKS[6]; // Joy of Minimalism ₹149
const book2 = BOOKS[2]; // The Path to Success ₹359

const cartWith2: CartItem[] = [
  { book: book1, quantity: 1 },
  { book: book2, quantity: 1 },
];

const renderCart = (cartItems: CartItem[] = cartWith2, props = {}) =>
  render(
    <MemoryRouter>
      <CartPage
        cartItems={cartItems}
        onUpdateQty={jest.fn()}
        onRemove={jest.fn()}
        {...props}
      />
    </MemoryRouter>
  );

describe("CartPage — empty state", () => {
  it("shows 'Your cart is empty' when no items", () => {
    renderCart([]);
    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
  });

  it("shows Browse Books button in empty state", () => {
    renderCart([]);
    expect(screen.getByText("Browse Books")).toBeInTheDocument();
  });
});

describe("CartPage — with items", () => {
  it("renders Shopping Cart heading", () => {
    renderCart();
    expect(screen.getByText("Shopping Cart")).toBeInTheDocument();
  });

  it("renders both book titles", () => {
    renderCart();
    expect(screen.getByText("Joy of Minimalism")).toBeInTheDocument();
    expect(screen.getByText("The Path to Success")).toBeInTheDocument();
  });

  it("renders subtotal price correctly", () => {
    renderCart(); // 149 + 359 = 508
    expect(screen.getByText("₹508.00")).toBeInTheDocument();
  });

  it("renders tax amount (12% of subtotal)", () => {
    renderCart(); // Math.round(508 * 0.12) = 61
    expect(screen.getByText("₹61.00")).toBeInTheDocument();
  });

  it("renders Total Amount", () => {
    renderCart(); // 508 + 61 = 569
    expect(screen.getByText("₹569")).toBeInTheDocument();
  });

  it("renders breadcrumb Home link", () => {
    renderCart();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renders Grand Total heading", () => {
    renderCart();
    expect(screen.getByText("Grand Total")).toBeInTheDocument();
  });

  it("renders Delivery Charges as Free", () => {
    renderCart();
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("renders Address section", () => {
    renderCart();
    expect(screen.getByText("Address")).toBeInTheDocument();
  });

  it("renders Pay Now button", () => {
    renderCart();
    expect(screen.getByText("Pay Now")).toBeInTheDocument();
  });
});

describe("CartPage — quantity controls", () => {
  it("calls onUpdateQty with incremented qty on + click", () => {
    const onUpdateQty = jest.fn();
    renderCart(cartWith2, { onUpdateQty });
    const plusBtns = screen.getAllByText("+");
    fireEvent.click(plusBtns[0]);
    expect(onUpdateQty).toHaveBeenCalledWith(book1.id, 2);
  });

  it("calls onUpdateQty with decremented qty when qty > 1", () => {
    const onUpdateQty = jest.fn();
    const items: CartItem[] = [{ book: book1, quantity: 3 }];
    renderCart(items, { onUpdateQty });
    fireEvent.click(screen.getByText("−"));
    expect(onUpdateQty).toHaveBeenCalledWith(book1.id, 2);
  });

  it("calls onRemove when qty is 1 and − is clicked", () => {
    const onRemove = jest.fn();
    renderCart(cartWith2, { onRemove });
    fireEvent.click(screen.getAllByText("−")[0]);
    expect(onRemove).toHaveBeenCalledWith(book1.id);
  });
});

describe("CartPage — coupon", () => {
  it("does not show discount row before applying coupon", () => {
    renderCart();
    expect(screen.queryByText(/−₹/)).not.toBeInTheDocument();
  });

  it("applies SAVE100 coupon and shows discount row", () => {
    renderCart();
    const couponInput = screen.getByPlaceholderText("Apply Coupon");
    fireEvent.change(couponInput, { target: { value: "save100" } });
    fireEvent.click(screen.getByText("Apply"));
    expect(screen.getByText("−₹100")).toBeInTheDocument();
  });

  it("does not apply invalid coupon", () => {
    renderCart();
    const couponInput = screen.getByPlaceholderText("Apply Coupon");
    fireEvent.change(couponInput, { target: { value: "INVALID" } });
    fireEvent.click(screen.getByText("Apply"));
    expect(screen.queryByText(/−₹/)).not.toBeInTheDocument();
  });
});

describe("CartPage — address form", () => {
  it("renders First Name and Last Name inputs", () => {
    renderCart();
    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
  });

  it("updates First Name field on input", () => {
    renderCart();
    const input = screen.getByPlaceholderText("First Name");
    fireEvent.change(input, { target: { value: "John" } });
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
  });

  it("toggles Use Saved Address checkbox", () => {
    renderCart();
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("renders email input", () => {
    renderCart();
    expect(screen.getByPlaceholderText("e-mail")).toBeInTheDocument();
  });

  it("renders City and Pin inputs", () => {
    renderCart();
    expect(screen.getByPlaceholderText("City")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("000000")).toBeInTheDocument();
  });

  it("renders country select defaulting to India", () => {
    renderCart();
    expect(screen.getByDisplayValue("India")).toBeInTheDocument();
  });
});
