import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle2, Lock, PlayCircle, Trophy, BrainCircuit, AlertCircle, XCircle } from 'lucide-react';
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

const TABS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

// Pre-filled Quiz Data with Explanations added for analysis
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
  'neural-networks': {
    title: 'Neural Networks Quiz',
    questions: [
      { q: "What is the fundamental building block of a Neural Network?", options: ["A Kernel", "A Leaf Node", "A Perceptron / Neuron", "A Centroid"], a: 2, explanation: "The Perceptron (or artificial neuron) is the core unit that takes inputs, applies weights/biases, and passes the result through an activation function." },
      { q: "What mathematical operation does a neuron perform before applying its activation function?", options: ["Sorts the inputs", "Calculates a weighted sum of inputs plus a bias", "Multiplies all inputs together", "Finds the median of the inputs"], a: 1, explanation: "The core math of a neuron is Output = Sum(Weight × Input) + Bias." },
      { q: "Why do we need Hidden Layers?", options: ["To store data permanently", "To slow down the calculation", "To allow the network to learn complex, non-linear representations", "To hide the data from the user"], a: 2, explanation: "A single layer can only draw straight lines. Hidden layers allow the network to combine simple features into highly complex, curved decision boundaries." },
      { q: "Which activation function squishes outputs to be between 0 and 1?", options: ["ReLU", "Linear", "Sigmoid", "Softmax"], a: 2, explanation: "The Sigmoid function creates an S-curve that compresses any numerical input into a probability score between 0.0 and 1.0." }
    ]
  },
  'cnn': {
    title: 'CNNs Quiz',
    questions: [
      { q: "Convolutional Neural Networks are primarily designed for which type of data?", options: ["Text (NLP)", "Tabular CSV Data", "Images / Spatial Data", "Audio frequencies"], a: 2, explanation: "CNNs preserve spatial relationships (pixels next to each other), making them the absolute standard for image and video processing." },
      { q: "What is the role of a Convolutional Layer?", options: ["To apply filters and detect spatial features like edges", "To reduce the image size to 1 pixel", "To convert the image to text", "To randomize the colors"], a: 0, explanation: "Convolutional layers slide small matrices (filters) over an image to detect patterns like horizontal lines, curves, and eventually complex objects." },
      { q: "What does a Pooling (e.g., MaxPooling) layer do?", options: ["Increases the resolution of the image", "Reduces the spatial dimensions, retaining important features", "Adds color to black and white images", "Connects all neurons together"], a: 1, explanation: "Pooling shrinks the width and height of the data, reducing computation while keeping the most dominant features (like the brightest pixel in a patch)." },
      { q: "What is a 'Kernel' in the context of a CNN?", options: ["The CPU of the computer", "A small matrix applied across the image to extract features", "The final prediction score", "The dataset used for training"], a: 1, explanation: "A Kernel (or Filter) is the small grid of weights that slides across the input image to perform the convolution operation." }
    ]
  },
  'overall': {
    title: 'Overall AI Mastery Quiz',
    questions: [
      { q: "If you need an algorithm to identify cats in photographs, which architecture is best?", options: ["Decision Tree", "Linear Regression", "Convolutional Neural Network (CNN)", "K-Means Clustering"], a: 2, explanation: "CNNs are explicitly designed to handle pixel arrays and spatial data, making them the best choice for image recognition." },
      { q: "Overfitting occurs when a model:", options: ["Fails to learn anything from the training data", "Memorizes the training data perfectly but fails to generalize to new data", "Takes too long to train", "Uses too little training data"], a: 1, explanation: "Overfitting is like memorizing the answers to a practice test instead of learning the actual concepts; you will fail the real exam." },
      { q: "An ensemble of decision trees voting on a final outcome is known as:", options: ["Deep Learning", "A Neural Network", "A Random Forest", "Logistic Regression"], a: 2, explanation: "A Random Forest aggregates the predictions (votes) of many individual decision trees to create a highly robust and accurate model." },
      { q: "Supervised learning algorithms require:", options: ["Unlabeled data", "Labeled data (Features and Targets)", "No data, they generate their own", "Only numeric data"], a: 1, explanation: "The 'Supervisor' in supervised learning is the labeled target data, which tells the algorithm what the correct answer should be during training." },
      { q: "What enables Neural Networks to learn highly complex, curvy decision boundaries?", options: ["Removing all hidden layers", "Using purely linear activation functions", "Applying non-linear activation functions (like ReLU or Sigmoid)", "Reducing the number of parameters"], a: 2, explanation: "Without non-linear activation functions, a Neural Network of any depth collapses into a single linear mathematical equation." }
    ]
  }
};

