"use client";

export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-clip lg:pl-[var(--content-inset)]">{children}</div>
  );
}
