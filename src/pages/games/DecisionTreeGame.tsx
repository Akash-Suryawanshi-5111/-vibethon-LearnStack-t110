import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, BrainCircuit, CheckCircle2, AlertTriangle,
  Lightbulb, SlidersHorizontal, ChevronDown, RefreshCw, BarChart2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

// --- Curriculum Data with Interactive Modes ---
const LEVELS = [
  {
    id: 'purity-intro',
    type: 'mcq',
    title: 'Level 1: The Core Idea (Purity)',
    concept: 'A Decision Tree asks questions to separate data into "pure" groups.',
    scenario: "You have a room of 10 Dogs and 10 Cats. You need ONE rule to separate them perfectly.",
    hint: "Think about a feature that is 100% exclusive to one animal in this list.",
    question: "Which feature gives us the highest Purity?",
    // ADDED THESE TWO LINES:
    beforeVisual: '🐶🐱🐶🐱🐶🐱', 
    beforeGini: '0.50 (Max Impurity)',
    options: [
      { 
        label: "Weight > 10 lbs", 
        correct: false, 
        feedback: "Many cats and dogs weigh more than 10 lbs. The groups are still mixed.",
        teacherMode: "Weight is a continuous variable with high overlap between small dogs and large cats. This results in a high Gini Impurity (bad split).",
        visual: { left: '🐶🐱🐶🐱', right: '🐶🐱🐶🐱', purity: '50%' }
      },
      { 
        label: "Species == 'Feline'", 
        correct: true, 
        feedback: "Perfect! This creates two 100% pure groups.",
        teacherMode: "By using an exact categorical match, you've achieved a Gini Impurity of 0.0 (perfect purity) for both child nodes.",
        visual: { left: '🐱🐱🐱🐱', right: '🐶🐶🐶🐶', purity: '100%' }
      }
    ]
  },
  {
    id: 'interactive-split',
    type: 'interactive',
    title: 'Level 2: Interactive Split (Live Math)',
    concept: 'Adjust the threshold to see how it affects Gini Impurity.',
    scenario: "We have 150 Iris flowers. Setosa petals are very small. Drag the slider to find the perfect split for Petal Length.",
    hint: "Move the slider until the Left Node reaches 100% Purity (Gini = 0.00).",
    targetThreshold: 2.45,
    min: 1.0,
    max: 7.0
  },
  {
    id: 'overfitting',
    type: 'mcq',
    title: 'Level 3: The Danger Zone',
    concept: 'If we let a tree grow forever, it memorizes noise.',
    scenario: "A tree makes a crazy rule: 'If Petal Length == 4.81cm AND Sepal Width == 2.13cm -> Virginica' to classify ONE anomalous flower.",
    hint: "Does memorizing a single weird flower help us predict future normal flowers?",
    question: "Should we allow the tree to make this rule?",
    // ADDED THESE TWO LINES:
    beforeVisual: '🌸🌺🌸🌺🌸 ⚠️ 🌺', 
    beforeGini: '0.05 (Mostly Pure, 1 Anomaly)',
    options: [
      { 
        label: "Yes, 100% accuracy on training data is the goal.", 
        correct: false, 
        feedback: "No! If you memorize anomalies, your model will fail in the real world.",
        teacherMode: "This is 'Overfitting'. The model has high variance and will perform terribly on test data.",
        visual: { left: '🧶 Spaghetti Rule', right: 'Poor Generalization', purity: '100% (Fake)' }
      },
      { 
        label: "No, this causes Overfitting. We should prune the tree.", 
        correct: true, 
        feedback: "Exactly! We use 'Pruning' or set a 'Max Depth'.",
        teacherMode: "By limiting the tree depth, we sacrifice a tiny bit of training accuracy to gain massive generalizability to unseen data.",
        visual: { left: '🌳 Robust Tree', right: 'High Generalization', purity: '95% (Realistic)' }
      }
    ]
  }
];

