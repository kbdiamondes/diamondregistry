"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ProductCard } from "@/components/ProductCard";
import { ClaimModal } from "@/components/ClaimModal";
import { Toast } from "@/components/Toast";
import { Product } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { redactName } from "@/lib/data";

export default function RegistryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [claimingProduct, setClaimingProduct] = useState<Product | null>(null);
  const [claimError, setClaimError] = useState<string>("");
  const [toast, setToast] = useState<string>("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) {
      setProducts(data as Product[]);
    }
    setLoading(false);
  };

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const handleClaim = (product: Product) => {
    setClaimError("");
    setClaimingProduct(product);
  };

  const handleConfirmClaim = async (
    product: Product,
    firstName: string,
    lastName: string
  ) => {
    // Race condition protection: use RPC or check-then-update
    // First, verify the product is still unclaimed
    const { data: current, error: fetchErr } = await supabase
      .from("products")
      .select("is_claimed")
      .eq("id", product.id)
      .single();

    if (fetchErr || !current || current.is_claimed) {
      setClaimError(
        "Someone just claimed this ahead of you! Please choose another gift."
      );
      return;
    }

    const displayName = redactName(firstName, lastName);
    const now = new Date().toISOString();

    // Update the product
    const { error: updateErr } = await supabase
      .from("products")
      .update({
        is_claimed: true,
        claimed_by_real: `${firstName} ${lastName}`,
        claimed_by_display: displayName,
        claimed_at: now,
      })
      .eq("id", product.id)
      .eq("is_claimed", false); // Double-check race condition

    if (updateErr) {
      setClaimError(
        "Someone just claimed this ahead of you! Please choose another gift."
      );
      return;
    }

    // Update local state
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading gifts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        coupleNames="Keith & Angie"
        weddingDate="Spring 2028"
        welcomeMessage="We're so grateful you're celebrating with us. Browse our registry and choose a gift that speaks to you."
      />

      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Registry Note */}
        <p className="text-center text-xs text-muted-foreground mb-6 leading-relaxed">
          This is a gift registry only — we don&apos;t process orders. Please
          purchase your chosen gift directly from the retailer using the link on
          each product card.
        </p>

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
          Made with care for Keith & Angie
        </p>
      </footer>
    </div>
  );
}
