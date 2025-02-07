import Image from "next/image";

export default function Header() {
  return (
    <header className="h-16 sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <div className="bg-[#3c82f6] rounded-full p-2">
              <Image
                src="/assets/icons/logo.svg"
                alt="logo"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="font-semibold text-sm sm:text-base">
                AI Chat Assistant
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Speech recognition enabled
              </p>
            </div>
          </div>
          <Image
            src="/assets/icons/settings.svg"
            alt="settings"
            width={20}
            height={20}
            className="cursor-pointer"
          />
        </div>
      </div>
    </header>
  );
}
