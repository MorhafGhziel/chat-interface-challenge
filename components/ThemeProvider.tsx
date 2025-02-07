"use client";

import { useEffect } from "react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");

    // Default to light mode if no theme is stored
    if (!storedTheme) {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
      return;
    }

    // Apply stored theme
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Listen for system theme changes only if no preference is set
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-gray-900 transition-colors duration-250">
      {children}
    </div>
  );
}
