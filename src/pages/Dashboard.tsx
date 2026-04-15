import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { Flame, Trophy, BookOpen, Star, ArrowRight, Target, History, BrainCircuit, CheckCircle2, XCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const TOTAL_MODULES = 4;

// Shared Quiz Data (Needed to render the explanations in the analysis view)
const QUIZZES: Record<string, { title: string; questions: any[] }> = {
  'intro-ml': {
    title: 'Intro to ML Quiz',
    questions: [
      { q: "What is the primary characteristic of Supervised Learning?", options: ["It uses unlabeled data to find hidden patterns", "It uses a dataset with known labels or targets", "It learns strictly through trial and error", "It does not require any training data"], a: 1, explanation: "Supervised learning relies on labeled training data (inputs paired with the correct outputs/targets) to teach the model how to make predictions." },
      { q: "Which of these is a classic example of Unsupervised Learning?", options: ["Customer Segmentation (Clustering)", "Predicting house prices", "Spam email classification", "Self-driving car navigation"], a: 0, explanation: "Customer segmentation groups data based on hidden similarities without pre-existing labels, which is the definition of unsupervised clustering." },
      { q: "What does a Reinforcement Learning agent use to learn?", options: ["Pre-labeled CSV files", "Rewards and Punishments", "Static images", "Decision Trees"], a: 1, explanation: "Reinforcement learning mimics trial-and-error. The agent takes actions in an environment and learns to maximize 'Rewards' while avoiding 'Punishments'." },
      { q: "Which algorithm type would you use to predict tomorrow's temperature?", options: ["Classification", "Clustering", "Regression", "Dimensionality Reduction"], a: 2, explanation: "Because temperature is a continuous number (e.g., 72.5°F), you use Regression. Classification is for discrete categories (e.g., 'Hot' or 'Cold')." }
    ]
  },
  'decision-trees': {
    title: 'Decision Trees Quiz',
    questions: [
      { q: "What does an internal node in a Decision Tree represent?", options: ["The final prediction", "A test on a specific attribute or feature", "The root of the data", "A random guess"], a: 1, explanation: "Internal nodes act as questions or 'tests' (e.g., 'Is petal length < 2.4cm?') that split the data into smaller, purer groups." },
      { q: "What is Gini Impurity used for?", options: ["Measuring how mixed or 'impure' a set of data is", "Calculating the depth of the tree", "Measuring execution speed", "Drawing the boundary line"], a: 0, explanation: "Gini Impurity is a math formula used to measure how mixed the classes are in a node. The algorithm splits data to minimize this impurity." },
      { q: "What happens when a Decision Tree grows too deep?", options: ["It underfits the data", "It becomes perfectly accurate on all unseen data", "It overfits, memorizing noise in the training data", "It turns into a Neural Network"], a: 2, explanation: "Trees that are too deep will memorize specific, anomalous data points (Overfitting), making them terrible at generalizing to new data." },
      { q: "What is a Random Forest?", options: ["A single tree with many branches", "An ensemble method using multiple decision trees", "A clustering algorithm", "A tree that randomly deletes data"], a: 1, explanation: "A Random Forest trains dozens or hundreds of Decision Trees on random subsets of data and averages their predictions to prevent overfitting." }
    ]
  },
  // Adding placeholders for others to prevent crashes if history references them
  'neural-networks': { title: 'Neural Networks Quiz', questions: [] },
  'cnn': { title: 'CNNs Quiz', questions: [] },
  'overall': { title: 'Overall AI Mastery Quiz', questions: [] }
};

// Mock History data to display the UI before your backend is hooked up
const MOCK_HISTORY = [
  {
    id: 'hist-1',
    quizId: 'intro-ml',
    title: 'Intro to ML Quiz',
    score: 3,
    totalQuestions: 4,
    date: 'Today',
    userAnswers: [1, 0, 1, 3] // Example: User got Q4 wrong (picked 3 instead of 2)
  },
  {
    id: 'hist-2',
    quizId: 'decision-trees',
    title: 'Decision Trees Quiz',
    score: 4,
    totalQuestions: 4,
    date: 'Yesterday',
    userAnswers: [1, 0, 2, 1] // Perfect score
  }
];

export default function Dashboard() {
  const { profile } = useAuthStore();
  
  // State to manage the active view (Dashboard vs Detailed Analysis)
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  const completedCount = profile?.completedModules.length || 0;
  const progressPercentage = Math.round((completedCount / TOTAL_MODULES) * 100);

  // Use real history if available, otherwise use mock
  const quizHistory = profile?.quizHistory || MOCK_HISTORY;

  const stats = [
    { label: 'Total XP', value: profile?.xp || 0, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Day Streak', value: profile?.streak || 0, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Modules Done', value: completedCount, icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Current Rank', value: 'Novice', icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  // If a user clicks a history item, render the Analysis View
  if (selectedHistoryId) {
    const historyItem = quizHistory.find(h => h.id === selectedHistoryId);
    if (!historyItem) return null;
    
    const activeQuiz = QUIZZES[historyItem.quizId];

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 pb-12">
        <button 
          onClick={() => setSelectedHistoryId(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <header className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
              <Trophy size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{historyItem.title} Analysis</h1>
              <p className="text-slate-500 mt-1">Attempted {historyItem.date}</p>
            </div>
          </div>
          <div className="text-center md:text-right bg-slate-50 px-6 py-3 rounded-xl border border-slate-200">
            <p className="text-sm font-bold uppercase text-slate-400 mb-1">Final Score</p>
            <p className="text-3xl font-black text-indigo-600">{historyItem.score} / {historyItem.totalQuestions}</p>
          </div>
        </header>

        {/* Detailed Analysis Breakdown */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-8 py-5 border-b border-slate-200">
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BrainCircuit size={20} className="text-indigo-500" />
              Question Breakdown
            </h4>
          </div>
          <div className="divide-y divide-slate-100">
            {activeQuiz.questions.map((q, i) => {
              const userChoice = historyItem.userAnswers[i];
              const isCorrect = userChoice === q.a;
              
              return (
                <div key={i} className="p-8">
                  <p className="font-bold text-slate-900 mb-6 text-lg">{i + 1}. {q.q}</p>
                  
                  <div className="space-y-4 mb-6">
                    {/* User's Answer */}
                    <div className={`flex items-start gap-4 p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                      {isCorrect ? <CheckCircle2 size={24} className="shrink-0 mt-0.5 text-emerald-600" /> : <XCircle size={24} className="shrink-0 mt-0.5 text-red-500" />}
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider block mb-1 opacity-75">Your Answer</span>
                        <span className="font-medium text-base">{userChoice !== undefined && q.options[userChoice] ? q.options[userChoice] : 'Unanswered'}</span>
                      </div>
                    </div>

                    {/* Correct Answer (only show if user was wrong) */}
                    {!isCorrect && (
                      <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                        <CheckCircle2 size={24} className="shrink-0 mt-0.5 text-slate-400" />
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider block mb-1 opacity-75">Correct Answer</span>
                          <span className="font-medium text-base">{q.options[q.a]}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Educational Explanation */}
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 text-indigo-900/80 leading-relaxed text-sm">
                    <span className="font-bold text-indigo-700 mr-2 uppercase tracking-wide text-xs">Why?</span>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  }

  // --- Standard Dashboard View ---
  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {profile?.displayName || 'Student'}! 👋</h1>
          <p className="text-slate-500 mt-2">Ready to continue your AI journey?</p>
        </div>
      </header>

      {/* OVERALL PROGRESS BAR */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
      >
        <div className="flex justify-between items-end mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Target size={24} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Overall Course Progress</h2>
              <p className="text-sm text-slate-500">{completedCount} of {TOTAL_MODULES} Modules Completed</p>
            </div>
          </div>
          <span className="text-2xl font-black text-indigo-600">{progressPercentage}%</span>
        </div>
        
        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-indigo-500 h-full rounded-full"
          />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-indigo-200 transition-colors"
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          {/* Continue Learning */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <h2 className="text-xl font-bold text-slate-900">Recommended Next Step</h2>
              <Link to="/modules" className="text-sm font-bold text-indigo-600 hover:text-indigo-800">View All Modules</Link>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                    Up Next
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">Introduction to Neural Networks</h3>
                  <p className="text-slate-500 mt-2 max-w-md">Learn the basics of forward propagation, weights, biases, and activation functions.</p>
                </div>
                <div className="w-20 h-20 rounded-full border-[6px] border-indigo-50 flex items-center justify-center relative shrink-0">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle cx="34" cy="34" r="34" stroke="currentColor" strokeWidth="6" fill="none" className="text-indigo-50" />
                    <circle cx="34" cy="34" r="34" stroke="currentColor" strokeWidth="6" fill="none" strokeDasharray="213" strokeDashoffset="127" className="text-indigo-500" />
                  </svg>
                  <span className="text-sm font-black text-slate-700">40%</span>
                </div>
              </div>
              <Link to="/modules/neural-networks" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors w-full sm:w-auto justify-center">
                Resume Module <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* New Section: Quiz History */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <h2 className="text-xl font-bold text-slate-900">Recent Quiz History</h2>
              <Link to="/modules" className="text-sm font-bold text-indigo-600 hover:text-indigo-800">Take a Quiz</Link>
            </div>
            
            {quizHistory.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-8 text-center">
                <History className="mx-auto text-slate-400 mb-3" size={32} />
                <p className="text-slate-500 font-medium">You haven't taken any quizzes yet.</p>
                <Link to="/modules" className="text-indigo-600 font-bold text-sm mt-2 block hover:underline">Head to Learning Path to start</Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {quizHistory.map((history) => {
                  const isPerfect = history.score === history.totalQuestions;
                  return (
                    <button
                      key={history.id}
                      onClick={() => setSelectedHistoryId(history.id)}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all text-left flex justify-between items-center group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isPerfect ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                          {isPerfect ? <CheckCircle2 size={24} /> : <BrainCircuit size={24} />}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{history.title}</h4>
                          <div className="flex gap-3 text-xs font-medium text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><History size={12}/> {history.date}</span>
                            <span className={isPerfect ? 'text-emerald-600' : 'text-amber-600'}>Score: {history.score}/{history.totalQuestions}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-slate-400 group-hover:text-indigo-600 transition-colors bg-slate-50 p-2 rounded-full group-hover:bg-indigo-50">
                        <ChevronRight size={20} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Recommended Games */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Daily Challenge</h2>
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-3xl text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
            
            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                <Flame size={14} /> +50 XP
              </span>
              <h3 className="font-bold text-2xl mb-3 leading-tight">Decision Tree Builder</h3>
              <p className="text-indigo-100 text-sm mb-8 leading-relaxed">Play the role of an algorithm and build a tree to classify the Iris dataset using Gini Impurity.</p>
              <Link to="/games/decision-tree" className="block w-full py-3.5 bg-white text-indigo-600 text-center font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                Play Now
              </Link>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}