"use client";

interface CategoryTabsProps {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
}

export function CategoryTabs({
  categories,
  active,
  onSelect,
}: CategoryTabsProps) {
  return (
    <nav className="flex gap-1 overflow-x-auto px-4 pb-2 -mb-px scrollbar-none">
      <button
        onClick={() => onSelect("All")}
        className={`shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
          active === "All"
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            active === cat
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
}
