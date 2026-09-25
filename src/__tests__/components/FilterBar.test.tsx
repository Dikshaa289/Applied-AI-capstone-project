import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterBar from "../../components/FilterBar";

const defaultProps = {
  search: "",
  onSearchChange: jest.fn(),
  language: "All",
  onLanguageChange: jest.fn(),
  format: "All",
  onFormatChange: jest.fn(),
  priceRange: "All",
  onPriceRangeChange: jest.fn(),
  sortBy: "Relevance",
  onSortByChange: jest.fn(),
};

describe("FilterBar", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders the search input with placeholder", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByPlaceholderText(/search you want to read here/i)).toBeInTheDocument();
  });

  it("reflects current search value in the input", () => {
    render(<FilterBar {...defaultProps} search="fantasy" />);
    expect(screen.getByDisplayValue("fantasy")).toBeInTheDocument();
  });

  it("calls onSearchChange when typing in search input", () => {
    const onSearchChange = jest.fn();
    render(<FilterBar {...defaultProps} onSearchChange={onSearchChange} />);
    fireEvent.change(screen.getByPlaceholderText(/search you want to read here/i), {
      target: { value: "mystery" },
    });
    expect(onSearchChange).toHaveBeenCalledWith("mystery");
  });

  it("renders Language label and select", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText("Language")).toBeInTheDocument();
  });

  it("calls onLanguageChange when language select changes", () => {
    const onLanguageChange = jest.fn();
    render(<FilterBar {...defaultProps} onLanguageChange={onLanguageChange} />);
    const selects = screen.getAllByRole("combobox");
    // Language is the first select
    fireEvent.change(selects[0], { target: { value: "English" } });
    expect(onLanguageChange).toHaveBeenCalledWith("English");
  });

  it("calls onFormatChange when format select changes", () => {
    const onFormatChange = jest.fn();
    render(<FilterBar {...defaultProps} onFormatChange={onFormatChange} />);
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[1], { target: { value: "Paperback" } });
    expect(onFormatChange).toHaveBeenCalledWith("Paperback");
  });

  it("calls onPriceRangeChange when price select changes", () => {
    const onPriceRangeChange = jest.fn();
    render(<FilterBar {...defaultProps} onPriceRangeChange={onPriceRangeChange} />);
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[2], { target: { value: "Under ₹200" } });
    expect(onPriceRangeChange).toHaveBeenCalledWith("Under ₹200");
  });

  it("calls onSortByChange when sort select changes", () => {
    const onSortByChange = jest.fn();
    render(<FilterBar {...defaultProps} onSortByChange={onSortByChange} />);
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[3], { target: { value: "Price: Low to High" } });
    expect(onSortByChange).toHaveBeenCalledWith("Price: Low to High");
  });

  it("reflects current sortBy value in the select", () => {
    render(<FilterBar {...defaultProps} sortBy="Price: High to Low" />);
    expect(screen.getByDisplayValue("Price: High to Low")).toBeInTheDocument();
  });
});
