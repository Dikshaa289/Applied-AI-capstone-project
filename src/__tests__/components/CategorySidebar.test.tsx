import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CategorySidebar from "../../components/CategorySidebar";

const CATS = ["All", "Romance", "Mystery", "Science Fiction", "Fantasy"];

describe("CategorySidebar", () => {
  it("renders all category buttons", () => {
    render(<CategorySidebar categories={CATS} selected="All" onSelect={jest.fn()} />);
    CATS.forEach((cat) => {
      expect(screen.getByText(cat)).toBeInTheDocument();
    });
  });

  it("applies active styles to the selected category", () => {
    render(<CategorySidebar categories={CATS} selected="Romance" onSelect={jest.fn()} />);
    const activeBtn = screen.getByText("Romance");
    expect(activeBtn).toHaveClass("text-white");
    expect(activeBtn).toHaveClass("border-l-2");
  });

  it("does not apply active styles to unselected categories", () => {
    render(<CategorySidebar categories={CATS} selected="All" onSelect={jest.fn()} />);
    const inactiveBtn = screen.getByText("Romance");
    expect(inactiveBtn).not.toHaveClass("border-l-2");
  });

  it("calls onSelect with the clicked category", () => {
    const onSelect = jest.fn();
    render(<CategorySidebar categories={CATS} selected="All" onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Mystery"));
    expect(onSelect).toHaveBeenCalledWith("Mystery");
  });

  it("calls onSelect with each different category", () => {
    const onSelect = jest.fn();
    render(<CategorySidebar categories={CATS} selected="All" onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Science Fiction"));
    expect(onSelect).toHaveBeenCalledWith("Science Fiction");
    fireEvent.click(screen.getByText("Fantasy"));
    expect(onSelect).toHaveBeenCalledWith("Fantasy");
  });

  it("renders an empty list without crashing", () => {
    const { container } = render(
      <CategorySidebar categories={[]} selected="" onSelect={jest.fn()} />
    );
    expect(container).toBeInTheDocument();
  });
});
