import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        /* solid black pill */
        default:
          "rounded-pill border-transparent bg-primary text-white text-caption px-md py-xxs font-medium",
        /* hairline border pill */
        outline:
          "rounded-pill border border-hairline bg-canvas text-ink text-caption px-md py-xxs font-medium",
        /* surface-soft pill */
        secondary:
          "rounded-pill border-transparent bg-surface-soft text-ink text-caption px-md py-xxs font-medium",
        destructive:
          "rounded-pill border-transparent bg-destructive text-destructive-foreground text-caption px-md py-xxs font-medium",
        /* figmaMono eyebrow label — uppercase, positive tracking */
        eyebrow:
          "rounded-sm border-transparent bg-transparent text-eyebrow font-mono uppercase tracking-widest text-muted",
        /* figmaMono caption chip */
        caption:
          "rounded-sm border-transparent bg-surface-soft text-caption font-mono uppercase tracking-widest text-muted px-sm py-xxs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
