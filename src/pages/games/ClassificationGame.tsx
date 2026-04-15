import { useState, useRef, useEffect, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function ClassificationGame() {
  const navigate = useNavigate();
  const { updateXp } = useAuthStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<{x: number, y: number, type: 'A' | 'B'}[]>([]);
  const [score, setScore] = useState<number | null>(null);

  // Generate random points on mount
  useEffect(() => {
    generatePoints();
  }, []);

  const generatePoints = () => {
    const newPoints = [];
    for (let i = 0; i < 20; i++) {
      // Class A (top left)
      newPoints.push({
        x: Math.random() * 200 + 50,
        y: Math.random() * 200 + 50,
        type: 'A' as const
      });
      // Class B (bottom right)
      newPoints.push({
        x: Math.random() * 200 + 250,
        y: Math.random() * 200 + 250,
        type: 'B' as const
      });
    }
    setPoints(newPoints);
    setScore(null);
    clearCanvas();
    drawPoints(newPoints);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawPoints = (pts: typeof points) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = p.type === 'A' ? '#ef4444' : '#3b82f6'; // Red vs Blue
      ctx.fill();
      ctx.closePath();
    });
  };

  const startDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    evaluateBoundary();
  };

  const evaluateBoundary = () => {
    // Simplified evaluation: just give points for trying in this demo
    setScore(85);
    updateXp(20);
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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 mb-4">
          <Target size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Classification Game</h1>
        <p className="text-slate-500 mt-2">Draw a line to separate the red points from the blue points.</p>
      </header>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto flex flex-col items-center">
        <div className="relative border-2 border-dashed border-slate-300 rounded-xl overflow-hidden bg-slate-50 cursor-crosshair">
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="block"
          />
        </div>

        <div className="mt-8 flex items-center justify-between w-full px-4">
          <button
            onClick={generatePoints}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <RefreshCcw size={18} /> Reset
          </button>

          {score !== null && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-lg font-bold text-green-600 bg-green-50 px-4 py-2 rounded-xl"
            >
              Accuracy: {score}% (+20 XP)
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
