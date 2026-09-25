import React from "react";
import { Search } from "lucide-react";

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  language: string;
  onLanguageChange: (v: string) => void;
  format: string;
  onFormatChange: (v: string) => void;
  priceRange: string;
  onPriceRangeChange: (v: string) => void;
  sortBy: string;
  onSortByChange: (v: string) => void;
}

const selectCls =
  "bg-surface border border-border text-muted text-xs rounded px-2 py-1.5 focus:outline-none focus:border-accent hover:border-muted transition-colors appearance-none cursor-pointer";

const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  language,
  onLanguageChange,
  format,
  onFormatChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortByChange,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-dark border-b border-border">
      {/* Search */}
      <div className="relative flex-1 min-w-40">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search you want to read here"
          className="w-full bg-surface border border-border text-white text-xs rounded px-3 py-1.5 pr-8 placeholder-muted focus:outline-none focus:border-accent transition-colors"
        />
        <Search size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
      </div>

      {/* Language */}
      <div className="flex flex-col gap-0.5">
        <span className="text-muted text-[10px] px-1">Language</span>
        <select value={language} onChange={(e) => onLanguageChange(e.target.value)} className={selectCls}>
          <option>All</option>
          <option>English</option>
          <option>Hindi</option>
        </select>
      </div>

      {/* Format */}
      <div className="flex flex-col gap-0.5">
        <span className="text-muted text-[10px] px-1">Format (Paperback, ebook etc)</span>
        <select value={format} onChange={(e) => onFormatChange(e.target.value)} className={selectCls}>
          <option>All</option>
          <option>Paperback</option>
          <option>Hardcover</option>
          <option>eBook</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-0.5">
        <span className="text-muted text-[10px] px-1">Price Range</span>
        <select value={priceRange} onChange={(e) => onPriceRangeChange(e.target.value)} className={selectCls}>
          <option>All</option>
          <option>Under ₹200</option>
          <option>₹200 – ₹400</option>
          <option>Over ₹400</option>
        </select>
      </div>

      {/* Sort By */}
      <div className="flex flex-col gap-0.5">
        <span className="text-muted text-[10px] px-1">Sort by</span>
        <select value={sortBy} onChange={(e) => onSortByChange(e.target.value)} className={selectCls}>
          <option>Relevance</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
