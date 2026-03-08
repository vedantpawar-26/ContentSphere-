import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Sparkles, 
  Calendar, 
  BarChart3, 
  Bot, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  User
} from 'lucide-react';
import { useAuthStore, useUIStore } from '../store';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Sparkles, label: 'AI Studio', path: '/ai-studio' },
  { icon: Calendar, label: 'Scheduler', path: '/scheduler' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Bot, label: 'AI Insights', path: '/insights' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-50 h-screen w-72 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] border-r border-white/5 backdrop-blur-xl"
          >
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  ContentSphere
                </h1>
                <p className="text-xs text-gray-400">AI Content Platform</p>
              </div>
              <button 
                onClick={toggleSidebar}
                className="ml-auto p-2 hover:bg-white/5 rounded-lg transition-colors lg:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive 
                        ? 'bg-gradient-to-r from-violet-600/20 to-purple-600/10 text-white border border-violet-500/30' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-violet-400' : 'group-hover:text-violet-400'}`} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
              <Link
                to="/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </Link>
              
              {user && (
                <div className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl bg-white/5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
        {/* Top navbar */}
        <header className="sticky top-0 z-40 h-16 bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 focus-within:border-violet-500/50 transition-colors">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts, insights..."
                  className="bg-transparent border-none outline-none text-sm w-48 lg:w-64 placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full" />
              </button>

              {/* User avatar (mobile) */}
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <User className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
