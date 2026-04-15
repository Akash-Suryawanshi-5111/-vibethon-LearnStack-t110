import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, GitMerge, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function DecisionTreeGame() {
  const navigate = useNavigate();
  const { updateXp } = useAuthStore();
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      condition: "Is Petal Length < 2.45 cm?",
      options: [
        { label: "Yes -> Setosa", correct: true },
        { label: "No -> Setosa", correct: false }
      ]
    },
    {
      condition: "Is Petal Width < 1.75 cm?",
      options: [
        { label: "Yes -> Versicolor", correct: true },
        { label: "No -> Versicolor", correct: false }
      ]
    }
  ];

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore(s => s + 1);
    
    if (step < questions.length - 1) {
      setStep(s => s + 1);
    } else {
      setShowResult(true);
      if (score + (correct ? 1 : 0) === questions.length) {
        updateXp(50); // Award XP for perfect score
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button 
        onClick={() => navigate('/games')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Games
      </button>

      <header className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-500 mb-4">
          <GitMerge size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Decision Tree Builder</h1>
        <p className="text-slate-500 mt-2">Help the model classify the Iris dataset by picking the right splits.</p>
      </header>

      {!showResult ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8 text-sm font-medium text-slate-500">
            <span>Split {step + 1} of {questions.length}</span>
            <span>Score: {score}</span>
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center"
          >
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl mb-8">
              <h2 className="text-xl font-bold text-slate-900">{questions[step].condition}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {questions[step].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt.correct)}
                  className="p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 font-medium transition-all"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto text-center"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Tree Completed!</h2>
          <p className="text-lg text-slate-600 mb-8">
            You scored {score} out of {questions.length}.
            {score === questions.length && " Perfect! You earned +50 XP."}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => { setStep(0); setScore(0); setShowResult(false); }}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={() => navigate('/games')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              More Games
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
