import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../utils/ThemeProvider';
import { MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '../ui/sonner';

interface AnonymousFeedbackProps {
  teamId: string;
  onSubmit: (category: string, message: string, sentiment: string) => Promise<void>;
}

const CATEGORIES = [
  { value: 'workload', label: 'Workload & Stress', icon: '⚡' },
  { value: 'culture', label: 'Team Culture', icon: '🤝' },
  { value: 'management', label: 'Management & Leadership', icon: '👔' },
  { value: 'growth', label: 'Career Growth', icon: '📈' },
  { value: 'other', label: 'Other Concerns', icon: '💭' },
];

export function AnonymousFeedback({ teamId, onSubmit }: AnonymousFeedbackProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [sentiment, setSentiment] = useState<'positive'|'neutral'|'negative'>('neutral');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!category || !message.trim()) {
      toast.error('Please select a category and enter your feedback');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(category, message.trim(), sentiment);
      setSubmitted(true);
      toast.success('Feedback submitted anonymously ✅');
      setTimeout(() => {
        setCategory('');
        setMessage('');
        setSentiment('neutral');
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Feedback submission failed:', error);
      toast.error('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const sectionStyle: React.CSSProperties = {
    background: isDark ? 'rgba(45,55,72,0.85)' : 'rgba(255,255,255,0.85)',
    boxShadow: isDark ? '0 4px 24px 0 #2d7a8b22' : '0 4px 24px 0 #4fb3c522',
    backdropFilter: 'blur(10px)',
    border: isDark ? '1.5px solid #2d7a8b33' : '1.5px solid #4fb3c533',
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl p-8 text-center"
        style={sectionStyle}
      >
        <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{color:'#7DD4A8'}}/>
        <h3 className="text-xl font-bold mb-2" style={{color:isDark?'#fff':'#2D7A8B'}}>
          Thank You!
        </h3>
        <p className="text-sm" style={{color:isDark?'#ccc':'#557'}}>
          Your anonymous feedback has been submitted. Your voice helps create a better workplace.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Privacy Notice */}
      <motion.div layout className="rounded-2xl p-4 flex items-start gap-3" style={{
        background:isDark?'#2d3748':'#E8F6F8',
        border:`1px solid ${isDark?'#4FB3C533':'#4FB3C522'}`
      }}>
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color:'#4FB3C5'}}/>
        <div>
          <p className="text-xs font-semibold mb-1" style={{color:isDark?'#fff':'#2D7A8B'}}>
            100% Anonymous & Confidential
          </p>
          <p className="text-xs" style={{color:isDark?'#bbb':'#557'}}>
            Your feedback is completely anonymous. No identifying information (name, email, IP) is collected or stored.
          </p>
        </div>
      </motion.div>

      {/* Category Selection */}
      <motion.div layout className="rounded-3xl p-5" style={sectionStyle}>
        <label className="block mb-3">
          <span className="text-sm font-semibold" style={{color:isDark?'#fff':'#2D7A8B'}}>
            What would you like to share about?
          </span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className="p-3 rounded-xl text-left transition-all"
              style={{
                background: category === cat.value 
                  ? isDark ? '#4FB3C533' : '#4FB3C522'
                  : isDark ? '#232946' : '#F5F8FA',
                border: category === cat.value 
                  ? '2px solid #4FB3C5'
                  : `1px solid ${isDark ? '#2d7a8b33' : '#4fb3c533'}`
              }}
              aria-label={`Select ${cat.label}`}
              aria-pressed={category === cat.value}
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <p className="text-xs font-semibold" style={{color:isDark?'#fff':'#2D7A8B'}}>
                {cat.label}
              </p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Sentiment */}
      <motion.div layout className="rounded-3xl p-5" style={sectionStyle}>
        <label className="block mb-3">
          <span className="text-sm font-semibold" style={{color:isDark?'#fff':'#2D7A8B'}}>
            Overall sentiment
          </span>
        </label>
        <div className="flex gap-3">
          {[
            {val:'positive', emoji:'😊', label:'Positive', color:'#7DD4A8'},
            {val:'neutral', emoji:'😐', label:'Neutral', color:'#FFB84D'},
            {val:'negative', emoji:'😔', label:'Concern', color:'#FF6B6B'}
          ].map(s => (
            <button
              key={s.val}
              onClick={() => setSentiment(s.val as any)}
              className="flex-1 py-3 rounded-xl transition-all"
              style={{
                background: sentiment === s.val ? `${s.color}22` : isDark?'#232946':'#F5F8FA',
                border: sentiment === s.val ? `2px solid ${s.color}` : `1px solid ${isDark?'#2d7a8b33':'#4fb3c533'}`
              }}
              aria-label={`Set sentiment to ${s.label}`}
              aria-pressed={sentiment === s.val}
            >
              <div className="text-2xl mb-1">{s.emoji}</div>
              <p className="text-xs font-semibold" style={{color:isDark?'#fff':'#2D7A8B'}}>
                {s.label}
              </p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Message */}
      <motion.div layout className="rounded-3xl p-5" style={sectionStyle}>
        <label className="block mb-3">
          <span className="text-sm font-semibold" style={{color:isDark?'#fff':'#2D7A8B'}}>
            Your feedback
          </span>
        </label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Share your thoughts, concerns, or suggestions..."
          className="w-full min-h-[120px] p-3 rounded-xl border-none resize-none text-sm"
          style={{
            background:isDark?'#232946':'#F5F8FA',
            color:isDark?'#fff':'#2D7A8B'
          }}
          aria-label="Enter your anonymous feedback"
          maxLength={1000}
        />
        <p className="text-xs mt-2 text-right" style={{color:isDark?'#889':'#557'}}>
          {message.length}/1000 characters
        </p>
      </motion.div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!category || !message.trim() || submitting}
        className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
        style={{
          background: category && message.trim() ? '#4FB3C5' : isDark?'#2d3748':'#E8F6F8',
          color: category && message.trim() ? '#fff' : isDark?'#889':'#557',
          cursor: category && message.trim() ? 'pointer' : 'not-allowed',
          opacity: submitting ? 0.6 : 1
        }}
        aria-label="Submit anonymous feedback"
      >
        {submitting ? 'Submitting...' : (
          <>
            <Send className="w-5 h-5"/>
            Submit Anonymously
          </>
        )}
      </button>
    </div>
  );
}
