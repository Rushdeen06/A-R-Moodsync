import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { ArrowLeft, Users, Coffee, MessageCircle, Check } from 'lucide-react';
import { Badge } from '../ui/badge';

interface MobileBreakBuddyProps {
  userName: string;
  onBack: () => void;
  onRequestSent: (coworker: string, activity: string) => void;
}

const COWORKERS = [
  { name: 'Sarah Johnson', status: 'Available', avatar: '👩', availability: 'online' },
  { name: 'Mike Chen', status: 'In a Meeting', avatar: '👨', availability: 'busy' },
  { name: 'Emily Davis', status: 'Available', avatar: '👩‍💼', availability: 'online' },
  { name: 'James Wilson', status: 'Away', avatar: '🧑', availability: 'away' },
  { name: 'Lisa Anderson', status: 'Available', avatar: '👩‍🦰', availability: 'online' },
];

const ACTIVITIES = [
  { icon: Coffee, label: 'Coffee Break', value: 'coffee' },
  { icon: MessageCircle, label: 'Quick Chat', value: 'chat' },
  { icon: Users, label: 'Group Break', value: 'group' },
];

export function MobileBreakBuddy({ userName, onBack, onRequestSent }: MobileBreakBuddyProps) {
  const [selectedCoworker, setSelectedCoworker] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [requestSent, setRequestSent] = useState(false);

  const handleSendRequest = () => {
    if (selectedCoworker && selectedActivity) {
      const coworker = COWORKERS.find(c => c.name === selectedCoworker);
      const activity = ACTIVITIES.find(a => a.value === selectedActivity);
      
      if (coworker && activity) {
        onRequestSent(coworker.name, activity.label);
        setRequestSent(true);
        setTimeout(() => {
          setRequestSent(false);
          setSelectedCoworker('');
          setSelectedActivity('');
        }, 2000);
      }
    }
  };

  const getStatusColor = (availability: string) => {
    switch (availability) {
      case 'online': return '#7DD4A8';
      case 'busy': return '#FFB84D';
      case 'away': return '#D4D4D4';
      default: return '#D4D4D4';
    }
  };

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
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-2xl text-center mb-2" style={{ color: '#2D7A8B' }}>
            Find a Break Buddy
          </h2>
          <p className="text-sm text-center mb-6" style={{ color: '#4FB3C5' }}>
            Connect with a coworker for a stress-relieving break
          </p>

          {/* Success Message */}
          {requestSent && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-4 mb-4 flex items-center gap-3"
              style={{ backgroundColor: '#D4F1E8' }}
            >
              <Check className="w-5 h-5" style={{ color: '#7DD4A8' }} />
              <p className="text-sm" style={{ color: '#2D7A8B' }}>
                Request sent successfully!
              </p>
            </motion.div>
          )}

          {/* Activity Selection */}
          <div className="mb-6">
            <h3 className="text-sm mb-3" style={{ color: '#2D7A8B' }}>
              What would you like to do?
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {ACTIVITIES.map((activity) => {
                const Icon = activity.icon;
                const isSelected = selectedActivity === activity.value;
                return (
                  <button
                    key={activity.value}
                    onClick={() => setSelectedActivity(activity.value)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all"
                    style={{
                      backgroundColor: isSelected ? '#4FB3C5' : '#F5F8FA',
                      color: isSelected ? 'white' : '#2D7A8B',
                    }}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs text-center">{activity.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coworkers List */}
          <div className="mb-6">
            <h3 className="text-sm mb-3" style={{ color: '#2D7A8B' }}>
              Available Coworkers
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {COWORKERS.map((coworker) => (
                <button
                  key={coworker.name}
                  onClick={() => setSelectedCoworker(coworker.name)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                  style={{
                    backgroundColor: selectedCoworker === coworker.name ? '#E8DFF5' : '#F5F8FA',
                    border: selectedCoworker === coworker.name ? '2px solid #9B7FD8' : '2px solid transparent',
                  }}
                >
                  <div className="relative">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: '#D4E9F1' }}
                    >
                      {coworker.avatar}
                    </div>
                    <div
                      className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                      style={{ backgroundColor: getStatusColor(coworker.availability) }}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm" style={{ color: '#2D7A8B' }}>
                      {coworker.name}
                    </p>
                    <p className="text-xs" style={{ color: '#4FB3C5' }}>
                      {coworker.status}
                    </p>
                  </div>
                  {coworker.availability === 'online' && (
                    <Badge 
                      className="text-xs"
                      style={{ 
                        backgroundColor: '#D4F1E8',
                        color: '#2D7A8B'
                      }}
                    >
                      Available
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Send Request Button */}
          <Button
            onClick={handleSendRequest}
            disabled={!selectedCoworker || !selectedActivity || requestSent}
            className="w-full h-12 rounded-xl text-white"
            style={{ 
              backgroundColor: !selectedCoworker || !selectedActivity ? '#D4D4D4' : '#4FB3C5',
              opacity: !selectedCoworker || !selectedActivity ? 0.5 : 1
            }}
          >
            {requestSent ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Request Sent!
              </>
            ) : (
              'Send Request'
            )}
          </Button>

          {/* Helper Text */}
          {(!selectedCoworker || !selectedActivity) && (
            <p className="text-xs text-center mt-3" style={{ color: '#4FB3C5' }}>
              Select an activity and a coworker to continue
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
