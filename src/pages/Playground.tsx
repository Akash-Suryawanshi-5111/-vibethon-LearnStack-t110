import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Code2, AlertTriangle, CheckCircle2, ChevronRight, 
  Terminal, ArrowRight, BrainCircuit, Lightbulb, Zap, TrendingUp, RefreshCw, Target
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

// --- Guided Templates & Tasks ---
const TEMPLATES = [
  {
    id: 'spam-classifier',
    name: 'Spam Classifier (Rule-Based)',
    task: "Modify the keywords and threshold so it correctly flags 'URGENT: Claim your free iPhone' as SPAM with >80% confidence.",
    defaultInput: "URGENT: Claim your free iPhone now!",
    code: `function classify(text) {
  const lowerText = text.toLowerCase();
  
  // 1. Define your features (keywords)
  const spamKeywords = ['free', 'winner', 'click here'];
  
  // 2. Initialize scores
  let score = 0;
  let matched = [];

  // 3. Extraction: Check for keywords
  spamKeywords.forEach(kw => {
    if (lowerText.includes(kw)) {
      score += 0.3; // Add 30% confidence per word
      matched.push(kw);
    }
  });

  // 4. Decision: Apply threshold
  const confidence = Math.min(score, 1.0);
  const threshold = 0.5; // Must be >= 50% to be spam
  const isSpam = confidence >= threshold;

  return { isSpam, confidence, matchedKeywords: matched, steps: [
    \`Converted text to lowercase\`,
    \`Checked against \${spamKeywords.length} keywords\`,
    \`Found \${matched.length} matches: \${matched.join(', ')}\`,
    \`Calculated confidence: \${(confidence * 100).toFixed(0)}%\`,
    \`Applied threshold (\${threshold}): \${isSpam ? 'SPAM' : 'NOT SPAM'}\`
  ]};
}`
  },
  {
    id: 'sentiment-analysis',
    name: 'Sentiment Analysis (Basic)',
    task: "Add more negative keywords so that 'I am very sad and angry' is classified as NEGATIVE.",
    defaultInput: "I am very sad and angry today.",
    code: `function classify(text) {
  const words = text.toLowerCase().split(' ');
  
  const positiveWords = ['happy', 'great', 'awesome', 'good'];
  const negativeWords = ['bad', 'terrible', 'awful']; // Add more here!
  
  let score = 0;
  let matched = [];

  words.forEach(word => {
    if (positiveWords.includes(word)) { score += 0.5; matched.push('+' + word); }
    if (negativeWords.includes(word)) { score -= 0.5; matched.push('-' + word); }
  });

  // Normalize confidence between 0 and 1
  const confidence = Math.min(Math.max((score + 1) / 2, 0), 1.0);
  const isPositive = confidence >= 0.6;

  return { isSpam: !isPositive, confidence, matchedKeywords: matched, steps: [
    \`Split text into \${words.length} words\`,
    \`Found sentiment markers: \${matched.join(', ')}\`,
    \`Calculated raw score: \${score}\`,
    \`Normalized confidence to: \${(confidence * 100).toFixed(0)}%\`,
    \`Classification: \${isPositive ? 'POSITIVE' : 'NEGATIVE'}\`
  ]};
}`
  }
];

