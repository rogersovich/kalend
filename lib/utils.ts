import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const customFontSizes = [
  "display-xl", "display-lg", "display-md", "display-sm",
  "headline", "subhead", "card-title",
  "body-lg", "body", "body-sm",
  "link", "button",
  "eyebrow", "caption",
  "title-lg", "title-md", "title-sm", "nav-link",
]

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": customFontSizes.map((s) => `text-${s}`),
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
