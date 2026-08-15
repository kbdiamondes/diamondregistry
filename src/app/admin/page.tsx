"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "wedding2027";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "claimed" | "unclaimed">("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Add/edit form state
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formNewCategory, setFormNewCategory] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formExternalLink, setFormExternalLink] = useState("");

  useEffect(() => {
    if (authenticated) {
      fetchProducts();
    }
  }, [authenticated]);

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password");
    }
  };

  const categories = [
    ...new Set(products.map((p) => p.category)),
  ].sort();

  const filteredProducts = products.filter((p) => {
    if (filter === "claimed") return p.is_claimed;
    if (filter === "unclaimed") return !p.is_claimed;
    return true;
  });

  const resetForm = () => {
    setFormName("");
    setFormCategory("");
    setFormNewCategory("");
    setFormPrice("");
    setFormDescription("");
    setFormImageUrl("");
    setFormExternalLink("");
    setEditingProduct(null);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const category =
      formNewCategory.trim() || formCategory || "Uncategorized";

    const newProduct = {
      name: formName.trim(),
      description: formDescription.trim(),
      price: formPrice.trim(),
      image_url:
        formImageUrl.trim() || `https://picsum.photos/seed/${Date.now()}/400/400`,
      external_link: formExternalLink.trim(),
      category,
      is_claimed: false,
      claimed_by_real: null,
      claimed_by_display: null,
      claimed_at: null,
    };

    const { data, error } = await supabase
      .from("products")
      .insert(newProduct)
      .select()
      .single();

    if (!error && data) {
      setProducts((prev) => [...prev, data as Product]);
      resetForm();
      setShowAddForm(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const category =
      formNewCategory.trim() || formCategory || editingProduct.category;

    const updates = {
      name: formName.trim(),
      description: formDescription.trim(),
      price: formPrice.trim(),
      image_url: formImageUrl.trim() || editingProduct.image_url,
      external_link: formExternalLink.trim(),
      category,
    };

    const { error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", editingProduct.id);

    if (!error) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id ? { ...p, ...updates } : p
        )
      );
      resetForm();
      setShowAddForm(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleUnclaim = async (id: string) => {
    const { error } = await supabase
      .from("products")
      .update({
        is_claimed: false,
        claimed_by_real: null,
        claimed_by_display: null,
        claimed_at: null,
      })
      .eq("id", id);

    if (!error) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                is_claimed: false,
                claimed_by_real: null,
                claimed_by_display: null,
                claimed_at: null,
              }
            : p
        )
      );
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormNewCategory("");
    setFormPrice(product.price);
    setFormDescription(product.description);
    setFormImageUrl(product.image_url);
    setFormExternalLink(product.external_link);
    setShowAddForm(true);
  };

  // Login gate
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full shadow-sm">
          <h1 className="font-serif text-2xl font-semibold text-foreground mb-1 text-center">
            Admin Access
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-5">
            Enter the registry password to manage gifts.
          </p>
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                placeholder="Enter password"
                autoFocus
              />
            </div>
            {passwordError && (
              <p className="text-sm text-red-600">{passwordError}</p>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2.5 text-sm font-medium text-accent-foreground bg-accent rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl font-semibold text-foreground">
              Registry Admin
            </h1>
            <p className="text-sm text-muted-foreground">
              {products.length} gifts · {products.filter((p) => p.is_claimed).length} claimed
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="/"
              className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
            >
              View Registry
            </a>
            <button
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
              className="px-4 py-2 text-sm font-medium text-accent-foreground bg-accent rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Add Gift
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Filter Tabs */}
        <div className="flex gap-1 mb-6">
          {(["all", "claimed", "unclaimed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize ${
                filter === f
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-card rounded-2xl border border-border p-5 mb-6 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-foreground mb-4">
              {editingProduct ? "Edit Gift" : "Add New Gift"}
            </h2>
            <form
              onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="$0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select or create below</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    New Category
                  </label>
                  <input
                    type="text"
                    value={formNewCategory}
                    onChange={(e) => setFormNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Leave blank to use existing"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Description
                  </label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    External Link
                  </label>
                  <input
                    type="url"
                    value={formExternalLink}
                    onChange={(e) => setFormExternalLink(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowAddForm(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-accent-foreground bg-accent rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  {editingProduct ? "Save Changes" : "Add Gift"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading gifts...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Gift
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                      Category
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                      Claimed By
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                      Date
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">
                          {product.name}
                        </div>
                        {product.price && (
                          <div className="text-xs text-muted-foreground font-mono">
                            {product.price}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {product.category}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                            product.is_claimed
                              ? "bg-accent/10 text-accent"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {product.is_claimed ? "Claimed" : "Available"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                        <span title={product.claimed_by_real || undefined}>
                          {product.claimed_by_display || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs font-mono hidden lg:table-cell">
                        {product.claimed_at
                          ? new Date(product.claimed_at).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => startEdit(product)}
                            className="px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                          >
                            Edit
                          </button>
                          {product.is_claimed && (
                            <button
                              onClick={() => handleUnclaim(product.id)}
                              className="px-2 py-1 text-xs font-medium text-amber-600 hover:bg-amber-50 rounded transition-colors"
                            >
                              Unclaim
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No gifts match this filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
