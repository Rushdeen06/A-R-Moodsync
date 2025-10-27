
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./theme.css";
import { ThemeProvider } from './utils/ThemeProvider';
import './styles/theme.css';

// Register Service Worker for PWA (adjust path for GitHub Pages base)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = (import.meta as any).env?.BASE_URL ? `${(import.meta as any).env.BASE_URL}service-worker.js` : '/service-worker.js';
    // Ensure leading slash only if not already provided by BASE_URL
    const normalized = swUrl.startsWith('/') ? swUrl : `/${swUrl}`;
    navigator.serviceWorker.register(normalized)
      .then((registration) => {
        console.log('[PWA] SW registered at', normalized, registration);
      })
      .catch((registrationError) => {
        console.warn('[PWA] SW registration failed for', normalized, registrationError);
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);  