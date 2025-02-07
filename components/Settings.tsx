"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";

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
    const isDark = document.documentElement.classList.contains("dark");
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
    }, 400);
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
      } origin-top transition-colors-all duration-250`}
    >
      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 transition-colors-all duration-250">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white transition-colors duration-250">
          Settings
        </h3>
      </div>

      <div className="py-1">
        {/* Language Section */}
        <div className="px-3 py-2">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-250">
            LANGUAGE
          </h4>
          <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-250">
            <Image
              src="/assets/icons/language.svg"
              alt="language"
              width={20}
              height={20}
              className="opacity-70 dark:invert transition-[filter] duration-250"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200 transition-colors duration-250">
              Change Language
            </span>
          </button>
        </div>

        {/* Accessibility Section */}
        <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-700 transition-colors duration-250">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-250">
            ACCESSIBILITY
          </h4>
          <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-250">
            <Image
              src="/assets/icons/accessibility.svg"
              alt="accessibility"
              width={20}
              height={20}
              className="opacity-70 dark:invert transition-[filter] duration-250"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200 transition-colors duration-250">
              Accessibility Settings
            </span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-250">
            <Image
              src="/assets/icons/keyboard.svg"
              alt="keyboard"
              width={20}
              height={20}
              className="opacity-70 dark:invert transition-[filter] duration-250"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200 transition-colors duration-250">
              Keyboard Shortcuts
            </span>
          </button>
        </div>

        {/* About Section */}
        <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-700 transition-colors duration-250">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-250">
            ABOUT
          </h4>
          <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-250">
            <Image
              src="/assets/icons/info.svg"
              alt="info"
              width={20}
              height={20}
              className="opacity-70 dark:invert transition-[filter] duration-250"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200 transition-colors duration-250">
              About AI Chat Assistant
            </span>
          </button>
        </div>

        {/* Appearance Section */}
        <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-700 transition-colors duration-250">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-250">
            APPEARANCE
          </h4>
          <div
            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors duration-250"
            onClick={toggleTheme}
          >
            <div className="flex items-center gap-3">
              <Image
                src={
                  isDarkMode
                    ? "/assets/icons/theme-dark.svg"
                    : "/assets/icons/theme-light.svg"
                }
                alt="theme"
                width={20}
                height={20}
                className="opacity-70 dark:invert transition-[filter] duration-250"
              />
              <span className="text-sm text-gray-700 dark:text-gray-200 transition-colors duration-250">
                {isDarkMode ? "Dark Mode" : "Light Mode"}
              </span>
            </div>
            <div
              className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${
                isDarkMode ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-300 ease-in-out ${
                  isDarkMode ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
