"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface ThemeSwitcherButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function ThemeSwitcherButton({
  className,
  ...props
}: ThemeSwitcherButtonProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled className={className}>
        <div className="w-4 h-4 bg-input animate-pulse" />
      </Button>
    );
  }

  const toggleTheme = async () => {
    const isCurrentlyDark = resolvedTheme === "dark";
    const newTheme = isCurrentlyDark ? "light" : "dark";

    // Check if View Transitions API is supported
    if (
      !buttonRef.current ||
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(newTheme);
      return;
    }

    // Get button position for the circular animation origin
    const rect = buttonRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Calculate the radius needed to cover the entire screen
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Start the view transition
    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    await transition.ready;

    // Always animate the NEW view expanding from the button
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      ref={buttonRef}
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <SunIcon
        className={cn(
          "absolute w-4 h-4 transition-all duration-300",
          isDark ? "scale-0 opacity-0 rotate-90" : "scale-100 opacity-100 rotate-0"
        )}
      />
      <MoonIcon
        className={cn(
          "absolute w-4 h-4 transition-all duration-300",
          isDark ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 -rotate-90"
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
