import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Network, GitMerge, Target } from 'lucide-react';

const GAMES = [
  {
    id: 'decision-tree',
    title: 'Decision Tree Builder',
    description: 'Drag and drop nodes to build a decision tree that classifies data correctly.',
    icon: GitMerge,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    path: '/games/decision-tree'
  },
  {
    id: 'classification',
    title: 'Classification Game',
    description: 'Act as a classifier! Draw boundaries to separate different classes of data points.',
    icon: Target,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    path: '/games/classification'
  },
  {
    id: 'neural-network',
    title: 'Neural Network Visualizer',
    description: 'Connect layers and watch forward propagation in action.',
    icon: Network,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    path: '/games/neural-network'
  }
];

export default function GamesList() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Mini Games</h1>
        <p className="text-slate-500 mt-2">Learn AI concepts through interactive gameplay.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GAMES.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className="p-8">
              <div className={`w-16 h-16 rounded-2xl ${game.bg} ${game.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <game.icon size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">{game.title}</h2>
              <p className="text-slate-600 mb-8 line-clamp-2">{game.description}</p>
              
              <Link
                to={game.path}
                className="inline-flex w-full justify-center items-center py-3 bg-slate-50 text-slate-900 font-medium rounded-xl group-hover:bg-maroon-600 group-hover:text-white transition-colors"
              >
                Play Game
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
