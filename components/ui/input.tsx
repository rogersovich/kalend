import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          /* Figma text-input: canvas bg, hairline border, md radius, 12px/14px padding, focus ring only */
          "flex h-12 w-full rounded-md border border-hairline bg-canvas px-[14px] py-[12px]",
          "text-body text-ink placeholder:text-muted",
          "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
