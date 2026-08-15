"use client";

import Image from "next/image";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  onClaim: (product: Product) => void;
}

export function ProductCard({ product, onClaim }: ProductCardProps) {
  return (
    <div
      className={`relative bg-card rounded-2xl border border-border overflow-hidden transition-all ${
        product.is_claimed ? "claimed-overlay opacity-75" : "hover:shadow-md"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-square bg-muted">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {product.is_claimed && (
          <div className="absolute top-3 right-3 bg-foreground/80 text-background text-xs font-mono px-2.5 py-1 rounded-full backdrop-blur-sm">
            Claimed
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-serif text-lg font-semibold text-foreground leading-snug">
            {product.name}
          </h3>
          {product.price && (
            <span className="text-sm font-mono text-muted-foreground whitespace-nowrap">
              {product.price}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex gap-2">
          {product.external_link && (
            <a
              href={product.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-3 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
            >
              View Product
            </a>
          )}

          {product.is_claimed ? (
            <button
              disabled
              className="flex-1 px-3 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-lg cursor-not-allowed"
            >
              Claimed by {product.claimed_by_display}
            </button>
          ) : (
            <button
              onClick={() => onClaim(product)}
              className="flex-1 px-3 py-2 text-sm font-medium text-accent-foreground bg-accent rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Gift this to the couple
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
