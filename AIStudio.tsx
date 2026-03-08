import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Check, Clock, Hash, Zap, Loader2, Calendar, Save, Image, Video, FileText, Palette, Search } from 'lucide-react';
import { generateAIContent, usePostStore } from '../store';
import type { Platform, Tone } from '../types';

type ContentType = 'text' | 'photo' | 'video';

const platforms: { value: Platform; label: string; icon: string }[] = [
  { value: 'linkedin', label: 'LinkedIn', icon: 'in' },
  { value: 'twitter', label: 'Twitter', icon: '𝕏' },
  { value: 'instagram', label: 'Instagram', icon: '📷' },
  { value: 'facebook', label: 'Facebook', icon: 'f' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵' },
  { value: 'youtube', label: 'YouTube', icon: '▶️' },
  { value: 'snapchat', label: 'Snapchat', icon: '👻' },
];

const tones: { value: Tone; label: string; description: string }[] = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
  { value: 'casual', label: 'Casual', description: 'Friendly and relaxed' },
  { value: 'trendy', label: 'Trendy', description: 'Modern and up-to-date' },
  { value: 'marketing', label: 'Marketing', description: 'Persuasive and promotional' },
  { value: 'humorous', label: 'Humorous', description: 'Fun and entertaining' },
];

const contentTypes: { value: ContentType; label: string; icon: React.ElementType; description: string }[] = [
  { value: 'text', label: 'Text Post', icon: FileText, description: 'Write a compelling text post' },
  { value: 'photo', label: 'Photo Post', icon: Image, description: 'Create a post with image suggestions' },
  { value: 'video', label: 'Video Post', icon: Video, description: 'Plan a video with caption ideas' },
];

