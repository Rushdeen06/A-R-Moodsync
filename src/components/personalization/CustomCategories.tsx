import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, Palette } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

// Local shape extends core type with required keywords for this UI usage
interface CustomMoodCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  keywords: string[];
  createdAt: Date;
}

interface CustomCategoriesProps {
  categories: CustomMoodCategory[];
  onAddCategory: (category: Omit<CustomMoodCategory, 'id' | 'createdAt'>) => void;
  onUpdateCategory: (id: string, category: Partial<CustomMoodCategory>) => void;
  onDeleteCategory: (id: string) => void;
}

const PRESET_COLORS = [
  '#7DD4A8',
  '#4FB3C5',
  '#FFB84D',
  '#FF8C61',
  '#FF6B9D',
  '#9B87F5',
  '#6366F1',
  '#EC4899',
  '#F59E0B',
  '#10B981',
];

const PRESET_EMOJIS = [
  '💼',
  '🏠',
  '❤️',
  '🎯',
  '🏃',
  '🧘',
  '👥',
  '🎉',
  '📚',
  '🎨',
  '🍽️',
  '😴',
  '🌟',
  '💪',
  '🌈',
];

export function CustomCategories({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}: CustomCategoriesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    emoji: '💼',
    color: '#4FB3C5',
    keywords: '',
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    const keywords = formData.keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k);

    if (editingId) {
      onUpdateCategory(editingId, {
        name: formData.name,
        emoji: formData.emoji,
        color: formData.color,
        keywords,
      });
      setEditingId(null);
    } else {
      onAddCategory({
        name: formData.name,
        emoji: formData.emoji,
        color: formData.color,
        keywords,
      });
      setIsAdding(false);
    }

    setFormData({ name: '', emoji: '💼', color: '#4FB3C5', keywords: '' });
  };

  const handleEdit = (category: CustomMoodCategory) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      emoji: category.emoji,
      color: category.color,
      keywords: category.keywords.join(', '),
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', emoji: '💼', color: '#4FB3C5', keywords: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Palette className="w-6 h-6 text-teal-600" />
            Custom Mood Categories
          </h2>
          <p className="text-sm text-gray-500 mt-1">Create personalized categories for your mood entries</p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-2 border-teal-500">
              <CardHeader>
                <CardTitle>{editingId ? 'Edit Category' : 'New Category'}</CardTitle>
                <CardDescription>
                  Customize your mood tracking with categories that matter to you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Work, Family, Exercise"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                  />
                </div>

                {/* Emoji Selector */}
                <div>
                  <label className="block text-sm font-medium mb-2">Select Emoji</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                        className={`text-2xl w-12 h-12 rounded-lg border-2 transition-all hover:scale-110 ${
                          formData.emoji === emoji
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Picker */}
                <div>
                  <label className="block text-sm font-medium mb-2">Select Color</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-110 ${
                          formData.color === color
                            ? 'border-gray-900 ring-2 ring-gray-400'
                            : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Keywords Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={e => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                    placeholder="e.g., stress, deadline, meeting"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll suggest this category when you use these keywords in your notes
                  </p>
                </div>

                {/* Preview */}
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-600 mb-2">Preview:</p>
                  <Badge
                    style={{ backgroundColor: formData.color, color: '#fff' }}
                    className="text-sm px-3 py-1"
                  >
                    {formData.emoji} {formData.name || 'Category Name'}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button onClick={handleSubmit} className="bg-teal-600 hover:bg-teal-700 flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Update' : 'Create'}
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: category.color + '30' }}
                      >
                        {category.emoji}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => onDeleteCategory(category.id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {category.keywords.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-600">Keywords:</p>
                      <div className="flex flex-wrap gap-1">
                        {category.keywords.map((keyword, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {categories.length === 0 && !isAdding && (
        <Card>
          <CardContent className="py-12 text-center">
            <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No custom categories yet</p>
            <Button onClick={() => setIsAdding(true)} className="bg-teal-600 hover:bg-teal-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
