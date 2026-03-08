import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Edit2, Trash2, Eye, X } from 'lucide-react';
import { usePostStore } from '../store';
import type { Post, Platform } from '../types';

const platformIcons: Record<Platform, string> = {
  linkedin: 'in',
  twitter: '𝕏',
  instagram: '📷',
  facebook: 'f',
  tiktok: '🎵',
  youtube: '▶️',
  snapchat: '👻',
};

const platformColors: Record<Platform, string> = {
  linkedin: '#0077b5',
  twitter: '#1da1f2',
  instagram: '#e4405f',
  facebook: '#1877f2',
  tiktok: '#000000',
  youtube: '#ff0000',
  snapchat: '#fffc00',
};

const statusColors = {
  draft: 'bg-gray-500/20 text-gray-400',
  scheduled: 'bg-amber-500/20 text-amber-400',
  published: 'bg-green-500/20 text-green-400',
};

export default function Scheduler() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { posts, updatePost, deletePost } = usePostStore();

  const scheduledPosts = posts.filter(p => p.status === 'scheduled' || p.status === 'published');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (number | null)[] = [];
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const getPostsForDay = (day: number) => {
    return scheduledPosts.filter(post => {
      if (!post.scheduledDate) return false;
      const postDate = new Date(post.scheduledDate);
      return postDate.getDate() === day && 
             postDate.getMonth() === currentDate.getMonth() &&
             postDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Content Scheduler</h1>
          <p className="text-gray-400 mt-1">Plan and schedule your content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayPosts = day ? getPostsForDay(day) : [];
              const isToday = day === new Date().getDate() && 
                            currentDate.getMonth() === new Date().getMonth() &&
                            currentDate.getFullYear() === new Date().getFullYear();
              
              return (
                <div
                  key={index}
                  className={`min-h-[80px] p-1 rounded-lg border ${
                    day ? 'bg-white/5 border-white/10' : 'border-transparent'
                  } ${isToday ? 'ring-2 ring-violet-500' : ''}`}
                >
                  {day && (
                    <>
                      <span className={`text-sm ${isToday ? 'text-violet-400 font-semibold' : 'text-gray-400'}`}>
                        {day}
                      </span>
                      <div className="mt-1 space-y-1">
                        {dayPosts.slice(0, 2).map(post => (
                          <button
                            key={post.id}
                            onClick={() => setSelectedPost(post)}
                            className="w-full text-left text-xs p-1 rounded truncate"
                            style={{ 
                              backgroundColor: `${platformColors[post.platform]}30`,
                              color: platformColors[post.platform]
                            }}
                          >
                            {post.platform}
                          </button>
                        ))}
                        {dayPosts.length > 2 && (
                          <span className="text-xs text-gray-500">+{dayPosts.length - 2} more</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Posts Sidebar */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">All Scheduled Posts</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {scheduledPosts.length > 0 ? (
              scheduledPosts.map(post => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="w-6 h-6 rounded flex items-center justify-center text-xs"
                      style={{ backgroundColor: platformColors[post.platform] }}
                    >
                      {platformIcons[post.platform]}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[post.status]}`}>
                      {post.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-2">{post.content}</p>
                  {post.scheduledDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {formatDate(post.scheduledDate)}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No scheduled posts</p>
            )}
          </div>
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedPost(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1a1a2e] rounded-2xl border border-white/10 w-full max-w-lg overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: platformColors[selectedPost.platform] }}
                >
                  {platformIcons[selectedPost.platform]}
                </span>
                <div>
                  <h3 className="font-semibold text-white capitalize">{selectedPost.platform}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[selectedPost.status]}`}>
                    {selectedPost.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-4">
              <p className="text-white mb-4">{selectedPost.content}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedPost.hashtags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {selectedPost.scheduledDate && (
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                  <CalendarIcon className="w-4 h-4" />
                  {formatDate(selectedPost.scheduledDate)}
                </div>
              )}

              {selectedPost.status === 'published' && (
                <div className="grid grid-cols-4 gap-2 p-3 bg-white/5 rounded-xl mb-4">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-white">{selectedPost.engagement.likes}</p>
                    <p className="text-xs text-gray-500">Likes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-white">{selectedPost.engagement.views}</p>
                    <p className="text-xs text-gray-500">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-white">{selectedPost.engagement.shares}</p>
                    <p className="text-xs text-gray-500">Shares</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-white">{selectedPost.engagement.comments}</p>
                    <p className="text-xs text-gray-500">Comments</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    updatePost(selectedPost.id, { status: 'draft' });
                    setSelectedPost(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Save as Draft
                </button>
                <button
                  onClick={() => {
                    deletePost(selectedPost.id);
                    setSelectedPost(null);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
