"use client";

import Image from "next/image";
import { useState } from "react";
import Settings from "./Settings";

export default function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="h-16 sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-250">
      <div className="max-w-5xl mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <div className="bg-[#3c82f6] rounded-full p-2.5">
              <Image
                src="/assets/icons/logo.svg"
                alt="logo"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white transition-colors duration-250">
                AI Chat Assistant
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-250">
                Speech recognition enabled
              </p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-250"
            >
              <Image
                src="/assets/icons/settings.svg"
                alt="settings"
                width={20}
                height={20}
                className={`transition-all duration-300 dark:invert ${
                  isSettingsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <Settings
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
