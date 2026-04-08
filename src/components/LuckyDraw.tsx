import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RotateCcw, Play, Pause, UserCheck, Timer, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface LuckyDrawProps {
  names: string[];
}

export function LuckyDraw({ names }: LuckyDrawProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [winners, setWinners] = useState<string[]>([]);
  const [availableNames, setAvailableNames] = useState<string[]>([]);
  const [drawDuration, setDrawDuration] = useState<number>(0); // 0 means manual, > 0 means seconds
  const [customMinutes, setCustomMinutes] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setAvailableNames(names);
  }, [names]);

  const stopDraw = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    
    setIsDrawing(false);
    setTimeLeft(null);
    
    setWinners(prev => {
      // We need to get the current winner from the state at the moment of stopping
      // But since we are in a callback, we'll use a functional update or a ref if needed.
      // For simplicity, let's use the currentIndex which is updated by the timer.
      return prev; 
    });

    // Actually we need the winner name. Let's use a functional update for winners
    // and rely on the fact that stopDraw is called when currentIndex is "current"
  }, []);

  // Improved stop logic to handle the winner correctly
  const performStop = (finalIndex: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    
    setIsDrawing(false);
    setTimeLeft(null);
    
    const winner = availableNames[finalIndex];
    if (winner) {
      setWinners(prev => [winner, ...prev]);
      if (!allowRepeat) {
        setAvailableNames(prev => prev.filter((_, i) => i !== finalIndex));
      }

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7C3AED', '#5D5FEF', '#FFD700']
      });
    }
  };

  const startDraw = () => {
    if (availableNames.length === 0) return;
    setIsDrawing(true);
    
    let currentIdx = 0;
    const run = () => {
      currentIdx = Math.floor(Math.random() * availableNames.length);
      setCurrentIndex(currentIdx);
      timerRef.current = setTimeout(run, 50);
    };
    run();

    if (drawDuration > 0) {
      setTimeLeft(drawDuration);
      countdownRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev !== null && prev <= 1) {
            performStop(currentIdx);
            return null;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    }
  };

  const reset = () => {
    setWinners([]);
    setAvailableNames(names);
    setCurrentIndex(0);
    setTimeLeft(null);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const handleCustomMinutesChange = (val: string) => {
    setCustomMinutes(val);
    const mins = parseFloat(val);
    if (!isNaN(mins) && mins > 0) {
      setDrawDuration(Math.round(mins * 60));
    } else {
      setDrawDuration(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-[32px] p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center space-y-10">
        
        {/* Timer Settings */}
        <div className="w-full max-w-lg space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-bold mb-2">
            <Timer className="w-5 h-5 text-[#7C3AED]" />
            抽签时长设置
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => { setDrawDuration(0); setCustomMinutes(''); }}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold border transition-all",
                drawDuration === 0 ? "bg-[#7C3AED] text-white border-[#7C3AED]" : "bg-slate-50 text-slate-500 border-slate-100 hover:border-indigo-200"
              )}
            >
              手动停止
            </button>
            <button
              onClick={() => { setDrawDuration(60); setCustomMinutes(''); }}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold border transition-all",
                drawDuration === 60 ? "bg-[#7C3AED] text-white border-[#7C3AED]" : "bg-slate-50 text-slate-500 border-slate-100 hover:border-indigo-200"
              )}
            >
              1 分钟
            </button>
            <button
              onClick={() => { setDrawDuration(120); setCustomMinutes(''); }}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold border transition-all",
                drawDuration === 120 ? "bg-[#7C3AED] text-white border-[#7C3AED]" : "bg-slate-50 text-slate-500 border-slate-100 hover:border-indigo-200"
              )}
            >
              2 分钟
            </button>
            <div className="relative">
              <input
                type="number"
                placeholder="分钟"
                value={customMinutes}
                onChange={(e) => handleCustomMinutesChange(e.target.value)}
                className={cn(
                  "w-full px-3 py-2 rounded-xl text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all",
                  customMinutes !== '' ? "border-[#7C3AED] bg-indigo-50" : "bg-slate-50 border-slate-100"
                )}
              />
            </div>
          </div>
        </div>

        {/* Display Area */}
        <div className="relative w-full max-w-lg h-56 flex items-center justify-center bg-[#1F2937] rounded-[32px] shadow-2xl border-8 border-slate-800 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={isDrawing ? 'drawing' : availableNames[currentIndex]}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="text-6xl md:text-7xl font-black text-white tracking-widest"
            >
              {availableNames.length > 0 ? availableNames[currentIndex] : '名单为空'}
            </motion.div>
          </AnimatePresence>
          
          {/* Countdown Overlay */}
          {timeLeft !== null && isDrawing && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-black animate-pulse">
              <Clock className="w-4 h-4" />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
          
          <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
          <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-8 w-full">
          <div className="flex items-center gap-12">
            <div className="flex items-center space-x-3">
              <Switch 
                id="repeat-mode" 
                checked={allowRepeat} 
                onCheckedChange={setAllowRepeat}
                disabled={isDrawing}
                className="data-[state=checked]:bg-[#7C3AED]"
              />
              <Label htmlFor="repeat-mode" className="text-base font-semibold text-slate-600 cursor-pointer">
                允许重复抽取
              </Label>
            </div>
            
            <button 
              onClick={reset}
              disabled={isDrawing}
              className="text-slate-400 hover:text-slate-600 flex items-center gap-2 text-sm font-bold transition-colors disabled:opacity-30"
            >
              <RotateCcw className="w-4 h-4" />
              重置抽签
            </button>
          </div>

          <Button 
            size="lg" 
            onClick={isDrawing ? () => performStop(currentIndex) : startDraw}
            disabled={availableNames.length === 0}
            className={cn(
              "w-64 h-20 text-2xl font-black rounded-full transition-all duration-300 shadow-2xl shadow-indigo-200",
              isDrawing 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-[#7C3AED] hover:bg-[#6D28D9] hover:scale-105 active:scale-95'
            )}
          >
            {isDrawing ? (
              <><Pause className="mr-3 w-8 h-8 fill-current" /> 停止</>
            ) : (
              <><Play className="mr-3 w-8 h-8 fill-current" /> 开始抽签</>
            )}
          </Button>
        </div>
      </div>

      {/* Winners List */}
      {winners.length > 0 && (
        <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 space-y-6">
          <div className="flex items-center gap-2 text-[#1F2937] font-bold">
            <UserCheck className="w-5 h-5 text-green-500" />
            中奖名单 ({winners.length})
          </div>
          <div className="flex flex-wrap gap-3">
            {winners.map((winner, i) => (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={`${winner}-${i}`}
                className="px-6 py-3 bg-[#F0FDF4] border border-green-100 rounded-2xl text-lg font-bold text-green-700 flex items-center gap-3 shadow-sm"
              >
                <span className="w-6 h-6 rounded-full bg-green-200 text-green-800 flex items-center justify-center text-[10px]">
                  {winners.length - i}
                </span>
                {winner}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

