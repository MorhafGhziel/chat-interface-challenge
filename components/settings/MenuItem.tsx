import Image from "next/image";
import { COMMON_CLASSES } from "@/constants";

interface MenuItemProps {
  icon: string;
  label: string;
  onClick?: () => void;
}

export function MenuItem({ icon, label, onClick }: MenuItemProps) {
  return (
    <button className={COMMON_CLASSES.menuItem} onClick={onClick}>
      <Image
        src={icon}
        alt={label.toLowerCase()}
        width={20}
        height={20}
        className={COMMON_CLASSES.iconBase}
      />
      <span className={COMMON_CLASSES.menuText}>{label}</span>
    </button>
  );
}
