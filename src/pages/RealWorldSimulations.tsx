import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, ShieldCheck, Mail, Image as ImageIcon, Plus, 
  Trash2, SlidersHorizontal, CheckCircle2, XCircle, Lock, 
  Unlock, ArrowLeft, BrainCircuit, Target, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

// --- DATASETS ---
const SPAM_DATA = [
  { id: 1, text: "URGENT: Claim your $1000 Walmart gift card now!", isSpam: true },
  { id: 2, text: "Hi team, the marketing meeting is moved to 3 PM.", isSpam: false },
  { id: 3, text: "You have (1) new pending package delivery. Click to pay shipping.", isSpam: true },
  { id: 4, text: "Mom's recipe for the pie - see attached.", isSpam: false },
  { id: 5, text: "Make money fast working from home! 100% free guaranteed.", isSpam: true },
  { id: 6, text: "Invoice #49102 attached for your review.", isSpam: false }
];

const VISION_DATA = [
  { id: 1, type: 'cat', emoji: '🐱', mask: 0.1, bushy: 0.2, isTarget: true },
  { id: 2, type: 'raccoon', emoji: '🦝', mask: 0.9, bushy: 0.8, isTarget: false },
  { id: 3, type: 'cat', emoji: '🐈', mask: 0.0, bushy: 0.4, isTarget: true },
  { id: 4, type: 'raccoon', emoji: '🦝', mask: 0.8, bushy: 0.9, isTarget: false },
  { id: 5, type: 'dog', emoji: '🐶', mask: 0.2, bushy: 0.1, isTarget: false }, 
  { id: 6, type: 'fox', emoji: '🦊', mask: 0.6, bushy: 0.7, isTarget: false }, 
];

