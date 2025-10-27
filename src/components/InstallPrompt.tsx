import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running as standalone (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    // Check if already dismissed
    const dismissed = localStorage.getItem('install-prompt-dismissed');
    if (dismissed) return;

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for install prompt (Android/Desktop)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after 10 seconds
      setTimeout(() => setShowPrompt(true), 10000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // For iOS, show after 10 seconds
    if (iOS) {
      setTimeout(() => setShowPrompt(true), 10000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('install-prompt-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
      >
        <div
          className="rounded-3xl p-4 shadow-2xl"
          style={{ backgroundColor: '#2D7A8B' }}
        >
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#4FB3C5' }}
            >
              <Smartphone className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">
                Install MoodSync App
              </h3>
              <p className="text-sm mb-3" style={{ color: '#E8F6F8' }}>
                {isIOS
                  ? 'Add to your home screen for the best experience!'
                  : 'Install our app for offline access and quick mood tracking!'}
              </p>

              {isIOS ? (
                <div className="text-xs" style={{ color: '#E8F6F8' }}>
                  <p className="mb-1">1. Tap the Share button ⬆️</p>
                  <p>2. Select "Add to Home Screen"</p>
                </div>
              ) : (
                <button
                  onClick={handleInstall}
                  className="w-full py-2 px-4 rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#7DD4A8', color: '#2D7A8B' }}
                >
                  <Download className="w-4 h-4" />
                  Install Now
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
