import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "gradient" | "ghost"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none ring-offset-slate-950",
          variant === "default" && "bg-slate-50 text-slate-900 hover:bg-slate-50/90",
          variant === "outline" && "border border-slate-800 hover:bg-slate-800 hover:text-slate-50",
          variant === "gradient" && "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 shadow-lg shadow-cyan-500/20",
          variant === "ghost" && "hover:bg-slate-800 hover:text-slate-50",
          "h-10 py-2 px-4",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
