import Image from "next/image";

type BrandLogoProps = {
  variant?: "full" | "mark";
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  variant = "full",
  className = "",
  priority = false,
}: BrandLogoProps) {
  if (variant === "mark") {
    return (
      <Image
        src="/logos/vmpl-mark.png"
        alt="Vaishali Media Productions"
        width={48}
        height={48}
        className={`h-10 w-10 object-contain ${className}`}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src="/logos/vmpl-logo.png"
      alt="Vaishali Media Productions LLC"
      width={160}
      height={110}
      className={`h-auto w-[140px] object-contain ${className}`}
      priority={priority}
    />
  );
}
