import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Code2, Gamepad2, Trophy, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-maroon-200 selection:text-maroon-900">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-maroon-600 p-2 rounded-xl text-white">
            <BrainCircuit size={24} />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">AIML Playground</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2.5 text-slate-600 font-medium hover:text-slate-900 transition-colors">
            Log in
          </Link>
          <Link to="/login" className="px-5 py-2.5 bg-maroon-600 text-white font-medium rounded-xl hover:bg-maroon-700 transition-colors shadow-sm shadow-maroon-200">
            Start Learning
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon-50 text-maroon-700 font-medium text-sm mb-6 border border-maroon-100">
              <span className="flex h-2 w-2 rounded-full bg-maroon-500"></span>
              New: Neural Network Visualizer
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
              Master AI through <span className="text-transparent bg-clip-text bg-gradient-to-r from-maroon-600 to-rose-500">Play.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
              Interactive lessons, real-time coding, and gamified challenges to take you from beginner to AI practitioner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login" className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-maroon-600 text-white font-medium rounded-2xl hover:bg-maroon-700 transition-all hover:shadow-lg hover:shadow-maroon-200 hover:-translate-y-0.5">
                Start Playing Free
                <ArrowRight size={20} />
              </Link>
              <a href="#features" className="inline-flex justify-center items-center px-8 py-4 bg-white text-slate-700 font-medium rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors">
                Explore Features
              </a>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-maroon-100 to-rose-50 rounded-[3rem] transform rotate-3 scale-105 -z-10"></div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <Code2 className="text-maroon-600 mb-4" size={32} />
                  <h3 className="font-bold text-slate-900 mb-2">Live Coding</h3>
                  <p className="text-sm text-slate-500">Write Python and train models right in your browser.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <Gamepad2 className="text-rose-500 mb-4" size={32} />
                  <h3 className="font-bold text-slate-900 mb-2">Mini Games</h3>
                  <p className="text-sm text-slate-500">Learn algorithms visually through interactive games.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 col-span-2 flex items-center gap-6">
                  <div className="bg-amber-100 p-4 rounded-xl text-amber-600">
                    <Trophy size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Gamified Learning</h3>
                    <p className="text-sm text-slate-500">Earn XP, maintain streaks, and climb the leaderboard.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
