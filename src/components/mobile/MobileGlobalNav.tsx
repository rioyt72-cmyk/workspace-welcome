import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileBottomNav } from "@/components/mobile/MobileBottomNav";

/**
 * Renders the 5-icon mobile bottom nav across pages.
 * (Hidden on desktop and admin routes.)
 */
export const MobileGlobalNav = () => {
  const isMobile = useIsMobile();
  const location = useLocation();

  const shouldShow = useMemo(() => {
    if (!isMobile) return false;
    if (location.pathname.startsWith("/admin")) return false;
    return true;
  }, [isMobile, location.pathname]);

  if (!shouldShow) return null;

  return <MobileBottomNav />;
};
