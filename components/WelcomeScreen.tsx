import React from 'react';
import { Play } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    // Background: Wooden Desk style
    <div className="min-h-screen bg-[#dccbb6] flex flex-col items-center justify-center p-4 overflow-hidden relative">
       {/* Background decorative elements */}
       <div className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{backgroundImage: 'radial-gradient(#a3866a 2px, transparent 2px)', backgroundSize: '30px 30px'}}>
       </div>

       {/* The Notebook Cover */}
       <div 
         className="relative w-full max-w-[400px] aspect-[3/4] rounded-r-3xl rounded-l-md shadow-[20px_20px_60px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden transform transition-transform duration-500 hover:scale-[1.02]"
         style={{
            backgroundColor: '#312e81', // Indigo 900 base
            // Subtle texture gradient
            backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)'
         }}
       >
          {/* Spine (Binding) area on the left */}
          <div className="absolute top-0 bottom-0 left-0 w-8 bg-[#1e1b4b] border-r border-indigo-800/50 z-20"></div>
          
          {/* Leather texture effect overlay */}
          <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-black pointer-events-none"></div>

          {/* Content Area (The Label) */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 pl-12 relative z-10">
             
             {/* The White Label Sticker */}
             <div className="bg-[#fdfbf7] w-full p-6 shadow-md transform -rotate-1 border-2 border-dashed border-gray-300 relative">
                {/* Tape on corners */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-yellow-100/80 rotate-1 shadow-sm opacity-80 backdrop-blur-sm"></div>

                <div className="text-center space-y-2">
                   <div className="uppercase tracking-widest text-xs font-bold text-gray-400 border-b border-gray-200 pb-2 mb-2">
                      Математика • VI/VII Одд.
                   </div>
                   
                   <h1 className="font-handwriting text-4xl text-slate-800 font-bold leading-tight">
                      Работна Тетратка
                   </h1>
                   
                   <h2 className="font-sans text-sm font-bold text-indigo-600 uppercase tracking-wider mt-2">
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
                className="mt-12 group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-orange-500 text-white font-bold rounded-full shadow-lg hover:bg-orange-600 hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1 active:translate-y-0 active:shadow-md"
             >
                <span className="uppercase tracking-wide text-sm">Отвори Тетратка</span>
                <div className="bg-white/20 rounded-full p-1 group-hover:bg-white/30 transition-colors">
                   <Play size={16} fill="currentColor" />
                </div>
             </button>

          </div>
          
          {/* Bottom decorative branding */}
          <div className="absolute bottom-6 left-0 right-0 text-center text-indigo-200/40 text-[10px] uppercase tracking-[0.3em] pl-8">
             Интерактивно Издание • 2025
          </div>
       </div>
    </div>
  );
};