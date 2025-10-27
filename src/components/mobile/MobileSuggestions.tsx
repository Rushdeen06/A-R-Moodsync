import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

interface MobileSuggestionsProps {
  suggestion: string;
  onAccept: () => void;
  onSkip: () => void;
  onSuggestAnother: () => void;
  onBack: () => void;
}

export function MobileSuggestions({ 
  suggestion, 
  onAccept, 
  onSkip, 
  onSuggestAnother,
  onBack 
}: MobileSuggestionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen p-6"
      style={{ backgroundColor: '#E8F6F8' }}
    >
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <button onClick={onBack} className="mb-6 p-2">
          <ArrowLeft className="w-6 h-6" style={{ color: '#2D7A8B' }} />
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl text-center mb-12" style={{ color: '#2D7A8B' }}>
            Suggestions
          </h2>

          {/* Suggestion Box */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 mb-8">
            <p className="text-xl text-center mb-8" style={{ color: '#2D7A8B' }}>
              {suggestion}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={onAccept}
                className="px-8 py-3 rounded-xl text-base"
                style={{ 
                  backgroundColor: '#E8DFF5',
                  color: '#2D7A8B'
                }}
              >
                Accept
              </Button>
              <Button
                onClick={onSkip}
                variant="outline"
                className="px-8 py-3 rounded-xl text-base border-2"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: '#E8DFF5',
                  color: '#2D7A8B'
                }}
              >
                Skip
              </Button>
            </div>
          </div>

          {/* Suggest Another */}
          <button
            onClick={onSuggestAnother}
            className="w-full text-center py-3 text-base underline"
            style={{ color: '#2D7A8B' }}
          >
            Suggest another
          </button>
        </div>
      </div>
    </motion.div>
  );
}
