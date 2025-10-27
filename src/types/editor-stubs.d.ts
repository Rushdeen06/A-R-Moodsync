// Focused editor stubs for frontend-only modules to reduce noisy diagnostics.

declare module 'sonner' {
  export const Toaster: any;
  export const toast: any;
  export type ToasterProps = Record<string, any>;
  export default Toaster;
}

declare module 'react-dom/client' {
  export function createRoot(container: Element): { render: (node: any) => void };
}

declare module 'motion/react' {
  // Minimal exports used by this project
  export const motion: any;
  export function useAnimation(): any;
  export function useMotionValue(initial: number): any;
  export function useTransform(value: any, input: number[], output: number[]): any;
}

// If other missing modules appear, we'll add precise declarations for them instead of a wide npm:* fallback.
