import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* black pill — primary CTA */
        default:
          "rounded-pill bg-primary text-white text-button font-medium px-lg py-xs hover:bg-primary-active",
        /* white pill — secondary / contact-sales */
        secondary:
          "rounded-pill bg-canvas text-ink text-button font-medium px-lg py-xs hover:bg-surface-soft",
        /* text link button — nav + footer */
        ghost:
          "rounded-full text-ink text-link font-medium px-sm py-xs hover:bg-surface-soft",
        /* circular icon button — light surface */
        icon:
          "rounded-full bg-surface-soft text-ink h-10 w-10",
        /* circular icon button — dark/inverse surface */
        "icon-inverse":
          "rounded-full bg-on-inverse-soft text-white h-10 w-10",
        /* promo pill — inside lilac/colored banners only */
        magenta:
          "rounded-pill bg-accent-magenta text-white text-button font-medium px-lg py-xs hover:opacity-90",
        /* destructive */
        destructive:
          "rounded-pill bg-destructive text-destructive-foreground text-button font-medium px-lg py-xs hover:bg-destructive/90",
        /* keep outline for edge cases */
        outline:
          "rounded-pill border border-hairline bg-canvas text-ink text-button font-medium px-lg py-xs hover:bg-surface-soft",
        link: "text-ink underline-offset-4 hover:underline text-link",
      },
      size: {
        default: "",
        sm: "text-body-sm px-md py-xxs",
        lg: "text-body-lg px-xl py-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
