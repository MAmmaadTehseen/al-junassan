import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  title,
  subtitle,
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-10", align === "center" && "text-center", className)}>
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-luxury-black">
        {title}
      </h2>
      <div
        className={cn("mt-3 h-0.5 w-16 bg-gold-500", align === "center" && "mx-auto")}
      />
      {subtitle && (
        <p className="mt-4 text-luxury-gray max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
