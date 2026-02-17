import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
          {
            "bg-gold-500 text-luxury-black hover:bg-gold-600 active:bg-gold-700":
              variant === "primary",
            "border-2 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-luxury-black":
              variant === "outline",
            "text-gold-500 hover:bg-gold-50": variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700": variant === "danger",
          },
          {
            "px-4 py-2 text-sm rounded": size === "sm",
            "px-6 py-3 text-base rounded-md": size === "md",
            "px-8 py-4 text-lg rounded-md": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
