import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { Flame, Trophy, BookOpen, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { profile } = useAuthStore();

  const stats = [
    { label: 'Total XP', value: profile?.xp || 0, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Day Streak', value: profile?.streak || 0, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Modules Done', value: profile?.completedModules.length || 0, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Current Rank', value: 'Novice', icon: Trophy, color: 'text-maroon-600', bg: 'bg-maroon-50' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {profile?.displayName}! 👋</h1>
        <p className="text-slate-500 mt-2">Ready to continue your AI journey?</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Continue Learning</h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full mb-3">
                  In Progress
                </span>
                <h3 className="text-lg font-bold text-slate-900">Introduction to Neural Networks</h3>
                <p className="text-slate-500 text-sm mt-1">Learn the basics of forward propagation and activation functions.</p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-maroon-100 flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-maroon-100" />
                  <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="175" strokeDashoffset="105" className="text-maroon-600" />
                </svg>
                <span className="text-sm font-bold text-slate-700">40%</span>
              </div>
            </div>
            <Link to="/modules/neural-networks" className="inline-flex items-center gap-2 text-maroon-600 font-medium hover:text-maroon-700">
              Resume Module <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Recommended Games */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Daily Challenges</h2>
          <div className="bg-gradient-to-br from-maroon-600 to-rose-500 p-6 rounded-2xl text-white shadow-lg shadow-maroon-200">
            <h3 className="font-bold text-lg mb-2">Decision Tree Builder</h3>
            <p className="text-maroon-100 text-sm mb-6">Build a tree to classify the Iris dataset. Earn +50 XP!</p>
            <Link to="/games/decision-tree" className="block w-full py-2.5 bg-white text-maroon-600 text-center font-medium rounded-xl hover:bg-slate-50 transition-colors">
              Play Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
