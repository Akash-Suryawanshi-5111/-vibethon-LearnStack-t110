import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Network, CheckCircle2, AlertTriangle, 
  Lightbulb, SlidersHorizontal, ChevronDown, RefreshCw, BarChart2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

// --- Curriculum Data for Neural Networks ---
const LEVELS = [
  {
    id: 'perceptron-intro',
    type: 'mcq',
    title: 'Level 1: The Perceptron (Single Neuron)',
    concept: 'A single neuron takes inputs, multiplies them by "Weights", and makes a decision.',
    scenario: "A self-driving car neuron looks at two sensors: 'Obstacle Ahead' and 'Green Light'. It needs to decide whether to Brake.",
    hint: "Weights define how important an input is. Should an obstacle make the car brake more or less?",
    question: "How should the network weight these inputs to safely trigger the 'Brake' action?",
    beforeVisual: 'perceptron',
    options: [
      { 
        label: "High Positive Weight for 'Green Light', Low Weight for 'Obstacle'", 
        correct: false, 
        feedback: "This would make the car brake when the light is green and ignore obstacles!",
        teacherMode: "Weights scale the input signal. A high positive weight increases the activation, meaning it encourages the neuron to 'fire' (brake). We want the opposite here."
      },
      { 
        label: "High Positive Weight for 'Obstacle', Negative Weight for 'Green Light'", 
        correct: true, 
        feedback: "Exactly! An obstacle strongly triggers the brake, while a green light suppresses it.",
        teacherMode: "By assigning a negative weight to the green light, the network learns that a green light actively reduces the need to brake. This is basic signal routing!"
      }
    ]
  },
  {
    id: 'interactive-weights',
    type: 'interactive',
    title: 'Level 2: Manual Gradient Descent',
    concept: 'Adjust the Weight and Bias to help the neuron classify a Dog vs. a Cat based on Size.',
    scenario: "We have a Dog (Size = 0.8) and a Cat (Size = 0.2). Tune the Weight and Bias so the neuron outputs > 85% for the Dog, and < 15% for the Cat.",
    hint: "Increase the weight to make the size difference matter more, then slide the bias down to keep the Cat score low.",
    min: -15,
    max: 15
  },
  {
    id: 'hidden-layers',
    type: 'mcq',
    title: 'Level 3: The Power of Hidden Layers',
    concept: 'A single neuron can only draw straight lines. Hidden layers allow networks to learn complex, curvy patterns.',
    scenario: "You want a Neural Network to recognize a human face in a photo.",
    hint: "Can one neuron understand the concept of an 'eye' directly from raw pixels?",
    question: "Why do we need MULTIPLE layers (Deep Learning) for this task?",
    beforeVisual: 'deep-network',
    options: [
      { 
        label: "Because complex patterns require combining simpler patterns step-by-step.", 
        correct: true, 
        feedback: "Yes! Layer 1 finds edges. Layer 2 combines edges into eyes. Layer 3 combines eyes into faces.",
        teacherMode: "This is called 'Hierarchical Feature Extraction'. Each hidden layer transforms the data into a slightly more abstract and useful representation."
      },
      { 
        label: "Because faces have too many pixels for one neuron to hold.", 
        correct: false, 
        feedback: "A single neuron can technically have millions of inputs. The problem is complexity, not capacity.",
        teacherMode: "A single layer, no matter how wide, acts as a linear classifier. It physically cannot solve non-linear problems (like the XOR problem or facial recognition)."
      }
    ]
  },
  {
    id: 'overfitting-nn',
    type: 'mcq',
    title: 'Level 4: Parameter Bloat',
    concept: 'Adding too many layers and neurons causes the network to memorize noise.',
    scenario: "You build a massive network with 10,000 hidden layers just to classify simple handwritten digits.",
    hint: "What happens when a student memorizes the exact answers to a practice test instead of learning the concepts?",
    question: "What is the danger of this massive network?",
    beforeVisual: 'bloated-network',
    options: [
      { 
        label: "It will be incredibly accurate and perform perfectly forever.", 
        correct: false, 
        feedback: "Bigger is not always better. It will fail on new data.",
        teacherMode: "With too many parameters, the network acts like a giant lookup table instead of learning generalizable rules."
      },
      { 
        label: "It will Overfit, memorizing the training data perfectly but failing on new handwriting.", 
        correct: true, 
        feedback: "Correct! Too many parameters allow the network to 'cheat' by memorizing specific pixels.",
        teacherMode: "To prevent this, we use techniques like 'Dropout' (randomly turning off neurons during training) and 'Early Stopping' to force the network to generalize."
      }
    ]
  }
];

