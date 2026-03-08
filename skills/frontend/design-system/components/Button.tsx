"use client";
import type { ButtonHTMLAttributes } from "react";
import cn from "@/lib/utils";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "outline" | "gradient";
};

export function Button({ variant = "default", className, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all";
  const variants: Record<string, string> = {
    default: "bg-primary text-white hover:opacity-90",
    ghost: "bg-transparent text-primary hover:bg-gray-100",
    outline: "border border-gray-200",
    gradient: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
  };
  return (
    <button className={cn(base, variants[variant], className)} {...props} />
  );
}

export default Button;
