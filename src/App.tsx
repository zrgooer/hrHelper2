import React, { useState } from 'react';
import { NameInput } from './components/NameInput';
import { LuckyDraw } from './components/LuckyDraw';
import { Grouper } from './components/Grouper';
import { PencilLine, Gift, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function App() {
  const [names, setNames] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('manage');

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-[#5D5FEF] tracking-tight">HR 小帮手</h1>
            <div className="px-3 py-1 bg-[#E0E7FF] text-[#5D5FEF] text-sm font-medium rounded-full">
              {names.length} 人员
            </div>
          </div>
          
          <nav className="flex items-center gap-8 h-full">
            <button 
              onClick={() => setActiveTab('manage')}
              className={cn(
                "flex items-center gap-2 h-full px-2 border-b-4 transition-all duration-200 font-medium",
                activeTab === 'manage' ? "border-[#5D5FEF] text-[#1F2937]" : "border-transparent text-slate-400 hover:text-slate-600"
              )}
            >
              <PencilLine className="w-5 h-5" />
              名单管理
            </button>
            <button 
              onClick={() => setActiveTab('draw')}
              className={cn(
                "flex items-center gap-2 h-full px-2 border-b-4 transition-all duration-200 font-medium",
                activeTab === 'draw' ? "border-[#5D5FEF] text-[#1F2937]" : "border-transparent text-slate-400 hover:text-slate-600"
              )}
            >
              <Gift className="w-5 h-5" />
              幸运抽签
            </button>
            <button 
              onClick={() => setActiveTab('group')}
              className={cn(
                "flex items-center gap-2 h-full px-2 border-b-4 transition-all duration-200 font-medium",
                activeTab === 'group' ? "border-[#5D5FEF] text-[#1F2937]" : "border-transparent text-slate-400 hover:text-slate-600"
              )}
            >
              <Users className="w-5 h-5" />
              自动分组
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {activeTab === 'manage' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-[#1F2937]">名单管理</h2>
              <p className="text-slate-500 text-lg">
                请输入姓名（每行一个）或上传 CSV 档案。目前共有 <span className="text-[#5D5FEF] font-bold">{names.length}</span> 位人员。
              </p>
            </div>
            <NameInput onNamesChange={setNames} currentNames={names} />
          </div>
        )}

        {activeTab === 'draw' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-[#1F2937]">幸运抽签</h2>
              <p className="text-slate-500 text-lg">点击开始，抽取今天的幸运儿！</p>
            </div>
            <LuckyDraw names={names} />
          </div>
        )}

        {activeTab === 'group' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-[#1F2937]">自动分组</h2>
              <p className="text-slate-500 text-lg">设定每组人数，系统将自动为您随机分配。</p>
            </div>
            <Grouper names={names} />
          </div>
        )}
      </main>
    </div>
  );
}