export default function NeuralNetworkGame() {
  const navigate = useNavigate();
  const { updateXp } = useAuthStore();
  
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showTeacher, setShowTeacher] = useState(false);
  
  // Interactive Sliders for Level 2
  const [weight, setWeight] = useState(5.0);
  const [bias, setBias] = useState(-2.0);

  // Game State
  const [isComplete, setIsComplete] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [masteryScores, setMasteryScores] = useState({ accuracy: 100 });

  const level = LEVELS[currentLevel];

  // --- Interactive Math Logic (Sigmoid Activation) ---
  const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
  
  // Dog (Input = 0.8), Cat (Input = 0.2)
  const dogZ = (weight * 0.8) + bias;
  const catZ = (weight * 0.2) + bias;
  const dogOutput = Math.round(sigmoid(dogZ) * 100);
  const catOutput = Math.round(sigmoid(catZ) * 100);
  
  // Win condition: Dog > 85%, Cat < 15%
  const isInteractiveCorrect = level.type === 'interactive' && dogOutput >= 85 && catOutput <= 15;

  const handleSelect = (idx: number, isCorrect: boolean) => {
    setSelectedOption(idx);
    setShowFeedback(true);
    if (!isCorrect) {
      setMistakes(m => m + 1);
      setMasteryScores(prev => ({ accuracy: Math.max(0, prev.accuracy - 15) }));
    }
  };

  const handleNext = () => {
    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel(c => c + 1);
      resetLevelState();
    } else {
      setIsComplete(true);
      const earnedXp = Math.max(50, 200 - (mistakes * 25));
      updateXp(earnedXp);
    }
  };

  const resetLevelState = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    setShowHint(false);
    setShowTeacher(false);
    setWeight(5.0);
    setBias(-2.0);
  };

  const renderVisuals = () => {
    if (level.type === 'mcq') {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-6">Network Architecture</h4>
          
          <div className="relative w-full h-64 bg-slate-900 rounded-xl border-2 border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
            
            {level.beforeVisual === 'perceptron' && (
              <div className="flex items-center gap-8">
                <div className="flex flex-col gap-8">
                  <div className="bg-slate-800 text-slate-300 px-3 py-1 rounded border border-slate-700 text-xs font-bold">Obstacle (1.0)</div>
                  <div className="bg-slate-800 text-slate-300 px-3 py-1 rounded border border-slate-700 text-xs font-bold">Green Light (1.0)</div>
                </div>
                
                <div className="relative w-24 h-32">
                  {/* Lines */}
                  <svg className="absolute inset-0 w-full h-full z-0 overflow-visible">
                    <line x1="0" y1="20" x2="100" y2="64" stroke={showFeedback && level.options?.[selectedOption!]?.correct ? "#10b981" : "#475569"} strokeWidth={showFeedback && level.options?.[selectedOption!]?.correct ? "6" : "2"} />
                    <line x1="0" y1="108" x2="100" y2="64" stroke={showFeedback && level.options?.[selectedOption!]?.correct ? "#ef4444" : "#475569"} strokeWidth={showFeedback && level.options?.[selectedOption!]?.correct ? "6" : "2"} />
                  </svg>
                </div>

                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 z-10 transition-colors ${showFeedback && level.options?.[selectedOption!]?.correct ? 'bg-purple-600 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.6)]' : 'bg-slate-800 border-slate-600'}`}>
                  <span className="font-bold text-white text-xs">Brake</span>
                </div>
              </div>
            )}

            {level.beforeVisual === 'deep-network' && (
              <div className="flex items-center gap-6 px-4">
                <div className="flex flex-col gap-2">{[...Array(4)].map((_,i) => <div key={i} className="w-6 h-6 rounded-full bg-blue-500/50 border border-blue-400"></div>)}</div>
                <svg className="w-8 h-32"><line x1="0" y1="64" x2="32" y2="64" stroke="#475569" strokeDasharray="4 2"/></svg>
                <div className="flex flex-col gap-4">{[...Array(3)].map((_,i) => <div key={i} className="w-8 h-8 rounded-full bg-purple-500 border-2 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.4)]"></div>)}</div>
                <svg className="w-8 h-32"><line x1="0" y1="64" x2="32" y2="64" stroke="#475569" strokeDasharray="4 2"/></svg>
                <div className="flex flex-col gap-2">{[...Array(4)].map((_,i) => <div key={i} className="w-6 h-6 rounded-full bg-purple-600/50 border border-purple-400"></div>)}</div>
                <svg className="w-8 h-32"><line x1="0" y1="64" x2="32" y2="64" stroke="#475569" strokeDasharray="4 2"/></svg>
                <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-emerald-400 flex items-center justify-center text-xs">😀</div>
              </div>
            )}

            {level.beforeVisual === 'bloated-network' && (
              <div className="relative w-full h-full flex items-center justify-center opacity-70">
                 <div className="text-center z-10 absolute bg-slate-900/80 p-4 rounded-xl backdrop-blur-sm border border-red-500/50">
                   <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
                   <div className="text-red-400 font-bold text-xs uppercase">Warning: 100M Parameters</div>
                 </div>
                 {/* Spaghetti Lines */}
                 <svg className="absolute inset-0 w-full h-full">
                   {[...Array(50)].map((_, i) => (
                     <line key={i} x1={Math.random()*300} y1={Math.random()*256} x2={Math.random()*300} y2={Math.random()*256} stroke="#ef4444" strokeWidth="1" opacity="0.3" />
                   ))}
                 </svg>
              </div>
            )}

          </div>
          
          {showFeedback && (
            <p className={`mt-4 font-bold ${level.options?.[selectedOption!]?.correct ? 'text-emerald-500' : 'text-red-500'}`}>
              {level.options?.[selectedOption!]?.correct ? 'Optimal Architecture' : 'Sub-optimal Architecture'}
            </p>
          )}
        </div>
      );
    }

    if (level.type === 'interactive') {
      return (
        <div className="flex flex-col w-full">
           <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 text-center">Live Forward Propagation</h4>
           
           <div className="relative h-64 bg-slate-900 rounded-xl border border-slate-800 w-full overflow-hidden my-4 flex flex-col justify-center gap-8 p-6 shadow-inner">
              
              {/* Dog Row */}
              <div className="flex items-center justify-between">
                <div className="text-slate-300 font-bold text-sm w-24">🐶 Size: 0.8</div>
                <div className="flex-1 px-4 relative flex items-center">
                  <div className="w-full h-1 bg-slate-700 absolute"></div>
                  <motion.div className="h-2 bg-emerald-500 absolute rounded shadow-[0_0_8px_rgba(16,185,129,0.8)]" style={{ width: `${dogOutput}%` }} layout />
                </div>
                <div className={`font-mono font-bold w-16 text-right ${dogOutput >= 85 ? 'text-emerald-400' : 'text-slate-500'}`}>{dogOutput}%</div>
              </div>

              {/* Cat Row */}
              <div className="flex items-center justify-between">
                <div className="text-slate-300 font-bold text-sm w-24">🐱 Size: 0.2</div>
                <div className="flex-1 px-4 relative flex items-center">
                  <div className="w-full h-1 bg-slate-700 absolute"></div>
                  <motion.div className="h-2 bg-red-500 absolute rounded shadow-[0_0_8px_rgba(239,68,68,0.8)]" style={{ width: `${catOutput}%` }} layout />
                </div>
                <div className={`font-mono font-bold w-16 text-right ${catOutput <= 15 ? 'text-emerald-400' : 'text-slate-500'}`}>{catOutput}%</div>
              </div>

              <div className="absolute top-4 right-4 text-xs font-mono text-slate-500">
                σ(Weight × Input + Bias)
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-sm">
               <div className="text-xs text-slate-500 uppercase font-bold">Weight (W)</div>
               <div className="text-xl font-mono font-bold text-purple-600">{weight.toFixed(1)}</div>
             </div>
             <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-sm">
               <div className="text-xs text-slate-500 uppercase font-bold">Bias (B)</div>
               <div className="text-xl font-mono font-bold text-blue-600">{bias.toFixed(1)}</div>
             </div>
           </div>
        </div>
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="flex justify-between items-center border-b border-slate-200 pb-6">
        <button onClick={() => navigate('/games')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium">
          <ArrowLeft size={20} /> Back to Hub
        </button>
        <div className="flex items-center gap-4">
           <div className="flex flex-col text-right">
             <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Concept Mastery</span>
             <span className="text-purple-600 font-bold">{masteryScores.accuracy}%</span>
           </div>
           <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
             <BarChart2 size={20} />
           </div>
        </div>
      </header>

      {!isComplete ? (
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Educational Content */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full text-sm">Level {currentLevel + 1} / {LEVELS.length}</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{level.title}</h1>
              <p className="text-slate-600 text-lg leading-relaxed">{level.concept}</p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <p className="text-slate-700 font-medium">{level.scenario}</p>
                {!showHint && (
                  <button onClick={() => setShowHint(true)} className="shrink-0 text-amber-500 bg-amber-50 p-2 rounded-lg hover:bg-amber-100 transition-colors tooltip">
                    <Lightbulb size={20} />
                  </button>
                )}
              </div>

              <AnimatePresence>
                {showHint && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 overflow-hidden">
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex gap-3 text-sm font-medium">
                      <Lightbulb className="shrink-0" size={18} /> {level.hint}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* MCQ Mode */}
              {level.type === 'mcq' && (
                <>
                  <h3 className="font-bold text-xl text-slate-900 mb-4">{level.question}</h3>
                  <div className="space-y-3">
                    {level.options?.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const showSuccess = showFeedback && isSelected && opt.correct;
                      const showError = showFeedback && isSelected && !opt.correct;
                      
                      return (
                        <div key={idx} className="space-y-2">
                          <button
                            onClick={() => handleSelect(idx, opt.correct)}
                            disabled={showFeedback && level.options![selectedOption!]?.correct}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium
                              ${showSuccess ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 
                                showError ? 'border-red-500 bg-red-50 text-red-800' : 
                                'border-slate-200 hover:border-purple-300 hover:bg-slate-50 bg-white text-slate-700'}`}
                          >
                            {opt.label}
                          </button>

                          {showFeedback && isSelected && (
                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className={`text-sm p-3 rounded-lg flex items-start gap-2 ${opt.correct ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {opt.correct ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <AlertTriangle size={18} className="mt-0.5 shrink-0" />}
                              <div>
                                <p className="font-bold">{opt.correct ? 'Correct!' : 'Wait, look at the math:'}</p>
                                <p>{opt.feedback}</p>
                              </div>
                            </motion.div>
                          )}

                          {showFeedback && isSelected && (
                             <div className="mt-2">
                               <button onClick={() => setShowTeacher(!showTeacher)} className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:text-purple-800">
                                 [ Why this happens? <ChevronDown size={14} className={showTeacher ? "rotate-180 transition-transform" : "transition-transform"} /> ]
                               </button>
                               {showTeacher && (
                                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm bg-purple-50 border border-purple-100 p-3 rounded-lg text-purple-800 mt-2 font-medium">
                                   {opt.teacherMode}
                                 </motion.div>
                               )}
                             </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* INTERACTIVE Mode */}
              {level.type === 'interactive' && (
                <div className="space-y-6 mt-4">
                   
                   <div className="px-2 space-y-6">
                     <div>
                       <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
                         <span>Weight (Slope)</span>
                         <span className="text-purple-600">{weight.toFixed(1)}</span>
                       </div>
                       <input 
                         type="range" min={level.min} max={level.max} step="0.5"
                         value={weight}
                         onChange={(e) => setWeight(Number(e.target.value))}
                         className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                       />
                     </div>

                     <div>
                       <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
                         <span>Bias (Threshold Shift)</span>
                         <span className="text-blue-600">{bias.toFixed(1)}</span>
                       </div>
                       <input 
                         type="range" min={level.min} max={level.max} step="0.5"
                         value={bias}
                         onChange={(e) => setBias(Number(e.target.value))}
                         className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                       />
                     </div>
                   </div>

                   <AnimatePresence>
                     {isInteractiveCorrect && (
                       <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 flex items-start gap-3">
                         <CheckCircle2 className="shrink-0 mt-0.5 text-emerald-600" size={20} />
                         <div>
                           <p className="font-bold">Neural Pathway Established!</p>
                           <p className="text-sm mt-1">You manually performed Gradient Descent! The high weight amplifies the size difference, and the negative bias prevents the Cat from triggering the neuron.</p>
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
              )}

              <AnimatePresence>
                {((level.type === 'mcq' && showFeedback && level.options?.[selectedOption!]?.correct) || 
                  (level.type === 'interactive' && isInteractiveCorrect)) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    <button onClick={handleNext} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-600 transition-colors shadow-lg">
                      {currentLevel < LEVELS.length - 1 ? 'Next Concept' : 'Finish Course'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT COLUMN: Visualizations */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-inner flex flex-col justify-center min-h-[500px]">
             {renderVisuals()}
          </div>
        </div>
      ) : (
        /* Completion Screen */
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto bg-white p-12 rounded-3xl border border-slate-200 shadow-xl text-center">
          <div className="w-24 h-24 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Network size={48} />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Mastery Achieved!</h2>
          
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
              <div className="text-slate-500 font-bold mb-1 uppercase text-xs">Concept Mastery</div>
              <div className="text-4xl font-black text-purple-600">{masteryScores.accuracy}%</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl">
              <div className="text-emerald-700 font-bold mb-1 uppercase text-xs">XP Earned</div>
              <div className="text-4xl font-black text-emerald-600">+{Math.max(50, 200 - (mistakes * 25))}</div>
            </div>
          </div>

          <p className="text-slate-600 mb-8 leading-relaxed max-w-lg mx-auto">
            You now understand the fundamental building blocks of Deep Learning: how Weights and Biases shape decisions, why Hidden Layers decode complexity, and why we must protect against Overfitting.
          </p>

          <div className="flex justify-center gap-4">
            <button onClick={() => { setCurrentLevel(0); resetLevelState(); setIsComplete(false); setMistakes(0); setMasteryScores({accuracy: 100}); }} className="px-8 py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
              <RefreshCw size={20} /> Replay Course
            </button>
            <button onClick={() => navigate('/games')} className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg flex items-center justify-center gap-2">
               Return to Hub
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}