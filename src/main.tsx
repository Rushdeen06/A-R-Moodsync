
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ErrorBoundary } from './components/ErrorBoundary';
import "./index.css";
import "./theme.css";
import './styles/theme.css';

// Log environment info for debugging deployed static GitHub Pages vs local
const baseUrl = (import.meta as any).env?.BASE_URL || '/';
const isGithubPages = typeof window !== 'undefined' && /github\.io$/.test(window.location.hostname);
console.log('[Env] BASE_URL:', baseUrl, 'hostname:', typeof window !== 'undefined' ? window.location.hostname : 'n/a', 'githubPages?', isGithubPages);

// Service worker temporarily disabled to resolve asset 404 / blank screen.
// Re-enable after successful deployment.

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);  