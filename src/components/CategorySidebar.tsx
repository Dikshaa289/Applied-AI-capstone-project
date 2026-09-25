import React from "react";

interface CategorySidebarProps {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ categories, selected, onSelect }) => {
  return (
    <aside className="hidden lg:flex flex-col w-48 flex-shrink-0 border-r border-border bg-dark overflow-y-auto min-h-0">
      <nav className="flex flex-col py-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`text-left px-4 py-1.5 text-sm transition-colors ${
              selected === cat
                ? "bg-accent/20 text-white border-l-2 border-accent"
                : "text-muted hover:text-white hover:bg-surface"
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default CategorySidebar;
