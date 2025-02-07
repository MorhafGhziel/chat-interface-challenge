import Image from "next/image";

export default function Header() {
  return (
    <header className="h-16 sticky top-0 z-50 bg-white flex flex-col sm:flex-row items-center gap-4 sm:justify-between p-4 border-b shadow-sm">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full">
        <div className="flex items-center gap-4">
          <div className="bg-[#3c82f6] rounded-full p-2 flex items-center justify-center">
            <Image
              src="/assets/icons/logo.svg"
              alt="logo"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div className="sm:hidden">
            <Image
              src="/assets/icons/settings.svg"
              alt="settings"
              width={24}
              height={24}
            />
          </div>
        </div>
        <div className="text-center sm:text-left">
          <h1 className="font-semibold">AI Chat Assistant</h1>
          <p className="text-sm text-muted-foreground text-gray-500">
            Speech recognition enabled
          </p>
        </div>
      </div>
      <div className="hidden sm:block">
        <Image
          src="/assets/icons/settings.svg"
          alt="settings"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      </div>
    </header>
  );
}