export default function Playground() {
  const { updateXp } = useAuthStore();
  
  // Playground State
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATES[0]);
  const [code, setCode] = useState(activeTemplate.code);
  const [testInput, setTestInput] = useState(activeTemplate.defaultInput);
  
  // Execution State
  const [output, setOutput] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Gamification & Tracking
  const [prevConfidence, setPrevConfidence] = useState<number | null>(null);
  const [xpEarned, setXpEarned] = useState<number | null>(null);

  // Switch Template
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const t = TEMPLATES.find(t => t.id === e.target.value)!;
    setActiveTemplate(t);
    setCode(t.code);
    setTestInput(t.defaultInput);
    setOutput(null);
    setError(null);
    setPrevConfidence(null);
  };

  // 🚀 The Real Execution Engine (Uses browser JS evaluation safely for demo)
  const handleRun = () => {
    setIsRunning(true);
    setError(null);
    setShowExplanation(false);
    setXpEarned(null);

    setTimeout(() => {
      try {
        // We create a new function that contains the user's code, 
        // then calls the user's classify() function with our testInput.
        const executor = new Function('inputText', `
          ${code}
          return classify(inputText);
        `);

        const result = executor(testInput);

        if (typeof result !== 'object' || result.confidence === undefined) {
          throw new Error("Your function must return an object with { isSpam: boolean, confidence: number }");
        }

        // Track Before/After
        if (output) setPrevConfidence(output.confidence);
        
        setOutput(result);
        
        // Gamification Award
        const xp = Math.floor(Math.random() * 10) + 10; // 10-20 XP per successful run
        setXpEarned(xp);
        updateXp(xp);

      } catch (err: any) {
        setError(err.message || "Syntax Error in your code.");
        setOutput(null);
      } finally {
        setIsRunning(false);
      }
    }, 600); // Simulated processing delay for effect
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      <header className="flex flex-col md:flex-row justify-between items-end gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <Terminal size={16}/> Algorithm Sandbox
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">AI Code Playground</h1>
          <p className="text-slate-500 mt-2">Write actual logic, test custom inputs, and visualize how models make decisions.</p>
        </div>
        
        {/* Editor Experience: Template Dropdown */}
        <div className="w-full md:w-72">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Experiment Template</label>
          <select 
            className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:border-indigo-500 focus:ring-0 outline-none"
            value={activeTemplate.id}
            onChange={handleTemplateChange}
          >
            {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Guided Tasks & Code Editor */}
        <div className="lg:col-span-7 space-y-4 flex flex-col h-[800px]">
          
          {/* Guided Task Area */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 shadow-sm shrink-0">
            <div className="bg-amber-100 text-amber-600 p-2 rounded-lg shrink-0">
              <Target size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-1">Current Task</h3>
              <p className="text-amber-900 font-medium">{activeTemplate.task}</p>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 bg-[#1e1e2e] rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col relative">
            <div className="bg-[#181825] px-4 py-3 flex justify-between items-center border-b border-[#313244]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-[#a6adc8] font-mono text-xs font-bold">logic.js</span>
            </div>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full bg-transparent text-[#cdd6f4] p-6 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-0"
              spellCheck="false"
            />
            
            <div className="absolute bottom-6 right-6">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50"
              >
                {isRunning ? <RefreshCw size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
                Run Algorithm
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Input & Visualization */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-[800px]">
          
          {/* Editable Test Input */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm shrink-0">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Code2 size={16} /> Test Input Data
            </label>
            <textarea 
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium text-slate-700 focus:border-indigo-500 focus:bg-white outline-none transition-all resize-none"
              rows={2}
              placeholder="Enter text to classify..."
            />
          </div>

          {/* Error State */}
          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">Execution Error</h4>
                <p className="text-sm font-mono mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Live Visualization Panel */}
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner p-6 flex flex-col overflow-y-auto">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 text-center">Live Visual Output</h3>

            {!output && !error && !isRunning && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-50">
                <BrainCircuit size={64} className="mb-4" />
                <p className="font-medium text-center px-8">Run your algorithm to see how it processes the input data.</p>
              </div>
            )}

            {output && !error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                
                {/* 1. Final Verdict Box */}
                <div className={`p-6 rounded-2xl border-2 text-center flex flex-col items-center justify-center shadow-sm relative overflow-hidden
                  ${output.isSpam ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                  
                  {xpEarned && (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg text-xs font-bold text-indigo-600 shadow flex items-center gap-1">
                      <Zap size={12} fill="currentColor" /> +{xpEarned} XP
                    </motion.div>
                  )}

                  <span className="text-sm font-bold uppercase tracking-widest opacity-70 mb-1">Final Classification</span>
                  <span className="text-4xl font-black">{output.isSpam ? (activeTemplate.id === 'sentiment-analysis' ? 'NEGATIVE' : 'SPAM') : (activeTemplate.id === 'sentiment-analysis' ? 'POSITIVE' : 'SAFE')}</span>
                </div>

                {/* 2. Confidence Score & Before/After Comparison */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-bold text-slate-700 text-sm">Confidence Score</span>
                    <span className="font-mono font-bold text-indigo-600">{(output.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden relative">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${output.confidence * 100}%` }} 
                      transition={{ type: "spring", bounce: 0.2 }}
                      className={`h-full rounded-full ${output.isSpam ? 'bg-red-500' : 'bg-emerald-500'}`}
                    />
                  </div>

                  {/* Compare Before vs After */}
                  {prevConfidence !== null && prevConfidence !== output.confidence && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">Previous Run:</span>
                      <div className="flex items-center gap-2 font-bold">
                        <span className="text-slate-400 line-through">{(prevConfidence * 100).toFixed(0)}%</span>
                        <ArrowRight size={14} className="text-slate-400" />
                        <span className={output.confidence > prevConfidence ? 'text-emerald-500 flex items-center gap-1' : 'text-red-500 flex items-center gap-1'}>
                          {(output.confidence * 100).toFixed(0)}% <TrendingUp size={14} />
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Model Thinking View (Execution Steps) */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm"><BrainCircuit size={18} className="text-indigo-500" /> Model Thinking Trace</h4>
                  <div className="space-y-3">
                    {output.steps?.map((step: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 text-xs font-bold font-mono border border-slate-200 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-slate-600 font-medium">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Explain Output Toggle */}
                <button 
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="w-full py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Lightbulb size={18} /> Explain this output
                </button>

                <AnimatePresence>
                  {showExplanation && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                      <div className="bg-indigo-600 text-white p-5 rounded-2xl shadow-lg mt-2 text-sm leading-relaxed">
                        <p className="mb-2"><strong>Why did it output {output.isSpam ? 'SPAM' : 'SAFE'}?</strong></p>
                        <p className="mb-2">The text was scanned against your list of features. It found <strong>{output.matchedKeywords.length} matching patterns</strong>: <span className="bg-white/20 px-2 py-0.5 rounded font-mono">{output.matchedKeywords.join(', ') || 'none'}</span>.</p>
                        <p>Based on your logic, this resulted in a final probability of <strong>{(output.confidence * 100).toFixed(0)}%</strong>. Because this score is {output.isSpam ? '>=' : '<'} your programmed threshold, the final classification triggered as {output.isSpam ? 'SPAM' : 'SAFE'}.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}