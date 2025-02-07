"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { COMMON_CLASSES, MENU_SECTIONS, ANIMATION_DURATION } from "@/constants";
import { MenuSection } from "./settings/MenuSection";
import { MenuItem } from "./settings/MenuItem";
import { ThemeToggle } from "./settings/ThemeToggle";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Check initial theme on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    // Default to light mode if no theme is stored
    if (!storedTheme) {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
    const isDark = storedTheme === "dark";
    setIsDarkMode(isDark);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    const timer = setTimeout(() => {
      onClose();
    }, ANIMATION_DURATION.menuClose);
    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClose]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div
      ref={menuRef}
      className={`absolute top-[60px] sm:top-[52px] right-0 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 ${
        isClosing ? "animate-slide-up" : "animate-slide-down"
      } origin-top ${COMMON_CLASSES.transitionBase}`}
    >
      <div
        className={`px-4 py-2 border-b ${COMMON_CLASSES.sectionDivider} ${COMMON_CLASSES.transitionBase}`}
      >
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
          Settings
        </h3>
      </div>

      <div className="py-1">
        <MenuSection title={MENU_SECTIONS.LANGUAGE.title}>
          {MENU_SECTIONS.LANGUAGE.items.map((item) => (
            <MenuItem key={item.label} icon={item.icon} label={item.label} />
          ))}
        </MenuSection>

        <MenuSection
          title={MENU_SECTIONS.ACCESSIBILITY.title}
          className={COMMON_CLASSES.sectionDivider}
        >
          {MENU_SECTIONS.ACCESSIBILITY.items.map((item) => (
            <MenuItem key={item.label} icon={item.icon} label={item.label} />
          ))}
        </MenuSection>

        <MenuSection
          title={MENU_SECTIONS.ABOUT.title}
          className={COMMON_CLASSES.sectionDivider}
        >
          {MENU_SECTIONS.ABOUT.items.map((item) => (
            <MenuItem key={item.label} icon={item.icon} label={item.label} />
          ))}
        </MenuSection>

        <MenuSection
          title={MENU_SECTIONS.APPEARANCE.title}
          className={COMMON_CLASSES.sectionDivider}
        >
          <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
        </MenuSection>
      </div>
    </div>
  );
}
