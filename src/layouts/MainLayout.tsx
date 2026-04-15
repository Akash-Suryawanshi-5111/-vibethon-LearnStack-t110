import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  Code2, 
  Gamepad2, 
  Trophy, 
  LogOut,
  BrainCircuit
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useAuthStore } from '../store/useAuthStore';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuthStore();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/modules', icon: BookOpen, label: 'Learn' },
    { path: '/playground', icon: Code2, label: 'Playground' },
    { path: '/games', icon: Gamepad2, label: 'Mini Games' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-maroon-600 p-2 rounded-xl text-white">
            <BrainCircuit size={24} />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">AIML Play</span>
        </div>

        <div className="px-6 pb-4">
          <div className="bg-maroon-50 rounded-xl p-4 border border-maroon-100">
            <p className="text-sm text-maroon-800 font-medium">Level {Math.floor((profile?.xp || 0) / 100) + 1}</p>
            <div className="w-full bg-maroon-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-maroon-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${((profile?.xp || 0) % 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-maroon-600 mt-2 font-medium">{profile?.xp || 0} XP Total</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative ${
                  isActive 
                    ? 'text-maroon-700 font-medium' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 bg-maroon-50 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon size={20} className="relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="max-w-7xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
