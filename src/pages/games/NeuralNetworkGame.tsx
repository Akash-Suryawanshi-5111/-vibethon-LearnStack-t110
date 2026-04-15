import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Network, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function NeuralNetworkGame() {
  const navigate = useNavigate();
  const { updateXp } = useAuthStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [completed, setCompleted] = useState(false);

  const layers = [
    { id: 'input', nodes: 3, label: 'Input Layer' },
    { id: 'hidden1', nodes: 4, label: 'Hidden Layer 1' },
    { id: 'hidden2', nodes: 4, label: 'Hidden Layer 2' },
    { id: 'output', nodes: 2, label: 'Output Layer' }
  ];

  const handleForwardProp = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setCompleted(true);
      updateXp(30);
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <button 
        onClick={() => navigate('/games')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Games
      </button>

      <header className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-50 text-purple-500 mb-4">
          <Network size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Neural Network Visualizer</h1>
        <p className="text-slate-500 mt-2">Watch how data flows through the network layers.</p>
      </header>

      <div className="bg-slate-900 p-12 rounded-3xl shadow-xl relative overflow-hidden min-h-[500px] flex flex-col justify-center">
        <div className="flex justify-between items-center relative z-10">
          {layers.map((layer, layerIdx) => (
            <div key={layer.id} className="flex flex-col items-center gap-8">
              <span className="text-slate-400 text-sm font-medium">{layer.label}</span>
              <div className="flex flex-col gap-6">
                {Array.from({ length: layer.nodes }).map((_, nodeIdx) => (
                  <motion.div
                    key={`${layer.id}-${nodeIdx}`}
                    className={`w-12 h-12 rounded-full border-4 flex items-center justify-center relative z-20 ${
                      layer.id === 'input' ? 'border-blue-500 bg-blue-950' :
                      layer.id === 'output' ? 'border-green-500 bg-green-950' :
                      'border-purple-500 bg-purple-950'
                    }`}
                    animate={isAnimating ? {
                      scale: [1, 1.2, 1],
                      borderColor: ['#3b82f6', '#f43f5e', '#3b82f6'],
                      transition: { delay: layerIdx * 0.5, duration: 0.5 }
                    } : {}}
                  >
                    {isAnimating && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-white opacity-50"
                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                        transition={{ delay: layerIdx * 0.5, duration: 0.5 }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-slate-800/80 backdrop-blur border-t border-slate-700 flex justify-between items-center">
          <div className="text-slate-300">
            {completed ? (
              <span className="text-green-400 font-bold">Forward propagation complete! +30 XP</span>
            ) : (
              <span>Click run to start forward propagation.</span>
            )}
          </div>
          <button
            onClick={handleForwardProp}
            disabled={isAnimating}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <Play size={18} /> {isAnimating ? 'Processing...' : 'Run Network'}
          </button>
        </div>
      </div>
    </div>
  );
}
