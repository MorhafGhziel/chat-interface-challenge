import { COMMON_CLASSES } from "@/constants";

interface MenuSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function MenuSection({
  title,
  children,
  className = "",
}: MenuSectionProps) {
  return (
    <div className={`px-3 py-2 ${className}`}>
      <h4 className={`${COMMON_CLASSES.sectionTitle} uppercase`}>{title}</h4>
      <div className={COMMON_CLASSES.menuText}>{children}</div>
    </div>
  );
}
