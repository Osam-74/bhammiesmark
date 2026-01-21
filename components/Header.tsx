
import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-100 py-3 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 shrink-0">
            <ShieldCheck size={28} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold text-slate-900 leading-none tracking-tight">BhammiesMark</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] leading-loose">Privacy First Watermarking</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tighter">Status</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-bold text-slate-700">Protected & Offline</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
