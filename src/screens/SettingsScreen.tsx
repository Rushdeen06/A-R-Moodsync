import { useState } from 'react';
import { CalendarSync } from '../components/integrations/CalendarSync';
import { CustomCategories } from '../components/personalization/CustomCategories';
import { MoodTriggers } from '../components/personalization/MoodTriggers';
import { PersonalizedAffirmations } from '../components/personalization/PersonalizedAffirmations';
import type { CustomMoodCategory, MoodTrigger } from '../types/workspace';

interface SettingsScreenProps {
  entries: Array<{
    id: string;
    mood: string;
    note: string;
    timestamp: Date;
    intensity: number;
  }>;
  userName: string;
  currentStreak: number;
  currentMood: string;
}

export function SettingsScreen({ entries, userName, currentStreak, currentMood }: SettingsScreenProps) {
  const [activeTab, setActiveTab] = useState<'calendar' | 'categories' | 'triggers' | 'affirmations'>('affirmations');
  
  // State for custom categories
  const [categories, setCategories] = useState<CustomMoodCategory[]>(() => {
    const saved = localStorage.getItem('moodsync_custom_categories');
    return saved ? JSON.parse(saved) : [];
  });

  // State for triggers
  const [triggers, setTriggers] = useState<MoodTrigger[]>(() => {
    const saved = localStorage.getItem('moodsync_triggers');
    return saved ? JSON.parse(saved).map((t: any) => ({
      ...t,
      lastOccurred: t.lastOccurred ? new Date(t.lastOccurred) : new Date(),
      createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
    })) : [];
  });

  const handleAddCategory = (category: Omit<CustomMoodCategory, 'id' | 'createdAt' | 'userId'>) => {
    const newCategory: CustomMoodCategory = {
      ...category,
      id: Date.now().toString(),
      userId: userName,
      createdAt: new Date(),
      // If keywords omitted default to empty array
      ...(category as any).keywords ? { keywords: (category as any).keywords } : { keywords: [] },
    } as CustomMoodCategory;
    const updated = [...categories, newCategory];
    setCategories(updated);
    localStorage.setItem('moodsync_custom_categories', JSON.stringify(updated));
  };

  const handleUpdateCategory = (id: string, updates: Partial<CustomMoodCategory>) => {
    const updated = categories.map(c => c.id === id ? { ...c, ...updates } : c);
    setCategories(updated);
    localStorage.setItem('moodsync_custom_categories', JSON.stringify(updated));
  };

  const handleDeleteCategory = (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    localStorage.setItem('moodsync_custom_categories', JSON.stringify(updated));
  };

  const handleAddTrigger = (trigger: Omit<MoodTrigger, 'id' | 'createdAt' | 'occurrences' | 'lastOccurred'>) => {
    const newTrigger: MoodTrigger = {
      ...trigger,
      id: Date.now().toString(),
      createdAt: new Date(),
      occurrences: 1,
      lastOccurred: new Date(),
      userId: userName,
      // Fallbacks if personalization fields provided differently
      trigger: (trigger as any).trigger || (trigger as any).name || 'trigger',
      mood: (trigger as any).mood || currentMood,
      frequency: (trigger as any).frequency || 1,
    } as MoodTrigger;
    const updated = [...triggers, newTrigger];
    setTriggers(updated);
    localStorage.setItem('moodsync_triggers', JSON.stringify(updated));
  };

  const handleDeleteTrigger = (id: string) => {
    const updated = triggers.filter(t => t.id !== id);
    setTriggers(updated);
    localStorage.setItem('moodsync_triggers', JSON.stringify(updated));
  };

  const tabs = [
    { id: 'affirmations', label: '💝 Affirmations', icon: '💝' },
    { id: 'calendar', label: '📅 Calendar', icon: '📅' },
    { id: 'categories', label: '🎨 Categories', icon: '🎨' },
    { id: 'triggers', label: '⚡ Triggers', icon: '⚡' },
  ] as const;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl app-surface rounded-xl" data-testid="settings-screen">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'affirmations' && (
        <PersonalizedAffirmations
          entries={entries}
          currentMood={currentMood}
          currentStreak={currentStreak}
          userName={userName}
        />
      )}

      {activeTab === 'calendar' && (
        <CalendarSync
          entries={entries}
          onConnectCalendar={() => alert('Calendar integration coming soon!')}
        />
      )}

      {activeTab === 'categories' && (
        <CustomCategories
          categories={categories as any}
          onAddCategory={handleAddCategory as any}
          onUpdateCategory={handleUpdateCategory as any}
          onDeleteCategory={handleDeleteCategory}
        />
      )}

      {activeTab === 'triggers' && (
        <MoodTriggers
          triggers={triggers as any}
          entries={entries as any}
          onAddTrigger={handleAddTrigger as any}
          onDeleteTrigger={handleDeleteTrigger}
        />
      )}
    </div>
  );
}
