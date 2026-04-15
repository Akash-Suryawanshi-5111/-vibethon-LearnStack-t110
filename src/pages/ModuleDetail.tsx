import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle2, Play, Database, BrainCircuit, Target, 
  SplitSquareHorizontal, Network, Layers, Image as ImageIcon, ArrowRight, Grid 
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

// Enhanced content with Concepts, Examples, and Visual Aids
const MODULE_CONTENT: Record<string, any> = {
  'intro-ml': {
    title: 'Introduction to Machine Learning',
    sections: [
      {
        title: 'What is Machine Learning?',
        content: (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl text-indigo-900">
              <strong className="font-black uppercase tracking-wider text-xs block mb-1">📚 Concept</strong>
              Machine Learning (ML) is a branch of AI where systems automatically learn and improve from experience without being explicitly programmed. Instead of writing rules, we feed data to an algorithm.
            </div>
            
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl text-slate-700">
              <strong className="font-black uppercase tracking-wider text-xs block mb-1 text-slate-500">💡 Example Use-Case</strong>
              <strong>Spam Filters:</strong> Instead of writing 10,000 "if/else" statements for every possible scam word, an ML model looks at 100,000 past emails, finds the hidden mathematical patterns of "spam," and learns to block new variations automatically.
            </div>

            <div>
              <strong className="font-black uppercase tracking-wider text-xs block mb-3 text-slate-500">📊 Visual Aid: The ML Pipeline</strong>
              <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm gap-4">
                <div className="flex flex-col items-center text-center w-24">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2"><Database size={28} /></div>
                  <span className="text-sm font-bold text-slate-700">1. Data</span>
                </div>
                <ArrowRight className="text-slate-300 rotate-90 md:rotate-0" size={32} />
                <div className="flex flex-col items-center text-center w-24">
                  <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-2"><BrainCircuit size={28} /></div>
                  <span className="text-sm font-bold text-slate-700">2. Model</span>
                </div>
                <ArrowRight className="text-slate-300 rotate-90 md:rotate-0" size={32} />
                <div className="flex flex-col items-center text-center w-24">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2"><Target size={28} /></div>
                  <span className="text-sm font-bold text-slate-700">3. Predict</span>
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        title: 'Types of Learning',
        content: (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl text-indigo-900">
               <strong className="font-black uppercase tracking-wider text-xs block mb-1">📚 Concept</strong>
               Algorithms learn differently depending on the data. <strong>Supervised Learning</strong> uses data that already has the answers (labels). <strong>Unsupervised Learning</strong> looks at raw, unlabeled data to find hidden clusters.
            </div>
            
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl text-slate-700">
              <strong className="font-black uppercase tracking-wider text-xs block mb-1 text-slate-500">💡 Example Use-Case</strong>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Supervised:</strong> Predicting house prices based on Square Footage (Input) and exact Past Sale Price (Label/Answer).</li>
                <li><strong>Unsupervised:</strong> Spotify analyzing your listening history to cluster you into a "Vibe" category without pre-labeling you.</li>
              </ul>
            </div>
          </div>
        )
      }
    ]
  },
  'decision-trees': {
    title: 'Decision Trees & Random Forests',
    sections: [
      {
        title: 'The Decision Tree Structure',
        content: (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl text-indigo-900">
              <strong className="font-black uppercase tracking-wider text-xs block mb-1">📚 Concept</strong>
              A Decision Tree makes predictions by asking a series of True/False questions about the data, splitting it into smaller and smaller groups until it reaches a final decision (Leaf Node).
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl text-slate-700">
              <strong className="font-black uppercase tracking-wider text-xs block mb-1 text-slate-500">💡 Example Use-Case</strong>
              <strong>Medical Diagnosis:</strong> A tree might ask "Does patient have a fever?" (Yes/No) -&gt; If Yes, "Is temperature &gt; 102?" -&gt; Leaf Node: "Prescribe Medication A".
            </div>

            <div>
              <strong className="font-black uppercase tracking-wider text-xs block mb-3 text-slate-500">📊 Visual Aid: Tree Splitting</strong>
              <div className="flex flex-col items-center bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="bg-white border-2 border-indigo-500 text-indigo-800 font-bold px-4 py-2 rounded-lg shadow-sm z-10">Income &gt; $50k?</div>
                <div className="w-px h-6 bg-slate-400"></div>
                <div className="w-48 border-t-2 border-slate-400 h-6 flex justify-between relative">
                  <div className="absolute top-0 left-0 w-px h-6 bg-slate-400"></div>
                  <div className="absolute top-0 right-0 w-px h-6 bg-slate-400"></div>
                </div>
                <div className="flex w-64 justify-between -mt-2">
                  <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-1 rounded text-sm font-bold">Deny Loan</div>
                  <div className="bg-emerald-100 border border-emerald-300 text-emerald-700 px-3 py-1 rounded text-sm font-bold">Approve Loan</div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    ]
  },
  'neural-networks': {
    title: 'Neural Networks Basics',
    sections: [
      {
        title: 'Network Architecture',
        content: (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl text-indigo-900">
              <strong className="font-black uppercase tracking-wider text-xs block mb-1">📚 Concept</strong>
              Inspired by the human brain, Neural Networks consist of layers of artificial "neurons". They calculate weighted sums of inputs, apply an activation function, and pass the signal forward.
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl text-slate-700">
              <strong className="font-black uppercase tracking-wider text-xs block mb-1 text-slate-500">💡 Example Use-Case</strong>
              <strong>Self-Driving Cars:</strong> The Input Layer receives sensor data (speed, camera pixels, distance). Hidden Layers process shapes (e.g., "that is a stop sign"). The Output Layer executes a command: Brake, Accelerate, or Turn.
            </div>

            <div>
              <strong className="font-black uppercase tracking-wider text-xs block mb-3 text-slate-500">📊 Visual Aid: Deep Learning Layers</strong>
              <div className="flex items-center justify-center gap-8 bg-slate-900 p-8 rounded-2xl overflow-hidden shadow-inner">
                 <div className="flex flex-col gap-3">
                   <div className="text-slate-400 text-xs font-bold text-center mb-2">INPUT</div>
                   {[1,2,3].map(i => <div key={`i${i}`} className="w-6 h-6 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>)}
                 </div>
                 <Network className="text-slate-600 opacity-50 w-12 h-12" />
                 <div className="flex flex-col gap-2">
                   <div className="text-slate-400 text-xs font-bold text-center mb-2">HIDDEN</div>
                   {[1,2,3,4,5].map(i => <div key={`h${i}`} className="w-6 h-6 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>)}
                 </div>
                 <Network className="text-slate-600 opacity-50 w-12 h-12" />
                 <div className="flex flex-col gap-3 justify-center">
                   <div className="text-slate-400 text-xs font-bold text-center mb-2">OUTPUT</div>
                   <div className="w-8 h-8 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] border-2 border-emerald-300"></div>
                 </div>
              </div>
            </div>
          </div>
        )
      }
    ]
  },
  'cnn': {
    title: 'Convolutional Neural Networks',
    sections: [
      {
        title: 'How AI Sees Images',
        content: (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl text-indigo-900">
              <strong className="font-black uppercase tracking-wider text-xs block mb-1">📚 Concept</strong>
              Standard networks flatten images into a single line of pixels, losing spatial context. CNNs preserve the 2D structure by sliding small matrices called <strong>Filters</strong> or <strong>Kernels</strong> across the image to detect physical features (edges, curves, textures).
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl text-slate-700">
              <strong className="font-black uppercase tracking-wider text-xs block mb-1 text-slate-500">💡 Example Use-Case</strong>
              <strong>Medical Tumors:</strong> A CNN scans X-rays. The first layer detects basic edges. The second layer combines edges to find circles. The final layer recognizes the complex, irregular shape of a tumor.
            </div>

            <div>
              <strong className="font-black uppercase tracking-wider text-xs block mb-3 text-slate-500">📊 Visual Aid: The Convolution Operation</strong>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-slate-50 p-8 rounded-2xl border border-slate-200">
                
                <div className="text-center">
                  <div className="grid grid-cols-4 gap-1 mb-2">
                    {[...Array(16)].map((_,i) => <div key={i} className={`w-6 h-6 rounded-sm ${[5,6,9,10].includes(i) ? 'bg-indigo-500 shadow-md transform scale-110' : 'bg-slate-300'}`}></div>)}
                  </div>
                  <span className="text-xs font-bold text-slate-500">Image Pixels</span>
                </div>

                <div className="flex flex-col items-center">
                  <Grid className="text-indigo-600 animate-pulse" size={32} />
                  <span className="text-xs font-bold text-indigo-600 mt-2">Filter Sliding</span>
                </div>

                <div className="text-center">
                  <div className="grid grid-cols-2 gap-1 mb-2 p-2 bg-white rounded shadow-sm border border-slate-200">
                    <div className="w-8 h-8 bg-indigo-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">1</div>
                    <div className="w-8 h-8 bg-indigo-200 rounded-sm flex items-center justify-center text-indigo-800 text-xs font-bold">0</div>
                    <div className="w-8 h-8 bg-indigo-300 rounded-sm flex items-center justify-center text-indigo-800 text-xs font-bold">0</div>
                    <div className="w-8 h-8 bg-indigo-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">1</div>
                  </div>
                  <span className="text-xs font-bold text-slate-500">Feature Map Extracted</span>
                </div>

              </div>
            </div>
          </div>
        )
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
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <button 
        onClick={() => navigate('/modules')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        Back to Learning Path
      </button>

      <header>
        <h1 className="text-4xl font-black text-slate-900 mb-6">{moduleData.title}</h1>
        <div className="flex gap-2">
          {moduleData.sections.map((_: any, idx: number) => (
            <div 
              key={idx} 
              className={`h-2 flex-1 rounded-full transition-colors duration-300 ${idx <= currentSection ? 'bg-indigo-600' : 'bg-slate-200'}`}
            />
          ))}
        </div>
      </header>

      <motion.div
        key={currentSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-sm"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">
          {moduleData.sections[currentSection].title}
        </h2>
        
        {/* Render the rich JSX content */}
        <div className="text-lg text-slate-700 leading-relaxed mb-10">
          {moduleData.sections[currentSection].content}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
          <span className="text-sm font-bold text-slate-400">
            Section {currentSection + 1} of {moduleData.sections.length}
          </span>

          {currentSection < moduleData.sections.length - 1 ? (
            <button
              onClick={() => setCurrentSection(s => s + 1)}
              className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Continue <Play size={18} fill="currentColor" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
            >
              Complete Module <CheckCircle2 size={20} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}