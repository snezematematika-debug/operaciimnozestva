import React from 'react';
import { Play } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    // Background: Sage Green School Chalkboard style
    <div className="min-h-screen bg-[#5C8065] flex flex-col items-center justify-center p-4 overflow-hidden relative"
         style={{ background: 'radial-gradient(circle at center, #729b7f 0%, #4a6b55 100%)' }}>
       {/* Background decorative elements - Chalk dust pattern */}
       <div className="absolute inset-0 opacity-20 pointer-events-none" 
            style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '24px 24px'}}>
       </div>

       {/* The Notebook Cover - Changed to Vintage Paper (Cream) */}
       <div 
         className="relative w-full max-w-[400px] aspect-[3/4] rounded-r-3xl rounded-l-md shadow-[20px_20px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden transform transition-transform duration-500 hover:scale-[1.02]"
         style={{
            backgroundColor: '#f0e6d2', // Vintage Cream/Beige
            // Subtle paper noise texture via CSS gradient
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.05) 100%), 
                              radial-gradient(#d6cba0 1px, transparent 1px)`
            ,
            backgroundSize: '100% 100%, 16px 16px'
         }}
       >
          {/* Spine (Binding) area on the left - Dark Textured Brown */}
          <div className="absolute top-0 bottom-0 left-0 w-8 bg-[#3f2e22] border-r border-black/20 z-20 flex flex-col justify-between py-4 items-center">
             {/* Binding stitches simulation */}
             {Array.from({length: 8}).map((_, i) => (
                <div key={i} className="w-6 h-0.5 bg-[#5d4632] shadow-sm"></div>
             ))}
          </div>
          
          {/* Subtle overlay for aging effect */}
          <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-yellow-900/20 to-transparent pointer-events-none"></div>

          {/* Content Area (The Label) */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 pl-12 relative z-10">
             
             {/* The White Label Sticker */}
             <div className="bg-white w-full p-6 shadow-md transform -rotate-1 border border-slate-200 relative">
                {/* Tape on corners */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-yellow-100/80 rotate-1 shadow-sm opacity-80 backdrop-blur-sm border border-yellow-200"></div>

                <div className="text-center space-y-2">
                   <div className="uppercase tracking-widest text-xs font-bold text-slate-500 border-b border-slate-200 pb-2 mb-2">
                      Математика • VI/VII Одд.
                   </div>
                   
                   <h1 className="font-handwriting text-4xl text-slate-800 font-bold leading-tight">
                      Работна Тетратка
                   </h1>
                   
                   <h2 className="font-sans text-sm font-bold text-[#3f2e22] uppercase tracking-wider mt-2">
                      Операции со Множества
                   </h2>

                   {/* Lines for writing name (decorative) */}
                   <div className="mt-6 space-y-3 opacity-50">
                      <div className="h-px bg-slate-300 w-full"></div>
                      <div className="h-px bg-slate-300 w-full"></div>
                   </div>
                </div>
             </div>

             {/* Action Button */}
             <button 
                onClick={onStart}
                className="mt-12 group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#2f4f40] text-white font-bold rounded-full shadow-lg hover:bg-[#3d6653] hover:shadow-green-900/30 transition-all transform hover:-translate-y-1 active:translate-y-0 active:shadow-md border border-[#4a7c62]"
             >
                <span className="uppercase tracking-wide text-sm">Отвори Тетратка</span>
                <div className="bg-white/20 rounded-full p-1 group-hover:bg-white/30 transition-colors">
                   <Play size={16} fill="currentColor" />
                </div>
             </button>

          </div>
          
          {/* Bottom decorative branding */}
          <div className="absolute bottom-6 left-0 right-0 text-center text-[#5d4632] text-[10px] uppercase tracking-[0.3em] pl-8 opacity-60 font-bold">
             Интерактивно Издание • 2025
          </div>
       </div>
    </div>
  );
};