export default function RealWorldSimulations() {
  const navigate = useNavigate();
  const { updateXp } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<'spam' | 'vision'>('spam');
  const [awardedSpam, setAwardedSpam] = useState(false);
  const [awardedVision, setAwardedVision] = useState(false);

  // --- SPAM STATE ---
  const [spamKeywords, setSpamKeywords] = useState<string[]>(['urgent', 'free']);
  const [newKeyword, setNewKeyword] = useState('');
  const [spamThreshold, setSpamThreshold] = useState(40);

  // --- VISION STATE ---
  const [weightMask, setWeightMask] = useState(50);
  const [weightBushy, setWeightBushy] = useState(50);
  const [visionThreshold, setVisionThreshold] = useState(60);

  // --- SPAM LOGIC ---
  const handleAddKeyword = () => {
    if (newKeyword.trim() && !spamKeywords.includes(newKeyword.toLowerCase())) {
      setSpamKeywords([...spamKeywords, newKeyword.toLowerCase().trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (kw: string) => {
    setSpamKeywords(spamKeywords.filter(k => k !== kw));
  };

  const evaluatedSpam = useMemo(() => {
    return SPAM_DATA.map(email => {
      const lower = email.text.toLowerCase();
      let score = 0;
      let matched: string[] = [];
      spamKeywords.forEach(kw => {
        if (lower.includes(kw)) {
          score += 25; // Each keyword adds 25% to spam probability
          matched.push(kw);
        }
      });
      const predictedSpam = score >= spamThreshold;
      const isCorrect = predictedSpam === email.isSpam;
      return { ...email, score, matched, predictedSpam, isCorrect };
    });
  }, [spamKeywords, spamThreshold]);

  const spamAccuracy = Math.round((evaluatedSpam.filter(e => e.isCorrect).length / SPAM_DATA.length) * 100);

  // --- VISION LOGIC ---
  const evaluatedVision = useMemo(() => {
    return VISION_DATA.map(animal => {
      // Score = (Feature 1 * Weight 1) + (Feature 2 * Weight 2)
      const score = ((animal.mask * weightMask) + (animal.bushy * weightBushy));
      const doorUnlocks = score < visionThreshold; // We want to unlock for cats (low scores)
      const isCorrect = doorUnlocks === animal.isTarget;
      return { ...animal, score: Math.round(score), doorUnlocks, isCorrect };
    });
  }, [weightMask, weightBushy, visionThreshold]);

  const visionAccuracy = Math.round((evaluatedVision.filter(e => e.isCorrect).length / VISION_DATA.length) * 100);

  // --- XP AWARDS ---
  useEffect(() => {
    if (spamAccuracy === 100 && !awardedSpam) {
      updateXp(100);
      setAwardedSpam(true);
    }
  }, [spamAccuracy, awardedSpam, updateXp]);

  useEffect(() => {
    if (visionAccuracy === 100 && !awardedVision) {
      updateXp(100);
      setAwardedVision(true);
    }
  }, [visionAccuracy, awardedVision, updateXp]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-6">
        <div>
          <button onClick={() => navigate('/games')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium mb-4">
            <ArrowLeft size={20} /> Back to Hub
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <BrainCircuit size={16}/> Applied AI
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Real-World Simulations</h1>
          <p className="text-slate-500 mt-2">Tune models to solve practical problems.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setActiveTab('spam')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'spam' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
            <Mail size={18} /> Spam Filter
          </button>
          <button onClick={() => setActiveTab('vision')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'vision' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
            <ImageIcon size={18} /> Smart Pet Door
          </button>
        </div>
      </header>

      {/* =========================================
          TAB 1: SPAM DETECTION SIMULATION
          ========================================= */}
      {activeTab === 'spam' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-12 gap-8">
          
          {/* Left: Tuning Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Model Tuning</h2>
              <p className="text-sm text-slate-500 mb-6">Train the filter to identify spam while protecting safe emails.</p>

              <div className="space-y-4 mb-8">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spam Keywords (Features)</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {spamKeywords.map(kw => (
                    <span key={kw} className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2">
                      {kw} <button onClick={() => removeKeyword(kw)} className="hover:text-red-900"><XCircle size={14} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" value={newKeyword} onChange={e => setNewKeyword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddKeyword()}
                    placeholder="Add bad word..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <button onClick={handleAddKeyword} className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700"><Plus size={20}/></button>
                </div>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sensitivity Threshold</label>
                   <span className="font-mono font-bold text-indigo-600">{spamThreshold}%</span>
                 </div>
                 <input 
                   type="range" min="0" max="100" step="5" value={spamThreshold} onChange={e => setSpamThreshold(Number(e.target.value))}
                   className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                 />
                 <p className="text-xs text-slate-500">Emails scoring above this are marked as SPAM.</p>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border-2 text-center shadow-sm ${spamAccuracy === 100 ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-slate-200'}`}>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Live Accuracy</div>
              <div className={`text-5xl font-black ${spamAccuracy === 100 ? 'text-emerald-600' : 'text-slate-700'}`}>{spamAccuracy}%</div>
              {spamAccuracy === 100 && <div className="mt-3 text-emerald-700 font-bold flex items-center justify-center gap-1"><Zap size={16}/> Perfect Model!</div>}
            </div>
          </div>

          {/* Right: Live Dataset */}
          <div className="lg:col-span-8 space-y-4">
             <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4"><Mail className="text-slate-400" /> Live Inbox Testing ({SPAM_DATA.length} Emails)</h3>
             <div className="space-y-3">
                {evaluatedSpam.map(email => (
                  <div key={email.id} className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-colors ${email.isCorrect ? 'border-emerald-200 bg-white' : 'border-red-300 bg-red-50'}`}>
                    
                    {/* Model Prediction Badge */}
                    <div className={`w-24 shrink-0 text-center py-2 rounded-xl font-bold text-xs ${email.predictedSpam ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                      {email.predictedSpam ? '🚨 SPAM' : '✅ INBOX'}
                      <div className="font-mono text-[10px] mt-1 opacity-70">Score: {email.score}</div>
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{email.text}</p>
                      {email.matched.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {email.matched.map((m, i) => <span key={i} className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold uppercase">{m}</span>)}
                        </div>
                      )}
                    </div>

                    {/* Ground Truth Validation */}
                    <div className="w-8 flex justify-center">
                      {email.isCorrect ? <CheckCircle2 className="text-emerald-500" size={24} /> : <XCircle className="text-red-500" size={24} />}
                    </div>
                  </div>
                ))}
             </div>
          </div>

        </motion.div>
      )}

      {/* =========================================
          TAB 2: IMAGE CLASSIFICATION (PET DOOR)
          ========================================= */}
      {activeTab === 'vision' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-12 gap-8">
          
          {/* Left: Tuning Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Computer Vision Weights</h2>
              <p className="text-sm text-slate-500 mb-6">Help the camera identify Cats to unlock the door, while locking out Raccoons, Dogs, and Foxes.</p>

              <div className="space-y-6 mb-8">
                 <div>
                   <div className="flex justify-between items-end mb-2">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mask Presence Weight</label>
                     <span className="font-mono font-bold text-purple-600">{weightMask}</span>
                   </div>
                   <input type="range" min="-100" max="100" value={weightMask} onChange={e => setWeightMask(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"/>
                   <p className="text-[10px] text-slate-400 mt-1">High mask = Raccoon/Fox trait</p>
                 </div>

                 <div>
                   <div className="flex justify-between items-end mb-2">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tail Bushiness Weight</label>
                     <span className="font-mono font-bold text-blue-600">{weightBushy}</span>
                   </div>
                   <input type="range" min="-100" max="100" value={weightBushy} onChange={e => setWeightBushy(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
                   <p className="text-[10px] text-slate-400 mt-1">High bushiness = Raccoon/Fox trait</p>
                 </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-100">
                 <div className="flex justify-between items-end">
                   <label className="text-xs font-bold text-amber-500 uppercase tracking-wider">Lock Threshold</label>
                   <span className="font-mono font-bold text-amber-600">{visionThreshold}</span>
                 </div>
                 <input type="range" min="0" max="200" value={visionThreshold} onChange={e => setVisionThreshold(Number(e.target.value))} className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"/>
                 <p className="text-xs text-slate-500">If Score &gt; Threshold, the door stays LOCKED.</p>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border-2 text-center shadow-sm ${visionAccuracy === 100 ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-slate-200'}`}>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Live Accuracy</div>
              <div className={`text-5xl font-black ${visionAccuracy === 100 ? 'text-emerald-600' : 'text-slate-700'}`}>{visionAccuracy}%</div>
              {visionAccuracy === 100 && <div className="mt-3 text-emerald-700 font-bold flex items-center justify-center gap-1"><Zap size={16}/> Perfect Model!</div>}
            </div>
          </div>

          {/* Right: Live Camera Feed */}
          <div className="lg:col-span-8 space-y-4">
             <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4"><ImageIcon className="text-slate-400" /> Camera Feed Testing</h3>
             
             <div className="grid sm:grid-cols-2 gap-4">
                {evaluatedVision.map(animal => (
                  <div key={animal.id} className={`p-6 rounded-2xl border-2 relative overflow-hidden transition-colors ${animal.isCorrect ? 'border-emerald-200 bg-white' : 'border-red-300 bg-red-50'}`}>
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-6xl bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center shadow-inner border border-slate-200">{animal.emoji}</div>
                      
                      {/* Door Status */}
                      <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border ${animal.doorUnlocks ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-slate-800 border-slate-900 text-white'}`}>
                         {animal.doorUnlocks ? <Unlock size={24} /> : <Lock size={24} />}
                         <span className="text-[10px] font-bold mt-1 uppercase">{animal.doorUnlocks ? 'Open' : 'Locked'}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>Mask Feature</span>
                        <span className="font-mono">{animal.mask}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>Tail Feature</span>
                        <span className="font-mono">{animal.bushy}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">AI Vision Score</span>
                      <span className={`font-mono font-black text-lg ${animal.score > visionThreshold ? 'text-red-500' : 'text-emerald-500'}`}>{animal.score}</span>
                    </div>

                    {/* Ground Truth Checkmark */}
                    <div className="absolute top-4 right-20">
                      {animal.isCorrect ? <CheckCircle2 className="text-emerald-500" size={20} /> : <XCircle className="text-red-500" size={20} />}
                    </div>

                  </div>
                ))}
             </div>
          </div>

        </motion.div>
      )}

    </div>
  );
}