import Link from "next/link";

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: August 15, 2026
        </p>

        <div className="prose prose-sm max-w-none text-foreground space-y-6">
          <section>
            <h2 className="font-serif text-xl font-semibold mb-2">
              What We Collect
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              When you claim a gift, we collect your first and last name. This
              information is used solely to identify which guest is purchasing
              which gift.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-2">
              How Your Name Is Displayed
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Your full name is <strong>never shown publicly</strong>. On the
              registry, only a redacted version of your name is visible (e.g.,
              &ldquo;J*** D**&rdquo;). The wedding couple can see your full name
              in their private admin panel.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-2">
              What We Don&apos;t Do
            </h2>
            <ul className="text-muted-foreground leading-relaxed list-disc pl-5 space-y-1">
              <li>We don&apos;t sell, share, or rent your data to anyone.</li>
              <li>We don&apos;t send you emails or marketing messages.</li>
              <li>We don&apos;t use cookies for tracking or analytics.</li>
              <li>
                We don&apos;t process payments or collect financial information.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-2">
              Data Retention
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Your name is stored in our database as long as the registry is
              active. The wedding couple may delete this data at any time from
              their admin panel.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold mb-2">
              Contact
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about this privacy policy, please contact the
              wedding couple directly.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-border">
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms of Service →
          </Link>
        </div>
      </div>
    </div>
  );
}
