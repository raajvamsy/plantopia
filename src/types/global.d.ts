// Global type definitions for Plantopia PWA

declare module '*.svg' {
  import { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

// Extend CSS properties for custom CSS variables
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

// Global window extensions
declare global {
  interface Window {
    // Global window extensions for Plantopia PWA
    gtag?: (...args: unknown[]) => void;
  }
}

// Re-export API types for global access
export * from './api';

export {};
