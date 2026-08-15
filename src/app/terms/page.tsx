import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Registry
        </Link>

        <h1 className="font-serif text-3xl font-semibold text-foreground mt-6 mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: August 15, 2026
        </p>

        <div className="prose prose-sm max-w-none text-foreground space-y-6">
          <section>
            <h2 className="font-serif text-xl font-semibold mb-2">
              What This Site Is
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              This is a <strong>gift registry</strong> for a wedding celebration.
              It allows guests to browse gift ideas and claim one to purchase.
              This site does <strong>not process orders, payments, or
              deliveries</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-2">
              How It Works
            </h2>
            <ul className="text-muted-foreground leading-relaxed list-disc pl-5 space-y-1">
              <li>
                You browse the registry and find a gift you&apos;d like to give.
              </li>
              <li>
                You click &ldquo;View Product&rdquo; to go to the retailer&apos;s
                website and make your purchase.
              </li>
              <li>
                You click &ldquo;Gift this to the couple&rdquo; to claim the
                item, so other guests know it&apos;s taken.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-2">
              Your Responsibility
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              When you claim a gift, you&apos;re letting other guests know you
              plan to purchase it. Please follow through with your purchase from
              the retailer. The wedding couple is not responsible for unfulfilled
              claims.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-2">
              No Warranty
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              This site is provided as-is. We make no guarantees about
              availability, uptime, or accuracy of product information. Prices
              and availability are determined by the retailers, not by us.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-2">
              Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The wedding couple and site administrators are not liable for any
              issues arising from purchases made through third-party retailer
              websites.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-border">
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