export default function DecisionTreeGame() {
  const navigate = useNavigate();
  const { updateXp } = useAuthStore();

  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showTeacher, setShowTeacher] = useState(false);

  // Interactive Slider State
  const [sliderValue, setSliderValue] = useState(4.0);

  // Scoring
  const [isComplete, setIsComplete] = useState(false);
  const [masteryScores, setMasteryScores] = useState({ accuracy: 100, concepts: 100 });
  const [mistakes, setMistakes] = useState(0);

  const level = LEVELS[currentLevel];

  // Dynamic Gini Math for Level 2
  const calcInteractiveStats = (val: number) => {
    // Simulated Iris data distribution based on Petal Length
    let leftSetosa = 50, leftVersi = 0, leftVirg = 0;
    let rightSetosa = 0, rightVersi = 50, rightVirg = 50;

    if (val < 2.0) { leftSetosa = 10; rightSetosa = 40; }
    else if (val >= 2.0 && val < 2.5) { leftSetosa = 50; rightSetosa = 0; }
    else if (val >= 2.5 && val < 4.5) { leftVersi = Math.floor((val - 2.5) * 20); rightVersi = 50 - leftVersi; }
    else if (val >= 4.5) { leftVersi = 50; leftVirg = Math.floor((val - 4.5) * 20); rightVirg = 50 - leftVirg; rightVersi = 0; }

    const leftTotal = leftSetosa + leftVersi + leftVirg || 1; // prevent /0
    const rightTotal = rightSetosa + rightVersi + rightVirg || 1;

    // Gini = 1 - sum(p_i^2)
    const leftGini = 1 - Math.pow(leftSetosa / leftTotal, 2) - Math.pow(leftVersi / leftTotal, 2) - Math.pow(leftVirg / leftTotal, 2);
    const rightGini = 1 - Math.pow(rightSetosa / rightTotal, 2) - Math.pow(rightVersi / rightTotal, 2) - Math.pow(rightVirg / rightTotal, 2);

    // Weighted Average Gini for the split
    const avgGini = ((leftTotal / 150) * leftGini) + ((rightTotal / 150) * rightGini);

    return { leftGini: leftGini.toFixed(2), rightGini: rightGini.toFixed(2), avgGini: avgGini.toFixed(2), leftTotal, rightTotal };
  };

  const interactiveStats = level.type === 'interactive' ? calcInteractiveStats(sliderValue) : null;
  const isInteractiveCorrect = level.type === 'interactive' && sliderValue >= 2.0 && sliderValue <= 2.8;

  const handleSelect = (idx: number, isCorrect: boolean) => {
    setSelectedOption(idx);
    setShowFeedback(true);
    if (!isCorrect) {
      setMistakes(m => m + 1);
      setMasteryScores(prev => ({ ...prev, accuracy: Math.max(0, prev.accuracy - 15) }));
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
    setSliderValue(4.0);
  };

  const renderVisualization = () => {
    if (level.type === 'mcq') {
      const opt = selectedOption !== null && level.options ? level.options[selectedOption] : null;

      return (
        <div className="flex flex-col w-full h-full justify-center">
          {/* Before Split */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Before Split (Target Node)</h4>
            <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl text-center">
               <span className="text-2xl">{level.beforeVisual}</span>
               <div className="text-xs text-slate-500 mt-2 font-mono">Gini = {level.beforeGini}</div>
            </div>
          </div>

          <div className="flex justify-center my-2 text-slate-300">
            <div className="w-px h-8 bg-slate-300"></div>
          </div>

          {/* After Split */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">After Split (Child Nodes)</h4>
            {opt && showFeedback ? (
              <div className="flex gap-4">
                <div className={`flex-1 p-4 rounded-xl border ${opt.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="text-center text-2xl">{opt.visual.left}</div>
                  <div className={`text-xs text-center mt-2 font-mono font-bold ${opt.correct ? 'text-emerald-600' : 'text-red-500'}`}>
                    Purity: {opt.visual.purity}
                  </div>
                </div>
                <div className={`flex-1 p-4 rounded-xl border ${opt.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="text-center text-2xl">{opt.visual.right}</div>
                  <div className={`text-xs text-center mt-2 font-mono font-bold ${opt.correct ? 'text-emerald-600' : 'text-red-500'}`}>
                    Purity: {opt.visual.purity}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 p-8 rounded-xl text-center text-slate-400 font-medium">
                Waiting for your split rule...
              </div>
            )}
          </div>
        </div>
      );
    }

    if (level.type === 'interactive' && interactiveStats) {
      return (
        <div className="flex flex-col w-full">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Live Tree Visualization</h4>

          <div className="bg-white border border-slate-200 p-4 rounded-xl mb-6 text-center shadow-sm">
            <div className="font-bold text-slate-700">Root: All Iris (150 Data Points)</div>
            <div className="text-xs font-mono text-slate-500 mt-1">Initial Gini: 0.66</div>
          </div>

          <div className="flex items-center justify-center mb-6">
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
              Petal Length &lt; {sliderValue.toFixed(1)} cm
            </span>
          </div>

          <div className="flex gap-4 relative">
            {/* Lines */}
            <svg className="absolute w-full h-8 -top-10 left-0" style={{ zIndex: 0 }}>
              <path d="M 50% 0 L 25% 40" stroke="#cbd5e1" strokeWidth="2" fill="none" />
              <path d="M 50% 0 L 75% 40" stroke="#cbd5e1" strokeWidth="2" fill="none" />
            </svg>

            <div className={`flex-1 p-4 rounded-xl border-2 transition-colors ${Number(interactiveStats.leftGini) === 0 ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-slate-200'}`}>
              <div className="font-bold text-slate-700 text-sm mb-1">True (Left Node)</div>
              <div className="text-xs text-slate-500 mb-3">{interactiveStats.leftTotal} samples</div>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-1">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(1 - Number(interactiveStats.leftGini)) * 100}%` }}></div>
              </div>
              <div className="text-xs font-mono font-bold">Gini: {interactiveStats.leftGini}</div>
            </div>

            <div className="flex-1 p-4 rounded-xl border-2 bg-white border-slate-200">
              <div className="font-bold text-slate-700 text-sm mb-1">False (Right Node)</div>
              <div className="text-xs text-slate-500 mb-3">{interactiveStats.rightTotal} samples</div>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-1">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(1 - Number(interactiveStats.rightGini)) * 100}%` }}></div>
              </div>
              <div className="text-xs font-mono font-bold">Gini: {interactiveStats.rightGini}</div>
            </div>
          </div>

          <div className="mt-8 bg-slate-100 p-4 rounded-xl text-center border border-slate-200">
            <div className="text-sm font-medium text-slate-500">Overall Split Quality (Weighted Gini)</div>
            <div className={`text-2xl font-black ${Number(interactiveStats.avgGini) < 0.4 ? 'text-emerald-600' : 'text-slate-700'}`}>
              {interactiveStats.avgGini}
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
            <span className="text-indigo-600 font-bold">{masteryScores.accuracy}%</span>
          </div>
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            <BarChart2 size={20} />
          </div>
        </div>
      </header>

      {!isComplete ? (
        <div className="grid lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: Educational Content & Interactions */}
          <div className="lg:col-span-7 space-y-6">

            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-full text-sm">Level {currentLevel + 1} / {LEVELS.length}</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{level.title}</h1>
              <p className="text-slate-600 text-lg leading-relaxed">{level.concept}</p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <p className="text-slate-700 font-medium">{level.scenario}</p>
                {!showHint && (
                  <button onClick={() => setShowHint(true)} className="shrink-0 text-amber-500 bg-amber-50 p-2 rounded-lg hover:bg-amber-100 transition-colors tooltip" title="Need a hint?">
                    <Lightbulb size={20} />
                  </button>
                )}
              </div>

              <AnimatePresence>
                {showHint && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6">
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
                            disabled={showFeedback && level.options[selectedOption!].correct}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium
                              ${showSuccess ? 'border-emerald-500 bg-emerald-50 text-emerald-800' :
                                showError ? 'border-red-500 bg-red-50 text-red-800' :
                                  'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 bg-white text-slate-700'}`}
                          >
                            {opt.label}
                          </button>

                          {/* Try Wrong Path / Feedback Area */}
                          {showFeedback && isSelected && (
                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className={`text-sm p-3 rounded-lg flex items-start gap-2 ${opt.correct ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {opt.correct ? <CheckCircle2 size={18} className="mt-0.5" /> : <AlertTriangle size={18} className="mt-0.5" />}
                              <div>
                                <p className="font-bold">{opt.correct ? 'Correct!' : 'Wait, look at the result:'}</p>
                                <p>{opt.feedback}</p>
                              </div>
                            </motion.div>
                          )}

                          {/* Teacher Mode Dropdown */}
                          {showFeedback && isSelected && (
                            <div className="mt-2">
                              <button onClick={() => setShowTeacher(!showTeacher)} className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800">
                                [ Why this happens? <ChevronDown size={14} className={showTeacher ? "rotate-180 transition-transform" : "transition-transform"} /> ]
                              </button>
                              {showTeacher && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm bg-indigo-50 border border-indigo-100 p-3 rounded-lg text-indigo-800 mt-2 font-medium">
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

              {/* INTERACTIVE Mode (Slider) */}
              {level.type === 'interactive' && (
                <div className="space-y-6 mt-4">
                  <div className="flex items-center gap-3 text-slate-700 font-bold">
                    <SlidersHorizontal size={20} className="text-indigo-500" />
                    Set Threshold for: <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Petal Length</span>
                  </div>

                  <div className="px-2">
                    <input
                      type="range"
                      min={level.min}
                      max={level.max}
                      step="0.1"
                      value={sliderValue}
                      onChange={(e) => setSliderValue(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs font-bold text-slate-400 mt-2">
                      <span>{level.min}cm</span>
                      <span className="text-indigo-600 text-base">{sliderValue.toFixed(1)} cm</span>
                      <span>{level.max}cm</span>
                    </div>
                  </div>

                  {/* Auto-success detection for interactive mode */}
                  <AnimatePresence>
                    {isInteractiveCorrect && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 flex items-start gap-3">
                        <CheckCircle2 className="shrink-0 mt-0.5 text-emerald-600" size={20} />
                        <div>
                          <p className="font-bold">Perfect Split Found!</p>
                          <p className="text-sm mt-1">At ~2.4cm, you achieve a Gini Impurity of 0.00 on the left node. You perfectly isolated all 50 Setosa flowers!</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Next Button */}
              <AnimatePresence>
                {((level.type === 'mcq' && showFeedback && level.options![selectedOption!].correct) ||
                  (level.type === 'interactive' && isInteractiveCorrect)) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                      <button onClick={handleNext} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors shadow-lg">
                        {currentLevel < LEVELS.length - 1 ? 'Next Concept' : 'Finish Course'}
                      </button>
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT COLUMN: Visualizations */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-inner flex flex-col justify-center min-h-[500px]">
            {renderVisualization()}
          </div>

        </div>
      ) : (
        /* Completion Screen */
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto bg-white p-12 rounded-3xl border border-slate-200 shadow-xl text-center">
          <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <BrainCircuit size={48} />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Mastery Achieved!</h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
              <div className="text-slate-500 font-bold mb-1 uppercase text-xs">Concept Mastery</div>
              <div className="text-4xl font-black text-indigo-600">{masteryScores.accuracy}%</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl">
              <div className="text-emerald-700 font-bold mb-1 uppercase text-xs">XP Earned</div>
              <div className="text-4xl font-black text-emerald-600">+{Math.max(50, 200 - (mistakes * 25))}</div>
            </div>
          </div>

          <p className="text-slate-600 mb-8 leading-relaxed max-w-lg mx-auto">
            You now understand how to calculate Purity, how algorithms physically adjust thresholds to find the best Gini score, and why Overfitting is dangerous.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => { setCurrentLevel(0); resetLevelState(); setIsComplete(false); setMistakes(0); setMasteryScores({ accuracy: 100, concepts: 100 }); }} className="px-8 py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
              <RefreshCw size={20} /> Replay Experiment
            </button>
            <button onClick={() => navigate('/playground')} className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg flex items-center justify-center gap-2">
              Free Play Mode (Sandbox)
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
