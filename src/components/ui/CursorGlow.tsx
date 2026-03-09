"use client";

import { useEffect, useState } from "react";

export function CursorGlow() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-duration-300"
      style={{
        background: `radial-gradient(circle 600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 211, 238, 0.07), transparent 80%)`,
      }}
    />
  );
}
