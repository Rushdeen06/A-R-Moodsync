
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ErrorBoundary } from './components/ErrorBoundary';
import "./index.css";
import "./theme.css";
import { ThemeProvider } from './utils/ThemeProvider';
import './styles/theme.css';

// Log environment info for debugging deployed static GitHub Pages vs local
const baseUrl = (import.meta as any).env?.BASE_URL || '/';
const isGithubPages = typeof window !== 'undefined' && /github\.io$/.test(window.location.hostname);
console.log('[Env] BASE_URL:', baseUrl, 'hostname:', typeof window !== 'undefined' ? window.location.hostname : 'n/a', 'githubPages?', isGithubPages);

// Register Service Worker with resilient fallback attempts
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const candidates = [
      // Prefer base-prefixed asset (GitHub Pages)
      (baseUrl.endsWith('/') ? baseUrl : baseUrl + '/') + 'service-worker.js',
      // Relative path (works when index.html in subfolder)
      './service-worker.js',
      // Root fallback
      '/service-worker.js'
    ];
    (async () => {
      for (const url of candidates) {
        try {
          await navigator.serviceWorker.register(url);
          console.log('[PWA] Service worker registered via', url);
          return;
        } catch (err) {
          console.warn('[PWA] SW registration attempt failed for', url, err);
        }
      }
      console.error('[PWA] All service worker registration attempts failed.');
    })();
  });
}

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </ThemeProvider>
);  