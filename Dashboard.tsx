import { motion } from 'framer-motion';
import { TrendingUp, Eye, Heart, Share2, MessageCircle, Calendar, Sparkles, ArrowUpRight } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useDashboardStats, useUpcomingPosts, useAnalyticsStore, usePostStore } from '../store';
import { Link } from 'react-router-dom';
import type { Platform } from '../types';

const platformColors: Record<Platform, string> = {
  linkedin: '#0077b5',
  twitter: '#1da1f2',
  instagram: '#e4405f',
  facebook: '#1877f2',
  tiktok: '#000000',
  youtube: '#ff0000',
  snapchat: '#fffc00',
};

const platformIcons: Record<Platform, string> = {
  linkedin: 'in',
  twitter: '𝕏',
  instagram: '📷',
  facebook: 'f',
  tiktok: '🎵',
  youtube: '▶️',
  snapchat: '👻',
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const stats = useDashboardStats();
  const upcomingPosts = useUpcomingPosts();
  const { analytics, recommendations } = useAnalyticsStore();
  const posts = usePostStore(state => state.posts);

  const publishedCount = posts.filter(p => p.status === 'published').length;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's your content overview.</p>
        </div>
        <Link 
          to="/ai-studio"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-medium text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Generate Content
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-green-400 text-sm font-medium flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +12.5%
            </span>
          </div>
          <p className="text-gray-400 text-sm">Total Posts</p>
          <p className="text-2xl font-bold text-white mt-1">{publishedCount}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-green-400 text-sm font-medium flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +8.2%
            </span>
          </div>
          <p className="text-gray-400 text-sm">Total Engagement</p>
          <p className="text-2xl font-bold text-white mt-1">{formatNumber(stats.totalEngagement)}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-green-400 text-sm font-medium flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +15.3%
            </span>
          </div>
          <p className="text-gray-400 text-sm">Total Views</p>
          <p className="text-2xl font-bold text-white mt-1">48.2K</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-green-400 text-sm font-medium flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +22.1%
            </span>
          </div>
          <p className="text-gray-400 text-sm">Growth Rate</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.growthRate}%</p>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Chart */}
        <motion.div variants={item} className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Engagement</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.weeklyData}>
                <defs>
                  <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '12px'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="likes" 
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorLikes)" 
                  name="Likes"
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#06b6d4" 
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                  name="Views"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Platform Distribution */}
        <motion.div variants={item} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Platform Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.platformBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="posts"
                  nameKey="platform"
                >
                  {analytics.platformBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={platformColors[entry.platform as Platform]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {analytics.platformBreakdown.map((stat) => (
              <div key={stat.platform} className="flex items-center gap-1 text-xs">
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: platformColors[stat.platform as Platform] }}
                />
                <span className="text-gray-400 capitalize">{stat.platform}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Posts */}
        <motion.div variants={item} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Upcoming Scheduled Posts</h3>
            <Link to="/scheduler" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingPosts.length > 0 ? (
              upcomingPosts.map((post) => (
                <div key={post.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-lg">
                    {platformIcons[post.platform as Platform]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{post.content}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.scheduledDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No scheduled posts</p>
            )}
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div variants={item} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              AI Recommendations
            </h3>
            <Link to="/insights" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="p-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl border border-violet-500/20">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-white text-sm">{rec.title}</h4>
                    <p className="text-gray-400 text-xs mt-1">{rec.description}</p>
                  </div>
                  <span className="text-violet-400 text-sm font-medium">{rec.confidence}%</span>
                </div>
                {rec.action && (
                  <Link 
                    to="/ai-studio"
                    className="inline-block mt-3 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    {rec.action} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
