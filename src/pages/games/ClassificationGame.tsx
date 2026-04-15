import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Target, CheckCircle2, AlertTriangle, 
  Lightbulb, SlidersHorizontal, ChevronDown, RefreshCw, BarChart2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

// --- Curriculum Data for Classification ---
const LEVELS = [
  {
    id: 'boundary-intro',
    type: 'mcq',
    title: 'Level 1: The Decision Boundary',
    concept: 'Classification algorithms draw a "Boundary" to separate different categories of data.',
    scenario: "You are trying to separate spam emails from normal emails based on the number of suspicious words.",
    hint: "Think about what a model needs to do to categorize new, unseen data correctly.",
    question: "What is the primary goal of a Decision Boundary?",
    beforeVisual: 'boundary-intro',
    options: [
      { 
        label: "To connect all the dots of the same category.", 
        correct: false, 
        feedback: "Connecting dots doesn't tell us what to do with new data points.",
        teacherMode: "Connecting points is more related to graph theory or clustering outlines. In classification, we need a dividing line (or plane) that separates space."
      },
      { 
        label: "To draw a line that splits the space between different categories.", 
        correct: true, 
        feedback: "Exactly! Any new data point falling on one side is Class A, the other side is Class B.",
        teacherMode: "This line is a mathematical function (like y = mx + b). When new data arrives, we plug it into the equation to see which side of zero it falls on."
      }
    ]
  },
  {
    id: 'interactive-linear',
    type: 'interactive',
    title: 'Level 2: Find the Line (Interactive)',
    concept: 'Adjust the threshold to maximize your Classification Accuracy.',
    scenario: "We have Red points (mostly low X values) and Blue points (mostly high X values). Drag the slider to set a vertical decision boundary.",
    hint: "Move the slider to minimize the number of dots caught on the wrong side of the line.",
    min: 0,
    max: 100,
    targetThreshold: 45 // optimal point
  },
  {
    id: 'non-linear',
    type: 'mcq',
    title: 'Level 3: Non-Linear Data',
    concept: 'Sometimes, a straight line simply cannot separate the data.',
    scenario: "Imagine a cluster of Red points surrounded by a ring of Blue points.",
    hint: "If you draw a straight line through a circle, what happens?",
    question: "How can an algorithm classify this data?",
    beforeVisual: 'circular-data',
    options: [
      { 
        label: "Keep trying to draw different straight lines.", 
        correct: false, 
        feedback: "No single straight line can separate a ring from its center.",
        teacherMode: "A linear classifier (like basic Logistic Regression) will completely fail here, hovering around 50% accuracy."
      },
      { 
        label: "Use a circular/curved boundary or mathematically fold the space.", 
        correct: true, 
        feedback: "Yes! Advanced algorithms can draw circles or transform the data into 3D to separate it.",
        teacherMode: "This is often done using the 'Kernel Trick' in Support Vector Machines (SVMs) or by using Neural Networks."
      }
    ]
  },
  {
    id: 'overfitting-boundary',
    type: 'mcq',
    title: 'Level 4: The Squiggly Line',
    concept: 'A boundary that perfectly wraps around every single dot is dangerous.',
    scenario: "To get 100% accuracy on training data, the algorithm draws a wildly twisting boundary that loops around every individual point.",
    hint: "Does memorizing the exact position of these specific dots help us with future dots?",
    question: "Is this highly complex boundary a good model?",
    beforeVisual: 'overfit-data',
    options: [
      { 
        label: "Yes, 100% accuracy is always the best outcome.", 
        correct: false, 
        feedback: "If you memorize the exact training points, you are capturing random noise.",
        teacherMode: "A highly squiggly line represents 'High Variance'. It will fail badly when given new, slightly shifted data points."
      },
      { 
        label: "No, it's Overfitting. A smoother line is better.", 
        correct: true, 
        feedback: "Correct! We prefer a simpler boundary that might get 1 or 2 dots wrong but generalizes better.",
        teacherMode: "We use 'Regularization' to penalize overly complex curves, forcing the model to favor simpler, smoother decision boundaries."
      }
    ]
  }
];

// Mock Data for Interactive Level
const INTERACTIVE_POINTS = [
  ...Array.from({ length: 25 }, () => ({ x: Math.random() * 40, type: 'red' })),
  ...Array.from({ length: 5 }, () => ({ x: Math.random() * 20 + 35, type: 'red' })), // overlap
  ...Array.from({ length: 25 }, () => ({ x: Math.random() * 40 + 60, type: 'blue' })),
  ...Array.from({ length: 5 }, () => ({ x: Math.random() * 20 + 45, type: 'blue' })), // overlap
];