export default function ModulesList() {
  const { profile, updateXp } = useAuthStore();
  const completed = profile?.completedModules || [];

  // Tab State
  const [activeTab, setActiveTab] = useState('All');

  // Quiz State
  const [activeQuizId, setActiveQuizId] = useState<string>('intro-ml');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const activeQuiz = QUIZZES[activeQuizId];

  // Filter modules based on active tab
  const filteredModules = MODULES.filter(mod => activeTab === 'All' || mod.level === activeTab);

  const handleStartQuiz = (id: string) => {
    setActiveQuizId(id);
    setQuizStarted(true);
    setCurrentQIndex(0);
    setScore(0);
    setShowResults(false);
    setSelectedAnswer(null);
    setUserAnswers([]); 
  };

  const handleAnswer = (optionIdx: number) => {
    if (selectedAnswer !== null) return; 
    setSelectedAnswer(optionIdx);
    
    setUserAnswers(prev => [...prev, optionIdx]);
    
    if (optionIdx === activeQuiz.questions[currentQIndex].a) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentQIndex < activeQuiz.questions.length - 1) {
        setCurrentQIndex(q => q + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
        const earned = (score + (optionIdx === activeQuiz.questions[currentQIndex].a ? 1 : 0)) * 20;
        if (earned > 0) updateXp(earned);
      }
    }, 1200);
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* 1. HORIZONTAL MODULES SECTION */}
      <section>
        <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Learning Path</h1>
            <p className="text-slate-500 mt-2">Master AI concepts step by step.</p>
          </div>
          
          {/* Difficulty Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto pb-6 gap-6 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {filteredModules.map((mod, index) => {
            // Must calculate isLocked based on original MODULES array to maintain sequence
            const originalIndex = MODULES.findIndex(m => m.id === mod.id);
            const isCompleted = completed.includes(mod.id);
            const isLocked = originalIndex > 0 && !completed.includes(MODULES[originalIndex - 1].id) && !isCompleted;

            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`snap-start shrink-0 w-80 relative bg-white p-6 rounded-3xl border flex flex-col h-[340px] ${
                  isCompleted ? 'border-green-200 shadow-sm' : isLocked ? 'border-slate-200 opacity-75 bg-slate-50' : 'border-indigo-200 shadow-md shadow-indigo-50'
                }`}
              >
                <div className={`w-14 h-14 flex items-center justify-center rounded-2xl mb-4 ${
                  isCompleted ? 'bg-green-50 text-green-600' : isLocked ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  {isCompleted ? <CheckCircle2 size={28} /> : isLocked ? <Lock size={28} /> : <BookOpen size={28} />}
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                    mod.level === 'Beginner' ? 'bg-blue-50 text-blue-700' : mod.level === 'Intermediate' ? 'bg-amber-50 text-amber-700' : 'bg-purple-50 text-purple-700'
                  }`}>
                    {mod.level}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{mod.duration}</span>
                </div>
                
                <h2 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{mod.title}</h2>
                <p className="text-sm text-slate-600 mb-auto line-clamp-3">{mod.description}</p>
                
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm text-indigo-600 font-bold">+{mod.xp} XP</span>
                  {!isLocked ? (
                    <Link
                      to={`/modules/${mod.id}`}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isCompleted ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {isCompleted ? 'Review' : 'Start'}
                      <PlayCircle size={16} />
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-slate-200 text-slate-400">
                      Locked
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>


      {/* 2. QUIZ KNOWLEDGE CHECK SECTION */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <header className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
            <Trophy size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Knowledge Checks</h2>
            <p className="text-slate-500">Test what you've learned and earn bonus XP.</p>
          </div>
        </header>

        {/* Quiz Selector */}
        {!quizStarted && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(QUIZZES).map(([id, quiz]) => (
              <button
                key={id}
                onClick={() => handleStartQuiz(id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all hover:shadow-md flex flex-col gap-2 ${
                  id === 'overall' ? 'border-amber-200 bg-amber-50 hover:border-amber-400' : 'border-slate-200 bg-white hover:border-indigo-400'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className={`font-bold ${id === 'overall' ? 'text-amber-800' : 'text-slate-800'}`}>{quiz.title}</span>
                  {id === 'overall' ? <Trophy size={18} className="text-amber-500" /> : <BrainCircuit size={18} className="text-slate-400" />}
                </div>
                <span className="text-xs font-medium text-slate-500">{quiz.questions.length} Questions</span>
              </button>
            ))}
          </div>
        )}

        {/* Active Quiz Area */}
        {quizStarted && !showResults && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6 text-sm font-bold text-slate-400 uppercase tracking-wider">
              <span>{activeQuiz.title}</span>
              <span>Question {currentQIndex + 1} of {activeQuiz.questions.length}</span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-6">{activeQuiz.questions[currentQIndex].q}</h3>
            
            <div className="space-y-3">
              {activeQuiz.questions[currentQIndex].options.map((opt: string, idx: number) => {
                const isCorrect = idx === activeQuiz.questions[currentQIndex].a;
                const isSelected = selectedAnswer === idx;
                let btnClass = "border-slate-200 hover:border-indigo-400 bg-white text-slate-700";
                
                if (selectedAnswer !== null) {
                  if (isCorrect) btnClass = "border-emerald-500 bg-emerald-50 text-emerald-800";
                  else if (isSelected) btnClass = "border-red-500 bg-red-50 text-red-800";
                  else btnClass = "border-slate-200 opacity-50 bg-slate-50 text-slate-400";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all flex justify-between items-center ${btnClass}`}
                  >
                    {opt}
                    {selectedAnswer !== null && isCorrect && <CheckCircle2 size={18} className="text-emerald-600" />}
                    {selectedAnswer !== null && isSelected && !isCorrect && <AlertCircle size={18} className="text-red-500" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Quiz Results with Detailed Analysis */}
        {showResults && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto text-center py-4">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy size={40} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Quiz Complete!</h3>
            <p className="text-lg text-slate-600 mb-6">You scored {score} out of {activeQuiz.questions.length}.</p>
            
            <div className="inline-block bg-slate-50 border border-slate-200 rounded-xl px-6 py-3 mb-10">
              <span className="text-sm text-slate-500 font-bold uppercase block mb-1">XP Earned</span>
              <span className="text-2xl font-black text-indigo-600">+{score * 20}</span>
            </div>

            {/* Detailed Analysis Section */}
            <div className="text-left bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <BrainCircuit size={20} className="text-indigo-500" />
                  Detailed Analysis
                </h4>
              </div>
              <div className="divide-y divide-slate-100">
                {activeQuiz.questions.map((q, i) => {
                  const userChoice = userAnswers[i];
                  const isCorrect = userChoice === q.a;
                  
                  return (
                    <div key={i} className="p-6">
                      <p className="font-bold text-slate-900 mb-4">{i + 1}. {q.q}</p>
                      
                      <div className="space-y-3 mb-4">
                        {/* User's Answer */}
                        <div className={`flex items-start gap-3 p-3 rounded-lg border ${isCorrect ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                          {isCorrect ? <CheckCircle2 size={20} className="shrink-0 mt-0.5 text-emerald-600" /> : <XCircle size={20} className="shrink-0 mt-0.5 text-red-500" />}
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider block mb-1 opacity-75">Your Answer</span>
                            <span className="font-medium">{userChoice !== undefined ? q.options[userChoice] : 'Unanswered'}</span>
                          </div>
                        </div>

                        {/* Correct Answer (only show if user was wrong) */}
                        {!isCorrect && (
                          <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                            <CheckCircle2 size={20} className="shrink-0 mt-0.5 text-slate-400" />
                            <div>
                              <span className="text-xs font-bold uppercase tracking-wider block mb-1 opacity-75">Correct Answer</span>
                              <span className="font-medium">{q.options[q.a]}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Educational Explanation */}
                      <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4 text-sm text-indigo-900/80 leading-relaxed">
                        <span className="font-bold text-indigo-700 mr-2">Why?</span>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center gap-4 pb-8">
              <button onClick={() => { setQuizStarted(false); setShowResults(false); }} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-colors shadow-md">
                Back to Quizzes
              </button>
            </div>
          </motion.div>
        )}

      </section>

    </div>
  );
}