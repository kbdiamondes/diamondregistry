"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { redactName } from "@/lib/data";

interface ClaimModalProps {
  product: Product;
  onClose: () => void;
  onConfirm: (
    product: Product,
    firstName: string,
    lastName: string
  ) => void;
  error?: string;
}

export function ClaimModal({
  product,
  onClose,
  onConfirm,
  error,
}: ClaimModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = firstName.trim().length > 0 && lastName.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
    onConfirm(product, firstName.trim(), lastName.trim());
  };

  if (submitted) {
    const display = redactName(firstName.trim(), lastName.trim());
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-card rounded-2xl border border-border p-6 max-w-md w-full shadow-lg toast-animate"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <p className="text-3xl mb-4">🎉</p>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
              Thank you, {display}!
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              You&apos;ve claimed <strong>{product.name}</strong> for the
              couple.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 text-sm font-medium bg-foreground text-background rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl border border-border p-6 max-w-md w-full shadow-lg toast-animate"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-serif text-xl font-semibold text-foreground mb-1">
          Claim this gift
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          You&apos;re about to claim <strong>{product.name}</strong>. Enter your
          name so we know who&apos;s getting this.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-foreground mb-1"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              placeholder="First name"
              autoFocus
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              placeholder="Last name"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-accent-foreground bg-accent rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirm Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
