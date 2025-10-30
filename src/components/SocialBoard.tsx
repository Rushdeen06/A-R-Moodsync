import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';

interface SocialPost {
  id: string;
  author: string;
  mood: string;
  content: string;
  timestamp: Date;
  likes: number;
  liked: boolean;
}

interface SocialBoardProps {
  userName: string;
}

const MOOD_COLORS = {
  happy: 'bg-green-100 text-green-800',
  sad: 'bg-blue-100 text-blue-800',
  angry: 'bg-red-100 text-red-800',
  anxious: 'bg-yellow-100 text-yellow-800',
  calm: 'bg-purple-100 text-purple-800',
  excited: 'bg-pink-100 text-pink-800',
};

const MOOD_ICONS = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  anxious: '😰',
  calm: '😌',
  excited: '🤩',
};

// Sample posts
const initialPosts: SocialPost[] = [
  {
    id: '1',
    author: 'Sarah M.',
    mood: 'happy',
    content: 'Had an amazing therapy session today. Feeling grateful for the progress I\'ve made! 💚',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 12,
    liked: false,
  },
  {
    id: '2',
    author: 'Alex K.',
    mood: 'anxious',
    content: 'Big presentation tomorrow. Using breathing exercises to stay calm. You got this! 🌊',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 8,
    liked: false,
  },
  {
    id: '3',
    author: 'Jordan P.',
    mood: 'calm',
    content: 'Morning meditation complete. Starting the day with intention and peace. ☮️',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likes: 15,
    liked: false,
  },
  {
    id: '4',
    author: 'Taylor R.',
    mood: 'excited',
    content: 'Just got accepted into the program I applied for! All the hard work paid off! 🎉',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    likes: 23,
    liked: false,
  },
];

export function SocialBoard({ userName }: SocialBoardProps) {
  const [posts, setPosts] = useState<SocialPost[]>(initialPosts);
  const [newPost, setNewPost] = useState('');

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked,
        };
      }
      return post;
    }));
  };

  const handlePost = () => {
    if (!newPost.trim()) {
      toast.error('Please write something to share');
      return;
    }

    const post: SocialPost = {
      id: Date.now().toString(),
      author: userName,
      mood: 'happy',
      content: newPost,
      timestamp: new Date(),
      likes: 0,
      liked: false,
    };

    setPosts([post, ...posts]);
    setNewPost('');
    toast.success('Posted to the community! 🎊');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl mb-1">Community Board 🌟</h2>
        <p className="text-gray-600 text-sm">Share your journey and support others</p>
      </div>

      {/* Create Post */}
      <Card>
        <CardHeader>
          <CardTitle>Share with the community</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Share your thoughts, wins, or challenges..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows={3}
            className="text-base"
          />
          <Button onClick={handlePost} className="w-full h-12">
            <Send className="h-4 w-4 mr-2" />
            Post
          </Button>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-3">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="pt-5">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{getInitials(post.author)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm">{post.author}</span>
                    <Badge variant="secondary" className={`${MOOD_COLORS[post.mood as keyof typeof MOOD_COLORS]} text-xs`}>
                      {MOOD_ICONS[post.mood as keyof typeof MOOD_ICONS]} {post.mood}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{post.content}</p>
                  <div className="flex items-center gap-1 pt-1 text-xs text-gray-500">
                    {getTimeAgo(post.timestamp)}
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={`h-9 ${post.liked ? 'text-pink-500' : ''}`}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${post.liked ? 'fill-pink-500' : ''}`} />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
