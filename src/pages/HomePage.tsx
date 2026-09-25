import React, { useState } from "react";
import CategorySidebar from "../components/CategorySidebar";
import FilterBar from "../components/FilterBar";
import BookCard from "../components/BookCard";
import { BOOKS, CATEGORIES } from "../data/books";
import { Book, CartItem } from "../types";

interface HomePageProps {
  onAddToCart: (book: Book) => void;
  onUpdateQty: (bookId: number, qty: number) => void;
  onRemove: (bookId: number) => void;
  cartItems: CartItem[];
  wishlist: Book[];
  onToggleWishlist: (book: Book) => void;
}

const SECTIONS = [
  { label: "Recommended for You", ids: [1, 2, 3] },
  { label: "Bestsellers this Month", ids: [4, 5, 6] },
  { label: "New Launches", ids: [7, 8, 9] },
];

const HomePage: React.FC<HomePageProps> = ({
  onAddToCart,
  onUpdateQty,
  onRemove,
  cartItems,
  wishlist,
  onToggleWishlist,
}) => {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("All");
  const [format, setFormat] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [sortBy, setSortBy] = useState("Relevance");

  const filteredBooks = BOOKS.filter((b) => {
    if (search && !b.title.toLowerCase().includes(search.toLowerCase()) && !b.author.toLowerCase().includes(search.toLowerCase())) return false;
    if (format !== "All" && b.format.toLowerCase() !== format.toLowerCase()) return false;
    if (priceRange === "Under ₹200" && b.price >= 200) return false;
    if (priceRange === "₹200 – ₹400" && (b.price < 200 || b.price > 400)) return false;
    if (priceRange === "Over ₹400" && b.price <= 400) return false;
    return true;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    return 0;
  });

  const isFiltering = search || format !== "All" || priceRange !== "All" || sortBy !== "Relevance";

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      <CategorySidebar categories={CATEGORIES} selected={category} onSelect={setCategory} />

      <div className="flex flex-col flex-1 overflow-y-auto min-h-0">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          language={language}
          onLanguageChange={setLanguage}
          format={format}
          onFormatChange={setFormat}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />

        <main className="px-6 py-4 space-y-8">
          {isFiltering ? (
            <section>
              <h2 className="text-white font-semibold text-base mb-4">Search Results</h2>
              {sortedBooks.length === 0 ? (
                <p className="text-muted text-sm">No books found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      cartQty={cartItems.find((i) => i.book.id === book.id)?.quantity ?? 0}
                      onAddToCart={onAddToCart}
                      onUpdateQty={onUpdateQty}
                      onRemove={onRemove}
                      wishlisted={wishlist.some((w) => w.id === book.id)}
                      onToggleWishlist={onToggleWishlist}
                    />
                  ))}
                </div>
              )}
            </section>
          ) : (
            SECTIONS.map((section) => {
              const sectionBooks = section.ids.map((id) => BOOKS.find((b) => b.id === id)!).filter(Boolean);
              return (
                <section key={section.label}>
                  <h2 className="text-white font-semibold text-base mb-4">{section.label}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sectionBooks.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        cartQty={cartItems.find((i) => i.book.id === book.id)?.quantity ?? 0}
                        onAddToCart={onAddToCart}
                        onUpdateQty={onUpdateQty}
                        onRemove={onRemove}
                        wishlisted={wishlist.some((w) => w.id === book.id)}
                        onToggleWishlist={onToggleWishlist}
                      />
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
