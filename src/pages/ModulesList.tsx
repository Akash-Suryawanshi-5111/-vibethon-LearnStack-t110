import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Lock, PlayCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const MODULES = [
  {
    id: 'intro-ml',
    title: 'Introduction to Machine Learning',
    description: 'Learn the difference between supervised, unsupervised, and reinforcement learning.',
    level: 'Beginner',
    xp: 100,
    duration: '15 min',
  },
  {
    id: 'decision-trees',
    title: 'Decision Trees & Random Forests',
    description: 'Understand how tree-based models make decisions by splitting data.',
    level: 'Beginner',
    xp: 150,
    duration: '25 min',
  },
  {
    id: 'neural-networks',
    title: 'Neural Networks Basics',
    description: 'Dive into perceptrons, hidden layers, and activation functions.',
    level: 'Intermediate',
    xp: 200,
    duration: '40 min',
  },
  {
    id: 'cnn',
    title: 'Convolutional Neural Networks',
    description: 'Learn how AI sees images using filters and pooling layers.',
    level: 'Advanced',
    xp: 300,
    duration: '60 min',
  }
];

export default function ModulesList() {
  const { profile } = useAuthStore();
  const completed = profile?.completedModules || [];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Learning Path</h1>
        <p className="text-slate-500 mt-2">Master AI concepts step by step.</p>
      </header>

      <div className="grid gap-6">
        {MODULES.map((mod, index) => {
          const isCompleted = completed.includes(mod.id);
          const isLocked = index > 0 && !completed.includes(MODULES[index - 1].id) && !isCompleted;

          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white p-6 rounded-2xl border ${
                isCompleted ? 'border-green-200' : isLocked ? 'border-slate-200 opacity-75' : 'border-maroon-200 shadow-md shadow-maroon-50'
              }`}
            >
              <div className="flex items-start gap-6">
                <div className={`p-4 rounded-xl shrink-0 ${
                  isCompleted ? 'bg-green-50 text-green-600' : isLocked ? 'bg-slate-100 text-slate-400' : 'bg-maroon-50 text-maroon-600'
                }`}>
                  {isCompleted ? <CheckCircle2 size={32} /> : isLocked ? <Lock size={32} /> : <BookOpen size={32} />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      mod.level === 'Beginner' ? 'bg-blue-50 text-blue-700' :
                      mod.level === 'Intermediate' ? 'bg-amber-50 text-amber-700' :
                      'bg-purple-50 text-purple-700'
                    }`}>
                      {mod.level}
                    </span>
                    <span className="text-sm text-slate-500 font-medium">{mod.duration}</span>
                    <span className="text-sm text-amber-600 font-bold">+{mod.xp} XP</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">{mod.title}</h2>
                  <p className="text-slate-600 mb-4">{mod.description}</p>
                  
                  {!isLocked ? (
                    <Link
                      to={`/modules/${mod.id}`}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-colors ${
                        isCompleted 
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                          : 'bg-maroon-600 text-white hover:bg-maroon-700'
                      }`}
                    >
                      {isCompleted ? 'Review Module' : 'Start Learning'}
                      <PlayCircle size={18} />
                    </Link>
                  ) : (
                    <button disabled className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-slate-100 text-slate-400 cursor-not-allowed">
                      Locked
                      <Lock size={18} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
