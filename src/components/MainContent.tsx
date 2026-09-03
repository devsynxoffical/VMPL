"use client";

export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:pl-[calc(var(--sidebar-width)+1.25rem)]">
      {children}
    </div>
  );
}
