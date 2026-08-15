"use client";

interface HeaderProps {
  coupleNames: string;
  weddingDate: string;
  welcomeMessage?: string;
}

export function Header({
  coupleNames,
  weddingDate,
  welcomeMessage,
}: HeaderProps) {
  return (
    <header className="text-center pt-16 pb-10 px-4 md:pt-24">
      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4 font-mono">
        Wedding Gift Registry
      </p>
      <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.1]">
        {coupleNames}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">{weddingDate}</p>
      {welcomeMessage && (
        <p className="mt-4 text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
          {welcomeMessage}
        </p>
      )}
    </header>
  );
}
