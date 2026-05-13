import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-neon-cyan/20 text-neon-cyan",
        secondary:
          "border-transparent bg-white/10 text-white/70",
        destructive:
          "border-transparent bg-red-500/20 text-red-400 border-red-500/30",
        outline:
          "border-white/20 text-white/70",
        critical:
          "border-red-500/30 bg-red-500/20 text-red-400",
        high:
          "border-orange-500/30 bg-orange-500/20 text-orange-400",
        medium:
          "border-yellow-500/30 bg-yellow-500/20 text-yellow-400",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
