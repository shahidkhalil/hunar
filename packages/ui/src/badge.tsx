import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#6B4F3B] text-white",
        secondary: "bg-[#FAF5EF] text-[#2B2B2B]",
        new: "bg-[#C5A880] text-[#2B2B2B]",
        bestseller: "bg-[#2B2B2B] text-white",
        limited: "bg-red-600 text-white",
        outline: "border border-[#6B4F3B] text-[#6B4F3B]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

