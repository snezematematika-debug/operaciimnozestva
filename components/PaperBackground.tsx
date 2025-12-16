import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const PaperBackground: React.FC<Props> = ({ children, className = '' }) => {
  return (
    <div 
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{
        backgroundColor: '#fdfbf7', // Fallback for bg-paper
        // Create a grid pattern using two linear gradients
        backgroundImage: `
          linear-gradient(#e5e7eb 1px, transparent 1px), 
          linear-gradient(90deg, #e5e7eb 1px, transparent 1px)
        `,
        backgroundSize: '2rem 2rem', // Size of the squares
        backgroundPosition: '0 0'
      }}
    >
      {/* Margin Line - explicitly colored */}
      <div className="absolute top-0 bottom-0 left-8 w-px bg-[#fca5a5] z-0"></div>
      
      {/* Content */}
      <div className="relative z-10 px-8 py-4 h-full font-handwriting text-slate-800 text-lg overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </div>
  );
};