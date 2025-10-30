import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MessageCircle, Heart, TrendingUp, Users, Filter, X, Send, Smile } from 'lucide-react';
import { Badge } from '../ui/badge';
import { toast } from '../ui/sonner';
// Theme removed – static light palette.

import type { } from '../../App'; // ensure TS can link types if needed
interface MobileSocialBoardProps {
  entries: Array<{ id: string; userName?: string; mood: string; note: string; timestamp: Date; category?: string }>;
  onBack: () => void;
}

const CATEGORIES = ['Editing', 'Leading', 'Fleet'];
const MOOD_EMOJIS: Record<string, string> = {
  'great': '😄',
  'good': '😊',
  'okay': '😐',
  'low': '😔',
  'very-low': '😢',
};

interface LocalPost { id: string; userName: string; mood: string; note: string; timestamp: Date; category?: string }

export function MobileSocialBoard({ entries, onBack }: MobileSocialBoardProps) {
  const isDark = false; // static light theme
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [showComments, setShowComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Record<string, Array<{ text: string; time: Date }>>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  // Local posts persistence
  const [localPosts, setLocalPosts] = useState<LocalPost[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('moodsync_local_posts');
      if (raw) {
        const parsed = JSON.parse(raw);
        setLocalPosts(parsed.map((p: any) => ({ ...p, timestamp: new Date(p.timestamp) })));
      }
    } catch { /* ignore */ }
  }, []);

  const allEntries: LocalPost[] = [...localPosts, ...entries.map(e => ({
    id: e.id,
    userName: e.userName || 'User',
    mood: e.mood,
    note: e.note,
    timestamp: e.timestamp,
    category: e.category
  }))];

  const filteredEntries = selectedCategory
    ? allEntries.filter(e => e.category === selectedCategory)
    : allEntries;

  // Sort entries
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortBy === 'popular') {
      const likesA = likedPosts.has(a.id) ? 1 : 0;
      const likesB = likedPosts.has(b.id) ? 1 : 0;
      return likesB - likesA;
    }
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  const handleLike = (postId: string) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
      toast('Removed like');
    } else {
      newLiked.add(postId);
      toast.success('Post liked! ❤️');
    }
    setLikedPosts(newLiked);
  };

  const handleComment = (postId: string) => {
    if (!commentText.trim()) return;
    
    const newComments = { ...comments };
    if (!newComments[postId]) {
      newComments[postId] = [];
    }
    newComments[postId].push({ text: commentText, time: new Date() });
    setComments(newComments);
    setCommentText('');
    toast.success('Comment added! 💬');
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      'great': '#7DD4A8',
      'good': '#4FB3C5',
      'okay': '#FFB84D',
      'low': '#FF8C61',
      'very-low': '#FF6B9D',
    };
    return colors[mood] || '#4FB3C5';
  };

  // Composer state
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerMood, setComposerMood] = useState<string>('');
  const [composerText, setComposerText] = useState('');
  const [composerCategory, setComposerCategory] = useState<string>('General');

  const MOODS = ['great','good','okay','low','very-low'];

  const handlePost = () => {
    if (!composerMood || !composerText.trim()) { return toast('Add mood & message'); }
    const userName = (localStorage.getItem('moodsync_user') && JSON.parse(localStorage.getItem('moodsync_user')||'{}')?.name) || 'You';
    const newPost: LocalPost = {
      id: 'local-' + Date.now(),
      userName,
      mood: composerMood,
      note: composerText,
      timestamp: new Date(),
      category: composerCategory
    };
    const updated = [newPost, ...localPosts];
    setLocalPosts(updated);
    localStorage.setItem('moodsync_local_posts', JSON.stringify(updated));
    setComposerOpen(false);
    setComposerMood('');
    setComposerText('');
    toast.success('Post shared!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen pb-24"
  style={{ backgroundColor: isDark ? '#1a1a1a' : '#E8F6F8' }}
    >
      <div className="max-w-md mx-auto">
        {/* Header with Stats */}
  <div className="sticky top-0 z-10 p-4" style={{ backgroundColor: isDark ? '#1a1a1a' : '#E8F6F8' }}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="p-2 rounded-full transition-colors" style={{ backgroundColor: isDark ? '#2d2d2d' : 'transparent' }}>
              <ArrowLeft className="w-6 h-6" style={{ color: isDark ? '#4FB3C5' : '#2D7A8B' }} />
            </button>
            <h2 className="text-xl font-semibold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
              Social Board
            </h2>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-full transition-colors"
              style={{ backgroundColor: isDark ? '#2d2d2d' : 'transparent' }}
            >
              <Filter className="w-6 h-6" style={{ color: isDark ? '#4FB3C5' : '#2D7A8B' }} />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="rounded-2xl p-4 shadow-sm mb-4" style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}>
            <div className="flex justify-around">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-4 h-4" style={{ color: '#4FB3C5' }} />
                  <p className="text-lg font-semibold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                    {entries.length}
                  </p>
                </div>
                <p className="text-xs" style={{ color: isDark ? '#999' : '#4FB3C5' }}>Active Users</p>
              </div>
              <div className="h-12 w-px" style={{ backgroundColor: isDark ? '#3d3d3d' : '#E8F6F8' }} />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="w-4 h-4" style={{ color: '#7DD4A8' }} />
                  <p className="text-lg font-semibold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                    {likedPosts.size}
                  </p>
                </div>
                <p className="text-xs" style={{ color: isDark ? '#999' : '#4FB3C5' }}>Total Likes</p>
              </div>
              <div className="h-12 w-px" style={{ backgroundColor: isDark ? '#3d3d3d' : '#E8F6F8' }} />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <MessageCircle className="w-4 h-4" style={{ color: '#FFB84D' }} />
                  <p className="text-lg font-semibold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                    {Object.values(comments).flat().length}
                  </p>
                </div>
                <p className="text-xs" style={{ color: isDark ? '#999' : '#4FB3C5' }}>Comments</p>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-2xl p-4 shadow-sm mb-4"
              style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>Filters</p>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5" style={{ color: '#4FB3C5' }} />
                </button>
              </div>

              {/* Category Filters */}
              <div className="mb-3">
                <p className="text-xs mb-2" style={{ color: '#4FB3C5' }}>Category</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge
                    onClick={() => setSelectedCategory('')}
                    className="px-3 py-1 rounded-full cursor-pointer text-xs"
                    style={{
                      backgroundColor: selectedCategory === '' ? '#4FB3C5' : (isDark ? '#3d3d3d' : '#E8F6F8'),
                      color: selectedCategory === '' ? 'white' : (isDark ? '#ccc' : '#2D7A8B'),
                    }}
                  >
                    All
                  </Badge>
                  {CATEGORIES.map((category) => (
                    <Badge
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="px-3 py-1 rounded-full cursor-pointer text-xs"
                      style={{
                        backgroundColor: selectedCategory === category ? '#4FB3C5' : (isDark ? '#3d3d3d' : '#E8F6F8'),
                        color: selectedCategory === category ? 'white' : (isDark ? '#ccc' : '#2D7A8B'),
                      }}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <p className="text-xs mb-2" style={{ color: '#4FB3C5' }}>Sort By</p>
                <div className="flex gap-2">
                  <Badge
                    onClick={() => setSortBy('recent')}
                    className="px-3 py-1 rounded-full cursor-pointer text-xs"
                    style={{
                      backgroundColor: sortBy === 'recent' ? '#4FB3C5' : (isDark ? '#3d3d3d' : '#E8F6F8'),
                      color: sortBy === 'recent' ? 'white' : (isDark ? '#ccc' : '#2D7A8B'),
                    }}
                  >
                    Recent
                  </Badge>
                  <Badge
                    onClick={() => setSortBy('popular')}
                    className="px-3 py-1 rounded-full cursor-pointer text-xs"
                    style={{
                      backgroundColor: sortBy === 'popular' ? '#4FB3C5' : (isDark ? '#3d3d3d' : '#E8F6F8'),
                      color: sortBy === 'popular' ? 'white' : (isDark ? '#ccc' : '#2D7A8B'),
                    }}
                  >
                    Popular
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Composer */}
        <div className="px-4 mb-4">
          {!composerOpen && (
            <button
              onClick={() => setComposerOpen(true)}
              className="w-full rounded-2xl p-4 text-left shadow-sm flex items-center gap-3"
              style={{ backgroundColor: isDark ? '#2d2d2d' : 'white', color: isDark ? '#fff' : '#2D7A8B' }}
              data-testid="open-composer"
            >
              <Smile className="w-5 h-5" style={{ color: '#4FB3C5' }} />
              <span className="text-sm opacity-80">Share how you're feeling...</span>
            </button>
          )}
          {composerOpen && (
            <div className="rounded-2xl p-4 shadow-sm" style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}>
              <div className="flex gap-2 mb-3 flex-wrap">
                {MOODS.map(m => (
                  <button
                    key={m}
                    onClick={() => setComposerMood(m)}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: composerMood === m ? '#4FB3C5' : (isDark ? '#3d3d3d' : '#E8F6F8'),
                      color: composerMood === m ? 'white' : (isDark ? '#ccc' : '#2D7A8B')
                    }}
                    data-testid={`composer-mood-${m}`}
                  >
                    {MOOD_EMOJIS[m] || '😐'} {m}
                  </button>
                ))}
              </div>
              <textarea
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full text-sm rounded-xl p-3 mb-3 outline-none"
                style={{ backgroundColor: isDark ? '#3d3d3d' : '#F5F8FA', color: isDark ? '#fff' : '#2D7A8B' }}
                rows={3}
                data-testid="composer-text"
              />
              <div className="flex justify-between items-center mb-3">
                <select
                  value={composerCategory}
                  onChange={(e) => setComposerCategory(e.target.value)}
                  className="text-xs rounded-full px-3 py-1"
                  style={{ backgroundColor: isDark ? '#3d3d3d' : '#E8F6F8', color: isDark ? '#fff' : '#2D7A8B' }}
                  data-testid="composer-category"
                >
                  <option>General</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setComposerOpen(false); setComposerMood(''); setComposerText(''); }}
                    className="text-xs px-3 py-2 rounded-full"
                    style={{ backgroundColor: isDark ? '#3d3d3d' : '#E8F6F8', color: isDark ? '#ccc' : '#2D7A8B' }}
                    data-testid="composer-cancel"
                  >Cancel</button>
                  <button
                    onClick={handlePost}
                    disabled={!composerMood || !composerText.trim()}
                    className="text-xs px-3 py-2 rounded-full"
                    style={{ backgroundColor: (!composerMood || !composerText.trim()) ? '#A8C9C7' : '#4FB3C5', color: 'white' }}
                    data-testid="composer-submit"
                  >Share</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Posts Feed */}
        <div className="px-4 space-y-4">
          {sortedEntries.length > 0 ? (
            sortedEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl p-4 shadow-sm"
                style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}
              >
                {/* Post Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                    style={{ backgroundColor: getMoodColor(entry.mood) }}
                  >
                    {(entry.userName || '?').charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold truncate" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                        {entry.userName || 'Anonymous'}
                      </p>
                      <span className="text-xs flex-shrink-0" style={{ color: '#4FB3C5' }}>
                        {getTimeAgo(entry.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg">{MOOD_EMOJIS[entry.mood] || '😐'}</span>
                      <Badge
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: `${getMoodColor(entry.mood)}20`,
                          color: getMoodColor(entry.mood)
                        }}
                      >
                        {entry.category || 'General'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                {entry.note && (
                  <p className="text-sm mb-4 leading-relaxed" style={{ color: isDark ? '#ccc' : '#2D7A8B' }}>
                    {entry.note}
                  </p>
                )}

                {/* Engagement Stats */}
                <div className="flex items-center gap-4 mb-3 pb-3 border-b" style={{ borderColor: isDark ? '#3d3d3d' : '#E8F6F8' }}>
                  <div className="flex items-center gap-1 text-xs" style={{ color: '#4FB3C5' }}>
                    <Heart className="w-4 h-4 fill-current" style={{ color: likedPosts.has(entry.id) ? '#FF6B9D' : '#4FB3C5' }} />
                    <span>{likedPosts.has(entry.id) ? '1' : '0'} likes</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: '#4FB3C5' }}>
                    <MessageCircle className="w-4 h-4" />
                    <span>{comments[entry.id]?.length || 0} comments</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLike(entry.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all active:scale-95"
                    style={{
                      backgroundColor: likedPosts.has(entry.id) ? '#FFE5F0' : (isDark ? '#3d3d3d' : '#E8F6F8'),
                      color: likedPosts.has(entry.id) ? '#FF6B9D' : (isDark ? '#fff' : '#2D7A8B'),
                    }}
                  >
                    <Heart
                      className="w-4 h-4"
                      fill={likedPosts.has(entry.id) ? '#FF6B9D' : 'none'}
                      style={{ color: likedPosts.has(entry.id) ? '#FF6B9D' : '#2D7A8B' }}
                    />
                    <span className="text-sm font-medium">
                      {likedPosts.has(entry.id) ? 'Liked' : 'Like'}
                    </span>
                  </button>
                  <button
                    onClick={() => setShowComments(showComments === entry.id ? null : entry.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all active:scale-95"
                    style={{
                      backgroundColor: showComments === entry.id ? '#E8DFF5' : (isDark ? '#3d3d3d' : '#E8F6F8'),
                      color: showComments === entry.id ? '#9B7FD8' : (isDark ? '#fff' : '#2D7A8B'),
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Comment</span>
                  </button>
                </div>

                {/* Comments Section */}
                {showComments === entry.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t"
                    style={{ borderColor: isDark ? '#3d3d3d' : '#E8F6F8' }}
                  >
                    {/* Existing Comments */}
                    {comments[entry.id]?.map((comment, idx) => (
                      <div key={idx} className="mb-3 flex gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                          style={{ backgroundColor: '#4FB3C5' }}
                        >
                          <Smile className="w-4 h-4" />
                        </div>
                        <div className="flex-1 rounded-2xl p-3" style={{ backgroundColor: isDark ? '#3d3d3d' : '#F5F8FA' }}>
                          <p className="text-xs font-semibold mb-1" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                            You
                          </p>
                          <p className="text-sm" style={{ color: isDark ? '#ccc' : '#2D7A8B' }}>
                            {comment.text}
                          </p>
                          <p className="text-xs mt-1" style={{ color: '#4FB3C5' }}>
                            {getTimeAgo(comment.time)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Comment Input */}
                    <div className="flex gap-2 mt-3">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleComment(entry.id)}
                        placeholder="Write a comment..."
                        className="flex-1 px-4 py-2 rounded-full text-sm outline-none"
                        style={{
                          backgroundColor: isDark ? '#3d3d3d' : '#F5F8FA',
                          color: isDark ? '#fff' : '#2D7A8B',
                        }}
                      />
                      <button
                        onClick={() => handleComment(entry.id)}
                        disabled={!commentText.trim()}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
                        style={{ backgroundColor: '#4FB3C5' }}
                      >
                        <Send className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="rounded-3xl p-12 text-center shadow-sm" style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}>
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: isDark ? '#3d3d3d' : '#E8F6F8' }}
              >
                <Users className="w-10 h-10" style={{ color: '#4FB3C5' }} />
              </div>
              <p className="text-lg mb-2 font-semibold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                No posts yet
              </p>
              <p className="text-sm" style={{ color: isDark ? '#999' : '#4FB3C5' }}>
                Be the first to share your mood!
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
