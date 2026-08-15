import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "tertiary" | "destructive";
type Size = "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-300",
  secondary:
    "bg-surface text-fg border border-border-strong hover:bg-surface-subtle",
  tertiary: "text-primary-600 hover:bg-primary-50",
  destructive: "bg-critical text-white hover:opacity-90",
};

const SIZE_CLASSES: Record<Size, string> = {
  md: "h-12 px-5 text-base rounded-[8px]",
  lg: "h-12 px-6 text-base rounded-[8px]",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-bold transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    />
  );
}
