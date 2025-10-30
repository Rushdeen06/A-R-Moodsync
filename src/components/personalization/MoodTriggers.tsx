import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Plus, Trash2, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface MoodTrigger {
  id: string;
  name: string;
  type: 'positive' | 'negative' | 'neutral';
  category: string;
  notes: string;
  occurrences: number;
  lastOccurrence: Date;
  createdAt: Date;
}

interface MoodEntry {
  id: string;
  mood: string;
  note: string;
  timestamp: Date;
  intensity: number;
}

interface MoodTriggersProps {
  triggers: MoodTrigger[];
  entries: MoodEntry[];
  onAddTrigger: (trigger: Omit<MoodTrigger, 'id' | 'createdAt' | 'occurrences' | 'lastOccurrence'>) => void;
  onDeleteTrigger: (id: string) => void;
}

export function MoodTriggers({ triggers, entries, onAddTrigger, onDeleteTrigger }: MoodTriggersProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');

  const [formData, setFormData] = useState({
    name: '',
    type: 'neutral' as const,
    category: 'Work',
    notes: '',
  });

  const triggerAnalysis = useMemo(() => {
    const positiveTriggers = triggers.filter(t => t.type === 'positive').length;
    const negativeTriggers = triggers.filter(t => t.type === 'negative').length;
    const mostFrequent = [...triggers].sort((a, b) => b.occurrences - a.occurrences)[0];

    // Analyze entries for potential new triggers
    const recentLowMoods = entries
      .filter(e => e.intensity <= 2)
      .slice(0, 10);

    const commonWords = new Map<string, number>();
    recentLowMoods.forEach(entry => {
      const words = entry.note.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 4) {
          commonWords.set(word, (commonWords.get(word) || 0) + 1);
        }
      });
    });

    const suggestions = Array.from(commonWords.entries())
      .filter(([word, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word);

    return {
      positiveTriggers,
      negativeTriggers,
      mostFrequent,
      suggestions,
      totalOccurrences: triggers.reduce((sum, t) => sum + t.occurrences, 0),
    };
  }, [triggers, entries]);

  const filteredTriggers = useMemo(() => {
    if (filterType === 'all') return triggers;
    return triggers.filter(t => t.type === filterType);
  }, [triggers, filterType]);

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    onAddTrigger({
      name: formData.name,
      type: formData.type,
      category: formData.category,
      notes: formData.notes,
    });

    setFormData({ name: '', type: 'neutral', category: 'Work', notes: '' });
    setIsAdding(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'negative':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="w-4 h-4" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <BarChart3 className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-teal-600" />
            Mood Triggers
          </h2>
          <p className="text-sm text-gray-500 mt-1">Identify what affects your wellbeing</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Trigger
          </Button>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Positive Triggers</p>
                <p className="text-3xl font-bold text-green-600">{triggerAnalysis.positiveTriggers}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Negative Triggers</p>
                <p className="text-3xl font-bold text-red-600">{triggerAnalysis.negativeTriggers}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Occurrences</p>
                <p className="text-3xl font-bold text-teal-600">{triggerAnalysis.totalOccurrences}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-teal-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Suggestions */}
      {triggerAnalysis.suggestions.length > 0 && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">💡 Suggested Triggers</CardTitle>
            <CardDescription className="text-blue-700">
              We noticed these words appear frequently in low mood entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {triggerAnalysis.suggestions.map(word => (
                <Button
                  key={word}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, name: word, type: 'negative' }));
                    setIsAdding(true);
                  }}
                  className="bg-white hover:bg-blue-100 text-blue-900 border-blue-300"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {word}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-2 border-teal-500">
              <CardHeader>
                <CardTitle>New Trigger</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Trigger Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Deadlines, Exercise, Social events"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <div className="flex gap-2">
                    {(['positive', 'negative', 'neutral'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setFormData(prev => ({ ...prev, type }))}
                        className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all capitalize ${
                          formData.type === type
                            ? type === 'positive'
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : type === 'negative'
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-gray-500 bg-gray-50 text-gray-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                  >
                    <option>Work</option>
                    <option>Personal</option>
                    <option>Health</option>
                    <option>Social</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add details about this trigger..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSubmit} className="bg-teal-600 hover:bg-teal-700 flex-1">
                    Add Trigger
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAdding(false);
                      setFormData({ name: '', type: 'neutral', category: 'Work', notes: '' });
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'positive', 'negative', 'neutral'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              filterType === type
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Triggers List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredTriggers.map((trigger, idx) => (
            <motion.div
              key={trigger.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={`${getTypeColor(trigger.type)} border`}>
                          {getTypeIcon(trigger.type)}
                          <span className="ml-1 capitalize">{trigger.type}</span>
                        </Badge>
                        <h3 className="font-semibold text-lg">{trigger.name}</h3>
                        <span className="text-sm text-gray-500">• {trigger.category}</span>
                      </div>
                      {trigger.notes && <p className="text-sm text-gray-600 mb-2">{trigger.notes}</p>}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Occurred {trigger.occurrences} times</span>
                        <span>•</span>
                        <span>Last: {new Date(trigger.lastOccurrence).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteTrigger(trigger.id)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTriggers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No {filterType !== 'all' && filterType} triggers found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
