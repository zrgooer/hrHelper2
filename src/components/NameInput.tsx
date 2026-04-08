import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { FileText, Upload, Trash2, UserPlus, Users, Sparkles, UserMinus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Papa from 'papaparse';

interface NameInputProps {
  onNamesChange: (names: string[]) => void;
  currentNames: string[];
}

export function NameInput({ onNamesChange, currentNames }: NameInputProps) {
  const [textInput, setTextInput] = useState('');

  const mockNames = ['Dean', 'Ivan', 'Kany', 'Taiming', 'Angela', 'Steve', 'Jobs', 'Elon', 'Musk', 'Bill', 'Gates'];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const names = results.data
          .flat()
          .map((n: any) => String(n).trim())
          .filter((n) => n.length > 0);
        
        onNamesChange([...currentNames, ...names]);
      },
      header: false,
    });
  };

  const handleAddNames = () => {
    const names = textInput
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    
    onNamesChange([...currentNames, ...names]);
    setTextInput('');
  };

  const loadMockData = () => {
    onNamesChange([...currentNames, ...mockNames]);
  };

  const clearNames = () => {
    onNamesChange([]);
  };

  const removeDuplicates = () => {
    onNamesChange([...new Set(currentNames)]);
  };

  const findDuplicates = () => {
    const seen = new Set();
    const duplicates = new Set();
    currentNames.forEach(name => {
      if (seen.has(name)) {
        duplicates.add(name);
      }
      seen.add(name);
    });
    return duplicates;
  };

  const duplicates = findDuplicates();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Left Column: Input */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#1F2937] font-bold">
            <FileText className="w-5 h-5 text-[#5D5FEF]" />
            输入姓名
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={loadMockData}
              className="text-[#5D5FEF] hover:bg-indigo-50 gap-1 text-xs font-bold"
            >
              <Sparkles className="w-3 h-3" />
              模拟名单
            </Button>
            <div className="relative">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <Button variant="secondary" size="sm" className="bg-[#F3F4F6] text-slate-600 hover:bg-slate-200 gap-2">
                <Upload className="w-4 h-4" />
                上传 CSV
              </Button>
            </div>
          </div>
        </div>

        <div className="relative">
          <Textarea
            placeholder="Dean\nIvan\nKany..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="min-h-[300px] text-lg p-6 rounded-2xl border-2 border-slate-200 focus:border-[#5D5FEF] focus:ring-0 transition-all resize-none"
          />
        </div>

        <Button 
          onClick={handleAddNames}
          className="w-full h-14 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl text-lg font-bold gap-2 shadow-lg shadow-indigo-200"
        >
          <UserPlus className="w-6 h-6" />
          加入名单
        </Button>
      </div>

      {/* Right Column: Current List */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 space-y-6 min-h-[500px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-[#1F2937] font-bold">目前名单</div>
            {duplicates.size > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={removeDuplicates}
                className="h-7 px-2 border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700 text-[10px] font-bold gap-1"
              >
                <UserMinus className="w-3 h-3" />
                移除重复 ({duplicates.size})
              </Button>
            )}
          </div>
          {currentNames.length > 0 && (
            <button 
              onClick={clearNames}
              className="text-red-400 hover:text-red-600 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              清空
            </button>
          )}
        </div>

        <div className="bg-[#F9FAFB] rounded-2xl p-4 min-h-[400px]">
          {currentNames.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 py-20">
              <Users className="w-12 h-12 opacity-20" />
              <p>暂无名单</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentNames.map((name, i) => {
                const isDuplicate = currentNames.indexOf(name) !== i;
                return (
                  <div 
                    key={`${name}-${i}`}
                    className={cn(
                      "flex items-center gap-4 group animate-in slide-in-from-left-2 duration-300 p-1 rounded-lg transition-colors",
                      isDuplicate ? "bg-orange-50/50 ring-1 ring-orange-100" : ""
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                      isDuplicate ? "bg-orange-200 text-orange-700" : "bg-[#E0E7FF] text-[#5D5FEF]"
                    )}>
                      {i + 1}
                    </div>
                    <div className={cn(
                      "text-lg font-medium",
                      isDuplicate ? "text-orange-700" : "text-slate-700"
                    )}>
                      {name}
                      {isDuplicate && <span className="ml-2 text-[10px] font-bold uppercase tracking-tighter opacity-60">(重复)</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

