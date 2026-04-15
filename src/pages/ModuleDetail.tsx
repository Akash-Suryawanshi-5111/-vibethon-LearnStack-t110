import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Play } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

// Mock content for demonstration
const MODULE_CONTENT: Record<string, any> = {
  'intro-ml': {
    title: 'Introduction to Machine Learning',
    sections: [
      {
        title: 'What is Machine Learning?',
        content: 'Machine learning is a branch of artificial intelligence (AI) and computer science which focuses on the use of data and algorithms to imitate the way that humans learn, gradually improving its accuracy.',
      },
      {
        title: 'Types of Machine Learning',
        content: 'There are three main types: Supervised Learning (labeled data), Unsupervised Learning (unlabeled data), and Reinforcement Learning (learning by trial and error).',
      }
    ]
  }
};

export default function ModuleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { completeModule } = useAuthStore();
  const [currentSection, setCurrentSection] = useState(0);
  
  const moduleData = MODULE_CONTENT[id || 'intro-ml'] || MODULE_CONTENT['intro-ml'];

  const handleComplete = async () => {
    if (id) {
      await completeModule(id);
      navigate('/modules');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <button 
        onClick={() => navigate('/modules')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Modules
      </button>

      <header>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{moduleData.title}</h1>
        <div className="flex gap-2">
          {moduleData.sections.map((_: any, idx: number) => (
            <div 
              key={idx} 
              className={`h-2 flex-1 rounded-full ${idx <= currentSection ? 'bg-maroon-600' : 'bg-slate-200'}`}
            />
          ))}
        </div>
      </header>

      <motion.div
        key={currentSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {moduleData.sections[currentSection].title}
        </h2>
        <p className="text-lg text-slate-700 leading-relaxed mb-8">
          {moduleData.sections[currentSection].content}
        </p>

        <div className="flex justify-end pt-6 border-t border-slate-100">
          {currentSection < moduleData.sections.length - 1 ? (
            <button
              onClick={() => setCurrentSection(s => s + 1)}
              className="flex items-center gap-2 px-6 py-3 bg-maroon-600 text-white rounded-xl font-medium hover:bg-maroon-700 transition-colors"
            >
              Next Section <Play size={18} />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              Complete Module <CheckCircle2 size={18} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
