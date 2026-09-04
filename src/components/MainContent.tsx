"use client";

export function MainContent({ children }: { children: React.ReactNode }) {
  return <div className="lg:pl-[var(--content-inset)]">{children}</div>;
}