export default function ClassificationGame() {
  const navigate = useNavigate();
  const { updateXp } = useAuthStore();
  
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showTeacher, setShowTeacher] = useState(false);
  
  const [sliderValue, setSliderValue] = useState(50);
  const [isComplete, setIsComplete] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [masteryScores, setMasteryScores] = useState({ accuracy: 100 });

  const level = LEVELS[currentLevel];

  // Logic for Interactive Mode
  const calcAccuracy = (threshold: number) => {
    let correct = 0;
    INTERACTIVE_POINTS.forEach(p => {
      // Assuming red is left of threshold, blue is right
      if (p.type === 'red' && p.x <= threshold) correct++;
      if (p.type === 'blue' && p.x > threshold) correct++;
    });
    return Math.round((correct / INTERACTIVE_POINTS.length) * 100);
  };

  const currentAccuracy = level.type === 'interactive' ? calcAccuracy(sliderValue) : 0;
  const isInteractiveCorrect = level.type === 'interactive' && currentAccuracy >= 88; // 88% is considered winning

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
    setSliderValue(50);
  };

  const renderVisuals = () => {
    if (level.type === 'mcq') {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-6">Data Space Visualization</h4>
          
          <div className="relative w-64 h-64 bg-slate-100 rounded-xl border-2 border-slate-200 overflow-hidden shadow-inner">
            {level.beforeVisual === 'boundary-intro' && (
              <>
                {/* Random Points */}
                <div className="absolute top-8 left-8 w-4 h-4 rounded-full bg-red-500"></div>
                <div className="absolute top-12 left-20 w-4 h-4 rounded-full bg-red-500"></div>
                <div className="absolute bottom-12 right-12 w-4 h-4 rounded-full bg-blue-500"></div>
                <div className="absolute bottom-20 right-8 w-4 h-4 rounded-full bg-blue-500"></div>
                
                {showFeedback && level.options[selectedOption!]?.correct ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
                    <svg className="w-full h-full"><line x1="0" y1="256" x2="256" y2="0" stroke="#10b981" strokeWidth="4" strokeDasharray="8 4" /></svg>
                  </motion.div>
                ) : showFeedback ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
                    <svg className="absolute w-full h-full z-0 opacity-50"><polyline points="32,40 200,80 200,200" fill="none" stroke="#ef4444" strokeWidth="2" /></svg>
                  </motion.div>
                ) : null}
              </>
            )}

            {level.beforeVisual === 'circular-data' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-400 opacity-80 z-10 flex items-center justify-center flex-wrap p-2 gap-1">
                   <div className="w-2 h-2 rounded-full bg-red-600"></div>
                   <div className="w-2 h-2 rounded-full bg-red-600"></div>
                   <div className="w-2 h-2 rounded-full bg-red-600"></div>
                </div>
                <div className="absolute w-40 h-40 rounded-full border-[16px] border-blue-400 border-dotted opacity-80"></div>
                
                {showFeedback && level.options[selectedOption!]?.correct ? (
                  <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute w-24 h-24 rounded-full border-4 border-emerald-500 z-20"></motion.div>
                ) : showFeedback ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
                    <svg className="w-full h-full z-20"><line x1="0" y1="128" x2="256" y2="128" stroke="#ef4444" strokeWidth="4" /></svg>
                  </motion.div>
                ) : null}
              </div>
            )}

            {level.beforeVisual === 'overfit-data' && (
              <div className="absolute inset-0 p-4">
                 <div className="w-4 h-4 rounded-full bg-red-500 absolute top-10 left-10"></div>
                 <div className="w-4 h-4 rounded-full bg-red-500 absolute top-40 left-12"></div>
                 <div className="w-4 h-4 rounded-full bg-blue-500 absolute top-20 left-32"></div> {/* Anomaly */}
                 <div className="w-4 h-4 rounded-full bg-blue-500 absolute top-40 right-10"></div>
                 <div className="w-4 h-4 rounded-full bg-blue-500 absolute top-10 right-20"></div>

                 {showFeedback && level.options[selectedOption!]?.correct ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
                    <svg className="w-full h-full"><line x1="100" y1="0" x2="150" y2="256" stroke="#10b981" strokeWidth="4" /></svg>
                  </motion.div>
                ) : (
                  <svg className="absolute inset-0 w-full h-full opacity-70">
                    <path d="M 60,0 Q 80,60 140,80 T 100,160 Q 150,220 120,256" fill="none" stroke="#ef4444" strokeWidth="3" />
                  </svg>
                )}
              </div>
            )}
          </div>
          
          {showFeedback && (
            <p className={`mt-4 font-bold ${level.options?.[selectedOption!]?.correct ? 'text-emerald-600' : 'text-red-500'}`}>
              {level.options?.[selectedOption!]?.correct ? 'Good Generalization' : 'Poor Generalization'}
            </p>
          )}
        </div>
      );
    }

    if (level.type === 'interactive') {
      return (
        <div className="flex flex-col w-full">
           <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 text-center">Live Linear Boundary</h4>
           
           <div className="relative h-64 bg-slate-100 rounded-xl border border-slate-300 w-full overflow-hidden my-4 flex items-center shadow-inner">
              {/* Data Points */}
              {INTERACTIVE_POINTS.map((pt, i) => (
                <div 
                  key={i} 
                  className={`absolute w-3 h-3 rounded-full opacity-80 ${pt.type === 'red' ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ left: `${pt.x}%`, top: `${(i * 7) % 80 + 10}%` }}
                />
              ))}

              {/* Threshold Line */}
              <motion.div 
                className="absolute top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] z-10"
                style={{ left: `${sliderValue}%` }}
              />

              {/* Zones */}
              <div className="absolute inset-0 flex text-xs font-bold text-slate-400 opacity-50 z-0">
                <div className="h-full flex-1 border-r border-dashed border-slate-300 flex items-end justify-center pb-2">Predict RED</div>
                <div className="h-full flex-1 flex items-end justify-center pb-2">Predict BLUE</div>
              </div>
           </div>

           <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-sm flex justify-around">
             <div>
               <div className="text-xs text-slate-500 uppercase font-bold">Boundary Position</div>
               <div className="text-xl font-mono font-bold text-slate-700">X = {sliderValue}</div>
             </div>
             <div>
               <div className="text-xs text-slate-500 uppercase font-bold">Accuracy</div>
               <div className={`text-xl font-mono font-bold ${currentAccuracy >= 88 ? 'text-emerald-600' : 'text-amber-600'}`}>
                 {currentAccuracy}%
               </div>
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
             <span className="text-blue-600 font-bold">{masteryScores.accuracy}%</span>
           </div>
           <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
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
                <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">Level {currentLevel + 1} / {LEVELS.length}</span>
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
                                'border-slate-200 hover:border-blue-300 hover:bg-slate-50 bg-white text-slate-700'}`}
                          >
                            {opt.label}
                          </button>

                          {showFeedback && isSelected && (
                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className={`text-sm p-3 rounded-lg flex items-start gap-2 ${opt.correct ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {opt.correct ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <AlertTriangle size={18} className="mt-0.5 shrink-0" />}
                              <div>
                                <p className="font-bold">{opt.correct ? 'Correct!' : 'Wait, look at the result:'}</p>
                                <p>{opt.feedback}</p>
                              </div>
                            </motion.div>
                          )}

                          {showFeedback && isSelected && (
                             <div className="mt-2">
                               <button onClick={() => setShowTeacher(!showTeacher)} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800">
                                 [ Why this happens? <ChevronDown size={14} className={showTeacher ? "rotate-180 transition-transform" : "transition-transform"} /> ]
                               </button>
                               {showTeacher && (
                                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm bg-blue-50 border border-blue-100 p-3 rounded-lg text-blue-800 mt-2 font-medium">
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
                   <div className="flex items-center gap-3 text-slate-700 font-bold">
                     <SlidersHorizontal size={20} className="text-blue-500" />
                     Slide to adjust the Decision Boundary:
                   </div>
                   
                   <div className="px-2">
                     <input 
                       type="range" min={level.min} max={level.max} step="1"
                       value={sliderValue}
                       onChange={(e) => setSliderValue(Number(e.target.value))}
                       className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                     />
                   </div>

                   <AnimatePresence>
                     {isInteractiveCorrect && (
                       <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 flex items-start gap-3">
                         <CheckCircle2 className="shrink-0 mt-0.5 text-emerald-600" size={20} />
                         <div>
                           <p className="font-bold">Excellent Boundary Found!</p>
                           <p className="text-sm mt-1">You achieved {currentAccuracy}% accuracy. This is the optimal split given the overlapping noise in the center!</p>
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
              )}

              <AnimatePresence>
                {((level.type === 'mcq' && showFeedback && level.options![selectedOption!]?.correct) || 
                  (level.type === 'interactive' && isInteractiveCorrect)) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    <button onClick={handleNext} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg">
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
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Target size={48} />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Mastery Achieved!</h2>
          
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
              <div className="text-slate-500 font-bold mb-1 uppercase text-xs">Concept Mastery</div>
              <div className="text-4xl font-black text-blue-600">{masteryScores.accuracy}%</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl">
              <div className="text-emerald-700 font-bold mb-1 uppercase text-xs">XP Earned</div>
              <div className="text-4xl font-black text-emerald-600">+{Math.max(50, 200 - (mistakes * 25))}</div>
            </div>
          </div>

          <p className="text-slate-600 mb-8 leading-relaxed max-w-lg mx-auto">
            You now understand that Classification algorithms don't just "group" data—they mathematically divide space to make predictions, and simpler boundaries are often better than perfect ones.
          </p>

          <div className="flex justify-center gap-4">
            <button onClick={() => { setCurrentLevel(0); resetLevelState(); setIsComplete(false); setMistakes(0); setMasteryScores({accuracy: 100}); }} className="px-8 py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
              <RefreshCw size={20} /> Replay Course
            </button>
            <button onClick={() => navigate('/games')} className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center gap-2">
               Return to Hub
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}