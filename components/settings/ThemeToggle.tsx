import Image from "next/image";
import { COMMON_CLASSES, THEME_CONFIG } from "@/constants";

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDarkMode, onToggle }: ThemeToggleProps) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer ${COMMON_CLASSES.transitionBase}`}
      onClick={onToggle}
    >
      <div className="flex items-center gap-3">
        <Image
          src={isDarkMode ? THEME_CONFIG.dark.icon : THEME_CONFIG.light.icon}
          alt="theme"
          width={20}
          height={20}
          className={COMMON_CLASSES.iconBase}
        />
        <span className={COMMON_CLASSES.menuText}>
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
  );
}