// Comprehensive topic-based image mapping with multiple fallback images
const getTopicBasedImages = (topic: string): { url: string; description: string; style: string }[] => {
  const topicLower = topic.toLowerCase();
  
  // Extended image library with multiple images per category
  const imageLibrary: Record<string, { url: string; description: string; style: string }[]> = {
    ai: [
      { url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop', description: 'AI artificial intelligence brain', style: 'AI Technology' },
      { url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop', description: 'AI neural network visualization', style: 'Data Science' },
      { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop', description: 'Big data analytics dashboard', style: 'Analytics' },
      { url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop', description: 'Modern technology workspace', style: 'Tech Office' },
      { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop', description: 'Matrix code programming', style: 'Coding' },
      { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop', description: 'Server room technology', style: 'Infrastructure' },
    ],
    tech: [
      { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop', description: 'Computer hardware technology', style: 'Hardware' },
      { url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop', description: 'Programming code screen', style: 'Development' },
      { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop', description: 'Matrix code background', style: 'Coding' },
      { url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop', description: 'Developer coding on laptop', style: 'Programmer' },
      { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop', description: 'Laptop with code', style: 'Web Development' },
      { url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop', description: 'Programming syntax', style: 'Software' },
    ],
    business: [
      { url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop', description: 'Business handshake deal', style: 'Corporate' },
      { url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop', description: 'Strategy planning meeting', style: 'Planning' },
      { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=600&fit=crop', description: 'Business growth success', style: 'Growth' },
      { url: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&h=600&fit=crop', description: 'Team brainstorming', style: 'Collaboration' },
      { url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop', description: 'Business presentation', style: 'Meeting' },
      { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop', description: 'Modern office workspace', style: 'Office' },
    ],
    marketing: [
      { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', description: 'Marketing analytics chart', style: 'Analytics' },
      { url: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&h=600&fit=crop', description: 'Digital marketing strategy', style: 'Digital' },
      { url: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=600&fit=crop', description: 'Content creation workspace', style: 'Creative' },
      { url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop', description: 'Team collaboration marketing', style: 'Team' },
      { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', description: 'Data driven marketing', style: 'Data' },
      { url: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&h=600&fit=crop', description: 'Social media marketing', style: 'Social' },
    ],
    food: [
      { url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop', description: 'Healthy food salad', style: 'Healthy' },
      { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop', description: 'Delicious pizza', style: 'Pizza' },
      { url: 'https://images.unsplash.com/photo-1482049016gy-2f1c81f8d4b7?w=800&h=600&fit=crop', description: 'Gourmet restaurant dish', style: 'Gourmet' },
      { url: 'images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop', description: 'Pancakes breakfast', style: 'Breakfast' },
      { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop', description: 'Luxury food plating', style: 'Fine Dining' },
      { url: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=600&fit=crop', description: 'Fresh ingredients cooking', style: 'Cooking' },
    ],
    travel: [
      { url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop', description: 'Beautiful travel destination', style: 'Destination' },
      { url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop', description: 'Mountain landscape travel', style: 'Adventure' },
      { url: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&h=600&fit=crop', description: 'Travel planning journey', style: 'Journey' },
      { url: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&h=600&fit=crop', description: 'Tropical beach resort', style: 'Beach' },
      { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop', description: 'Road trip adventure', style: 'Road Trip' },
      { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', description: 'Ocean sunset beach', style: 'Ocean' },
    ],
    fitness: [
      { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop', description: 'Gym workout fitness', style: 'Gym' },
      { url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop', description: 'Weight training exercise', style: 'Strength' },
      { url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop', description: 'Personal trainer session', style: 'Training' },
      { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', description: 'Morning workout routine', style: 'Routine' },
      { url: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&h=600&fit=crop', description: 'Yoga meditation practice', style: 'Yoga' },
      { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop', description: 'Running cardio exercise', style: 'Cardio' },
    ],
    fashion: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', description: 'Fashion model stylish', style: 'Model' },
      { url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop', description: 'Clothing wardrobe fashion', style: 'Clothing' },
      { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop', description: 'Fashion boutique clothing', style: 'Boutique' },
      { url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop', description: 'Retail fashion store', style: 'Retail' },
      { url: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=600&fit=crop', description: 'Street style fashion', style: 'Street' },
      { url: 'https://images.unsplash.com/photo-1485968579169-13f5e4548f89?w=800&h=600&fit=crop', description: 'Modern fashion design', style: 'Design' },
    ],
    health: [
      { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop', description: 'Health wellness lifestyle', style: 'Wellness' },
      { url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop', description: 'Meditation mindfulness', style: 'Meditation' },
      { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', description: 'Healthy living habits', style: 'Healthy' },
      { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop', description: 'Exercise health fitness', style: 'Exercise' },
      { url: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&h=600&fit=crop', description: 'Natural health organic', style: 'Organic' },
      { url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop', description: 'Healthy food nutrition', style: 'Nutrition' },
    ],
    education: [
      { url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=600&fit=crop', description: 'Classroom education learning', style: 'Classroom' },
      { url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop', description: 'Students studying education', style: 'Students' },
      { url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop', description: 'Books learning knowledge', style: 'Books' },
      { url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=600&fit=crop', description: 'Online education course', style: 'Online' },
      { url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop', description: 'Teacher students classroom', style: 'Teaching' },
      { url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop', description: 'Study notes learning', style: 'Study' },
    ],
    music: [
      { url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop', description: 'Music concert performance', style: 'Concert' },
      { url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop', description: 'Musician playing guitar', style: 'Musician' },
      { url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop', description: 'Music festival crowd', style: 'Festival' },
      { url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop', description: 'DJ music performance', style: 'DJ' },
      { url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=600&fit=crop', description: 'Music headphones listening', style: 'Listening' },
      { url: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=800&h=600&fit=crop', description: 'Piano musical instrument', style: 'Instrument' },
    ],
    default: [
      { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', description: 'Modern business analytics', style: 'Business' },
      { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop', description: 'Team collaboration meeting', style: 'Team' },
      { url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop', description: 'Creative brainstorming', style: 'Creative' },
      { url: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=600&fit=crop', description: 'Modern workspace setup', style: 'Workspace' },
      { url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop', description: 'Technology coding', style: 'Tech' },
      { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop', description: 'Innovation technology', style: 'Innovation' },
    ],
  };

  // Match topic to best image category
  if (topicLower.includes('ai') || topicLower.includes('artificial intelligence') || topicLower.includes('machine learning') || topicLower.includes('ml')) {
    return imageLibrary.ai;
  } else if (topicLower.includes('tech') || topicLower.includes('software') || topicLower.includes('programming') || topicLower.includes('coding') || topicLower.includes('developer')) {
    return imageLibrary.tech;
  } else if (topicLower.includes('business') || topicLower.includes('startup') || topicLower.includes('entrepreneur') || topicLower.includes('corporate')) {
    return imageLibrary.business;
  } else if (topicLower.includes('market') || topicLower.includes('brand') || topicLower.includes('social media') || topicLower.includes('content')) {
    return imageLibrary.marketing;
  } else if (topicLower.includes('food') || topicLower.includes('recipe') || topicLower.includes('cooking') || topicLower.includes('restaurant')) {
    return imageLibrary.food;
  } else if (topicLower.includes('travel') || topicLower.includes('adventure') || topicLower.includes('vacation') || topicLower.includes('destination')) {
    return imageLibrary.travel;
  } else if (topicLower.includes('fitness') || topicLower.includes('workout') || topicLower.includes('gym') || topicLower.includes('exercise')) {
    return imageLibrary.fitness;
  } else if (topicLower.includes('fashion') || topicLower.includes('style') || topicLower.includes('clothing') || topicLower.includes('outfit')) {
    return imageLibrary.fashion;
  } else if (topicLower.includes('health') || topicLower.includes('wellness') || topicLower.includes('meditation') || topicLower.includes('yoga')) {
    return imageLibrary.health;
  } else if (topicLower.includes('education') || topicLower.includes('learning') || topicLower.includes('study') || topicLower.includes('school') || topicLower.includes('course')) {
    return imageLibrary.education;
  } else if (topicLower.includes('music') || topicLower.includes('concert') || topicLower.includes('song') || topicLower.includes('artist')) {
    return imageLibrary.music;
  } else if (topicLower.includes('nature') || topicLower.includes('landscape') || topicLower.includes('outdoor')) {
    return imageLibrary.travel;
  } else if (topicLower.includes('real estate') || topicLower.includes('property') || topicLower.includes('house') || topicLower.includes('home')) {
    return imageLibrary.business;
  } else if (topicLower.includes('finance') || topicLower.includes('investment') || topicLower.includes('money')) {
    return imageLibrary.business;
  }
  
  return imageLibrary.default;
};

// Generate video ideas based on topic
const generateVideoIdeas = (topic: string): { title: string; description: string; duration: string; format: string }[] => {
  return [
    { title: `${topic} - Ultimate Guide`, description: 'A comprehensive guide covering all aspects', duration: '5-7 min', format: 'Educational' },
    { title: `${topic} Tips & Tricks`, description: 'Quick tips that will level up your knowledge', duration: '1-2 min', format: 'Quick Tips' },
    { title: `Behind the Scenes: ${topic}`, description: 'Show the real process behind the scenes', duration: '2-3 min', format: 'BTS' },
    { title: `${topic} vs Competition`, description: 'Comparison with alternatives', duration: '3-4 min', format: 'Comparison' },
    { title: `My ${topic} Journey`, description: 'Personal story and experience', duration: '4-6 min', format: 'Story' },
  ];
};

// Generate caption ideas based on type and topic
const generateCaptionIdeas = (topic: string, type: ContentType, tone: Tone): string[] => {
  const tonePrefixes: Record<Tone, string[]> = {
    professional: ['Excited to share insights on', 'Here are my thoughts on', 'Breaking down'],
    casual: ['Hey everyone! Let\'s talk about', 'Quick take on', 'So glad to share'],
    trendy: ['This is literally the best thing about', 'Everyone needs to know about', 'The tea on'],
    marketing: ['Transform your results with', 'The ultimate guide to', 'Maximize your potential with'],
    humorous: ['Plot twist:', 'Nobody talks about this but', 'I\'m officially obsessed with'],
  };

  const toneSuffixes: Record<Tone, string[]> = {
    professional: ['#Business #Growth #Insights', '#Professional #Learning', '#Leadership #Success'],
    casual: ['✨ what do you think?', '💯 drop your thoughts below!', '🔥 let me know!'],
    trendy: ['💅✨ trending now', '🤯 mind = blown', '💀 this is everything'],
    marketing: ['Link in bio! 🚀', 'Get started today! 📈', 'Transform now! ⚡'],
    humorous: ['send help 😅', 'I\'m in too deep 😂', 'this is your sign 😂'],
  };

  const prefixes = tonePrefixes[tone];
  const suffixes = toneSuffixes[tone];

  if (type === 'photo') {
    return [
      `📸 ${prefixes[0]} ${topic}! ${suffixes[0]}`,
      `✨ ${prefixes[1]} ${topic}. ${suffixes[1]}`,
      `🎨 ${prefixes[2]} ${topic}. ${suffixes[2]}`,
    ];
  } else if (type === 'video') {
    return [
      `🎬 ${prefixes[0]} ${topic}! Watch till the end ${suffixes[0]}`,
      `📱 ${prefixes[1]} ${topic} - Part 1 ${suffixes[1]}`,
      `🎥 POV: You're learning about ${topic} ${suffixes[2]}`,
    ];
  }
  return [
    `${prefixes[0]} ${topic} ${suffixes[0]}`,
    `${prefixes[1]} ${topic}. ${suffixes[1]}`,
    `${prefixes[2]} ${topic}. ${suffixes[2]}`,
  ];
};

export default function AIStudio() {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<ContentType>('text');
  const [platform, setPlatform] = useState<Platform>('linkedin');
  const [tone, setTone] = useState<Tone>('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    content: string;
    hashtags: string[];
    suggestedTime: string;
    performanceScore: number;
    imageSuggestions?: { url: string; description: string; style: string }[];
    videoIdeas?: { title: string; description: string; duration: string; format: string }[];
    captionIdeas?: string[];
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const { addPost } = usePostStore();

  // Get images based on topic - uses comprehensive topic mapping
  const getImagesForTopic = async (searchTopic: string): Promise<{ url: string; description: string; style: string }[]> => {
    // Use topic-based image library
    return getTopicBasedImages(searchTopic);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setGeneratedContent(null);
    
    try {
      const result = await generateAIContent(topic, platform, tone);
      
      // Get image suggestions based on topic
      let imageSuggestions;
      if (contentType === 'photo') {
        setIsSearchingImages(true);
        imageSuggestions = await getImagesForTopic(topic);
        setIsSearchingImages(false);
      }
      
      const videoIdeas = contentType === 'video' ? generateVideoIdeas(topic) : undefined;
      const captionIdeas = generateCaptionIdeas(topic, contentType, tone);
      
      setGeneratedContent({
        ...result,
        imageSuggestions,
        videoIdeas,
        captionIdeas,
      });
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDraft = () => {
    if (generatedContent) {
      addPost({
        userId: '1',
        platform,
        content: generatedContent.content,
        hashtags: generatedContent.hashtags,
        tone,
        topic,
        status: 'draft',
      });
    }
  };

  const handleSchedule = () => {
    if (generatedContent && scheduleDate) {
      addPost({
        userId: '1',
        platform,
        content: generatedContent.content,
        hashtags: generatedContent.hashtags,
        tone,
        topic,
        status: 'scheduled',
        scheduledDate: scheduleDate,
        bestTime: generatedContent.suggestedTime,
      });
      setScheduleDate('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">AI Content Studio</h1>
        <p className="text-gray-400 mt-1">Generate engaging content with AI - Text, Photo & Video</p>
      </div>

      {/* Input Section */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <div className="space-y-5">
          {/* Content Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Content Type</label>
            <div className="grid grid-cols-3 gap-3">
              {contentTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setContentType(type.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                    contentType === type.value
                      ? 'bg-violet-600/20 border-violet-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <type.icon className={`w-6 h-6 ${contentType === type.value ? 'text-violet-400' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${contentType === type.value ? 'text-white' : 'text-gray-300'}`}>
                    {type.label}
                  </span>
                  <span className="text-xs text-gray-500 text-center">{type.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {contentType === 'photo' ? 'What\'s the photo about?' : contentType === 'video' ? 'What\'s your video topic?' : 'What do you want to write about?'}
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={contentType === 'photo' ? 'e.g., Product launch, Team event, Behind the scenes...' : contentType === 'video' ? 'e.g., Tutorial on AI tools, Day in my life, Product review...' : 'e.g., The future of AI in content marketing...'}
              className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
            />
          </div>

          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Platform</label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPlatform(p.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                    platform === p.value
                      ? 'bg-violet-600 border-violet-500 text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{p.icon}</span>
                  <span className="text-sm font-medium">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Writing Tone</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {tones.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    tone === t.value
                      ? 'bg-violet-600/20 border-violet-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <p className={`text-sm font-medium ${tone === t.value ? 'text-white' : 'text-gray-300'}`}>
                    {t.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{t.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <motion.button
            onClick={handleGenerate}
            disabled={!topic.trim() || isGenerating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isSearchingImages ? 'Searching images...' : 'Generating content...'}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate with AI
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Generated Content */}
      <AnimatePresence mode="wait">
        {generatedContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Text Content */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              {/* Performance Score */}
              <div className="px-6 py-4 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span className="text-sm text-gray-300">Predicted Performance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${generatedContent.performanceScore}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-amber-400 to-green-400 rounded-full"
                    />
                  </div>
                  <span className="text-sm font-semibold text-white">{generatedContent.performanceScore}%</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-violet-600/20 text-violet-300 text-xs font-medium rounded-full capitalize">
                      {contentType}
                    </span>
                    <span className="px-3 py-1 bg-purple-600/20 text-purple-300 text-xs font-medium rounded-full capitalize">
                      {platform}
                    </span>
                    <span className="px-3 py-1 bg-blue-600/20 text-blue-300 text-xs font-medium rounded-full capitalize">
                      {tone}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(generatedContent.content)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <div className="p-4 bg-white/5 rounded-xl mb-4">
                  <p className="text-white whitespace-pre-wrap leading-relaxed">{generatedContent.content}</p>
                </div>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {generatedContent.hashtags.map((hashtag, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 text-blue-300 text-sm rounded-full"
                    >
                      <Hash className="w-3 h-3" />
                      {hashtag.replace('#', '')}
                    </span>
                  ))}
                </div>

                {/* Suggested Time */}
                <div className="flex items-center gap-2 text-gray-400 mb-6">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Best time to post: <span className="text-white">{generatedContent.suggestedTime}</span></span>
                </div>
              </div>
            </div>

            {/* Photo Suggestions */}
            {contentType === 'photo' && generatedContent.imageSuggestions && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Image className="w-5 h-5 text-violet-400" />
                  <h3 className="text-lg font-semibold text-white">Suggested Images for: {topic}</h3>
                </div>
                {isSearchingImages ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Search className="w-5 h-5 animate-pulse" />
                      <span>Finding perfect images for your topic...</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {generatedContent.imageSuggestions.map((img, index) => (
                      <div key={index} className="space-y-2">
                        <div className="aspect-video rounded-xl overflow-hidden bg-white/5">
                          <img 
                            src={img.url} 
                            alt={img.description}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm text-gray-300">{img.description}</p>
                        <span className="text-xs text-violet-400">{img.style}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Video Ideas */}
            {contentType === 'video' && generatedContent.videoIdeas && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Video className="w-5 h-5 text-pink-400" />
                  <h3 className="text-lg font-semibold text-white">Video Concepts</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedContent.videoIdeas.map((video, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">{video.title}</h4>
                        <span className="text-xs px-2 py-1 bg-pink-500/20 text-pink-400 rounded-full">{video.duration}</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{video.description}</p>
                      <span className="text-xs text-cyan-400">{video.format}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Caption Ideas */}
            {generatedContent.captionIdeas && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-semibold text-white">Caption Ideas</h3>
                </div>
                <div className="space-y-3">
                  {generatedContent.captionIdeas.map((caption, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={() => handleCopy(caption)}
                    >
                      <Copy className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-300">{caption}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors"
              >
                <Save className="w-4 h-4" />
                Save as Draft
              </button>
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/50"
                  />
                </div>
                <button
                  onClick={handleSchedule}
                  disabled={!scheduleDate}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
