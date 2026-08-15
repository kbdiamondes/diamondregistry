"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ProductCard } from "@/components/ProductCard";
import { ClaimModal } from "@/components/ClaimModal";
import { Toast } from "@/components/Toast";
import { Product } from "@/lib/types";
import { mockProducts, mockCategories, redactName } from "@/lib/data";

export default function RegistryPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [claimingProduct, setClaimingProduct] = useState<Product | null>(null);
  const [claimError, setClaimError] = useState<string>("");
  const [toast, setToast] = useState<string>("");

  const categories = useMemo(
    () => mockCategories.map((c) => c.name).sort(),
    []
  );

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const handleClaim = (product: Product) => {
    setClaimError("");
    setClaimingProduct(product);
  };

  const handleConfirmClaim = (
    product: Product,
    firstName: string,
    lastName: string
  ) => {
    // Race condition check: re-verify product is still available
    const current = products.find((p) => p.id === product.id);
    if (!current || current.is_claimed) {
      setClaimError(
        "Someone just claimed this ahead of you! Please choose another gift."
      );
      return;
    }

    const displayName = redactName(firstName, lastName);
    const now = new Date().toISOString();

    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? {
              ...p,
              is_claimed: true,
              claimed_by_real: `${firstName} ${lastName}`,
              claimed_by_display: displayName,
              claimed_at: now,
            }
          : p
      )
    );

    setClaimingProduct(null);
    setToast(`You've claimed ${product.name} for the couple.`);
    setTimeout(() => setToast(""), 4000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        coupleNames="Keith & [Partner]"
        weddingDate="Spring 2027"
        welcomeMessage="We're so grateful you're celebrating with us. Browse our registry and choose a gift that speaks to you."
      />

      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Category Tabs */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border py-3 -mx-4 px-4">
          <CategoryTabs
            categories={categories}
            active={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>

        {/* Product Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClaim={handleClaim}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              No gifts in this category yet.
            </p>
          </div>
        )}
      </div>

      {/* Claim Modal */}
      {claimingProduct && (
        <ClaimModal
          product={claimingProduct}
          onClose={() => {
            setClaimingProduct(null);
            setClaimError("");
          }}
          onConfirm={handleConfirmClaim}
          error={claimError}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Made with care for Keith & [Partner]
        </p>
      </footer>
    </div>
  );
}
