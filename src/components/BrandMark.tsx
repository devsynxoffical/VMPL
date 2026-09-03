import Image from "next/image";

type BrandMarkProps = {
  src: string;
  alt: string;
  className?: string;
  size?: "sm" | "md";
};

const sizes = {
  sm: {
    frame: "h-10 w-10",
    inner: "h-[22px] w-[22px]",
    img: "22px",
  },
  md: {
    frame: "h-12 w-12",
    inner: "h-[26px] w-[26px]",
    img: "26px",
  },
} as const;

export function BrandMark({
  src,
  alt,
  className = "",
  size = "md",
}: BrandMarkProps) {
  const s = sizes[size];

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#f3eef5] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_8px_rgba(123,34,141,0.08)] ring-1 ring-foreground/[0.08] ${s.frame} ${className}`}
    >
      <div className={`relative ${s.inner}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain object-center"
          sizes={s.img}
        />
      </div>
    </div>
  );
}
