import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Users, LayoutGrid, Shuffle, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface GrouperProps {
  names: string[];
}

export function Grouper({ names }: GrouperProps) {
  const [peoplePerGroup, setPeoplePerGroup] = useState(4);
  const [groups, setGroups] = useState<string[][]>([]);

  const shuffleArray = (array: string[]) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const handleGroup = () => {
    if (names.length === 0) return;
    
    const shuffled = shuffleArray(names);
    const result: string[][] = [];
    
    for (let i = 0; i < shuffled.length; i += peoplePerGroup) {
      result.push(shuffled.slice(i, i + peoplePerGroup));
    }
    
    setGroups(result);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;
    
    let csvContent = "Group,Name\n";
    groups.forEach((group, idx) => {
      group.forEach(name => {
        csvContent += `Group ${idx + 1},${name}\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "grouping_results.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white rounded-[32px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 space-y-8">
        <div className="max-w-xl mx-auto space-y-8">
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <Label className="text-lg font-bold text-slate-700">每组人数</Label>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-400">
                  预计分为 {names.length > 0 ? Math.ceil(names.length / peoplePerGroup) : 0} 组
                </span>
                <input
                  type="number"
                  min={2}
                  max={names.length || 100}
                  value={peoplePerGroup}
                  onChange={(e) => setPeoplePerGroup(Math.max(2, parseInt(e.target.value) || 2))}
                  className="w-16 h-10 bg-indigo-50 text-[#7C3AED] rounded-xl font-black text-xl border border-indigo-100 text-center focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>
            </div>

            {/* Quick Select Buttons */}
            <div className="flex flex-wrap gap-2">
              {[2, 3, 4, 5, 6, 8, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setPeoplePerGroup(num)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                    peoplePerGroup === num
                      ? "bg-[#7C3AED] text-white border-[#7C3AED] shadow-md shadow-indigo-100"
                      : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-500"
                  )}
                >
                  {num} 人
                </button>
              ))}
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={2}
                  max={Math.max(20, names.length)}
                  step={1}
                  value={peoplePerGroup}
                  onChange={(e) => setPeoplePerGroup(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase tracking-widest px-1 mt-2">
                <span>2 人</span>
                <span>{Math.max(20, names.length)} 人</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button 
              onClick={handleGroup} 
              disabled={names.length === 0}
              className="flex-1 h-16 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl text-xl font-bold gap-3 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]"
            >
              <Shuffle className="w-6 h-6" />
              立即开始分组
            </Button>
            {groups.length > 0 && (
              <Button 
                onClick={downloadCSV}
                variant="outline"
                className="h-16 px-6 border-2 border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 gap-2 font-bold"
              >
                <Download className="w-6 h-6" />
                下载结果
              </Button>
            )}
          </div>
        </div>

        {groups.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 border-t border-dashed border-slate-200">
            {groups.map((group, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={`group-${idx}`}
                className="bg-[#F9FAFB] rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="bg-white px-5 py-3 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
                    GROUP {idx + 1}
                  </span>
                  <span className="text-xs bg-indigo-50 text-[#5D5FEF] px-3 py-1 rounded-full font-bold">
                    {group.length} 人
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  {group.map((name, nIdx) => (
                    <div key={nIdx} className="flex items-center gap-3 text-lg text-slate-700 font-medium">
                      <div className="w-2 h-2 rounded-full bg-[#5D5FEF] opacity-40 group-hover:opacity-100 transition-opacity" />
                      {name}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

