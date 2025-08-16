/**
 * Layout constants for consistent spacing and sizing across the app
 */

export const LAYOUT_CONSTANTS = {
  // Header heights
  HEADER_HEIGHT_MOBILE: 56, // 14 * 4 = 56px (h-14)
  HEADER_HEIGHT_DESKTOP: 64, // 16 * 4 = 64px (h-16)
  
  // Bottom navigation heights  
  BOTTOM_NAV_HEIGHT_MOBILE: 64, // 16 * 4 = 64px (h-16)
  BOTTOM_NAV_HEIGHT_DESKTOP: 80, // 20 * 4 = 80px (h-20)
  
  // Safe area padding
  SAFE_AREA_TOP: 'env(safe-area-inset-top)',
  SAFE_AREA_BOTTOM: 'env(safe-area-inset-bottom)',
  
  // Z-index values
  Z_INDEX: {
    HEADER: 10,
    BOTTOM_NAV: 50,
    MODAL: 100,
    TOOLTIP: 200,
  }
} as const;

export type LayoutConstants = typeof LAYOUT_CONSTANTS;
