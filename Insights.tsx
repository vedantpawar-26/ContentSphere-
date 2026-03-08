import { motion } from 'framer-motion';
import { Sparkles, Clock, Lightbulb, Target, TrendingUp, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import { useAnalyticsStore } from '../store';
import type { Recommendation } from '../types';

const typeIcons = {
  topic: Lightbulb,
  timing: Clock,
  style: TrendingUp,
  content: Target,
};

const typeColors = {
  topic: 'from-amber-500 to-orange-600',
  timing: 'from-blue-500 to-cyan-600',
  style: 'from-purple-500 to-pink-600',
  content: 'from-green-500 to-emerald-600',
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Insights() {
  const { recommendations, analytics } = useAnalyticsStore();

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 80) return 'text-blue-400';
    if (confidence >= 70) return 'text-amber-400';
    return 'text-gray-400';
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">AI Insights</h1>
            <p className="text-gray-400">Personalized recommendations powered by AI</p>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-400 text-sm">Best Category</span>
          </div>
          <p className="text-xl font-semibold text-white">{analytics.bestPerformingCategory}</p>
          <p className="text-sm text-green-400 mt-1">+23% higher engagement</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-400 text-sm">Peak Time</span>
          </div>
          <p className="text-xl font-semibold text-white">6PM - 8PM</p>
          <p className="text-sm text-gray-400 mt-1">Weekday evenings</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-400 text-sm">Content Format</span>
          </div>
          <p className="text-xl font-semibold text-white">Short-Form</p>
          <p className="text-sm text-green-400 mt-1">40% better performance</p>
        </div>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div variants={item}>
        <h2 className="text-xl font-semibold text-white mb-4">AI Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => {
            const Icon = typeIcons[rec.type];
            
            return (
              <motion.div
                key={rec.id}
                variants={item}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-violet-500/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeColors[rec.type]} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-white">{rec.title}</h3>
                      <span className={`text-sm font-medium ${getConfidenceColor(rec.confidence)}`}>
                        {rec.confidence}%
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">{rec.description}</p>
                    
                    {rec.action && (
                      <button className="flex items-center gap-2 mt-4 text-sm text-violet-400 hover:text-violet-300 transition-colors">
                        {rec.action}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Confidence bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">AI Confidence</span>
                    <span className={getConfidenceColor(rec.confidence)}>{rec.confidence}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${rec.confidence}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${typeColors[rec.type]}`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Predictive Insights */}
      <motion.div variants={item} className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-2xl border border-violet-500/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Predictive Insights</h3>
            <p className="text-sm text-gray-400">AI-powered forecasts based on your data</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-medium">Post 2-3x more video content</p>
              <p className="text-sm text-gray-400 mt-1">Video generates 3x more shares than static content</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-medium">Focus on educational topics</p>
              <p className="text-sm text-gray-400 mt-1">Educational content has 2.5x higher engagement</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-medium">Increase posting frequency</p>
              <p className="text-sm text-gray-400 mt-1">Posting 5x/week could grow your audience by 35%</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-medium">Cross-promote on TikTok</p>
              <p className="text-sm text-gray-400 mt-1">Your TikTok content drives 40% of total engagement</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
