import React, { useState, useEffect, useRef } from 'react';
import { PaperBackground } from './PaperBackground';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookProps {
  pages: React.ReactNode[];
}

export const Book: React.FC<BookProps> = ({ pages }) => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Unified index: 0 to pages.length - 1
  // In Desktop: Sheet Index = Math.floor(currentIndex / 2)
  // In Mobile: Page Index = currentIndex
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- Resize Listener ---
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    
    // Initial check
    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- Desktop Logic (Sheets) ---
  const currentSheetIndex = Math.floor(currentIndex / 2);
  
  const sheets = [];
  for (let i = 0; i < pages.length; i += 2) {
    sheets.push({
      front: pages[i],
      back: pages[i + 1] || null,
    });
  }
  const totalSheets = sheets.length;

  const flipDesktop = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentSheetIndex < totalSheets) {
      setCurrentIndex((currentSheetIndex + 1) * 2);
    } else if (direction === 'prev' && currentSheetIndex > 0) {
      setCurrentIndex((currentSheetIndex - 1) * 2);
    }
  };

  // --- Mobile Logic (Swipe & Single Page) ---
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < pages.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const flipMobile = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentIndex < pages.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // --- RENDER ---

  // 1. MOBILE VIEW
  if (isMobile) {
    return (
      <div className="flex flex-col items-center w-full max-w-md mx-auto h-[calc(100vh-160px)] min-h-[500px]">
        {/* Mobile Page Container */}
        <div 
          className="relative w-full flex-1 bg-white rounded-xl shadow-xl overflow-hidden border border-slate-300"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <PaperBackground className="h-full">
            {pages[currentIndex]}
            
            {/* Page Number */}
            <div className="absolute bottom-3 right-4 text-gray-400 font-handwriting text-sm">
              {currentIndex + 1} / {pages.length}
            </div>
          </PaperBackground>
        </div>

        {/* Mobile Navigation Controls */}
        <div className="flex items-center justify-between w-full mt-4 px-4">
          <button
            onClick={() => flipMobile('prev')}
            disabled={currentIndex === 0}
            className={`p-3 rounded-full shadow-md transition-all ${
              currentIndex === 0 
                ? 'bg-gray-200 text-gray-400' 
                : 'bg-indigo-600 text-white active:scale-95'
            }`}
          >
            <ChevronLeft size={24} />
          </button>
          
          <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">
            Страница {currentIndex + 1}
          </span>

          <button
            onClick={() => flipMobile('next')}
            disabled={currentIndex === pages.length - 1}
            className={`p-3 rounded-full shadow-md transition-all ${
              currentIndex === pages.length - 1 
                ? 'bg-gray-200 text-gray-400' 
                : 'bg-indigo-600 text-white active:scale-95'
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  // 2. DESKTOP VIEW (3D Flip Book)
  return (
    <div className="relative w-full max-w-6xl perspective-2000 mx-auto my-8 flex justify-center items-center h-[600px]">
       
       {/* Book Container */}
       <div className="relative w-full h-full flex justify-center">
          
          {/* Static Spiral Binding */}
          <div className="absolute left-1/2 top-4 bottom-4 w-12 -ml-6 z-50 flex flex-col justify-evenly pointer-events-none">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-full h-6 bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-400 rounded-full shadow-lg border border-zinc-500 transform -rotate-2"></div>
              ))}
          </div>

          {/* Render Sheets */}
          {sheets.map((sheet, index) => {
             const isFlipped = index < currentSheetIndex;
             // Determine Z-Index for stacking order
             const zIndex = isFlipped ? index : (totalSheets - index);

             return (
               <div
                 key={index}
                 className="absolute top-0 w-1/2 h-full origin-right transition-transform duration-700 ease-in-out transform-style-3d left-0"
                 style={{
                   left: '50%',
                   transformOrigin: 'left center',
                   transform: `rotateY(${isFlipped ? '-180deg' : '0deg'})`,
                   zIndex: zIndex, 
                 }}
               >
                 {/* FRONT FACE (Right Page) */}
                 <div className={`absolute inset-0 backface-hidden overflow-hidden rounded-r-xl shadow-2xl bg-white border-l-4 border-zinc-300 ${!isFlipped ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                   <PaperBackground>
                      {sheet.front}
                      <div className="absolute bottom-4 right-6 text-gray-400 font-handwriting text-sm">
                        {index * 2 + 1}
                      </div>
                   </PaperBackground>
                 </div>

                 {/* BACK FACE (Left Page) */}
                 <div 
                    className={`absolute inset-0 backface-hidden overflow-hidden rounded-l-xl shadow-2xl bg-[#fdfbf7] border-r-4 border-zinc-300 rotate-y-180 ${isFlipped ? 'pointer-events-auto' : 'pointer-events-none'}`}
                 >
                    <PaperBackground>
                      {sheet.back ? (
                        <>
                          {sheet.back}
                          <div className="absolute bottom-4 left-6 text-gray-400 font-handwriting text-sm">
                            {index * 2 + 2}
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-300 font-handwriting text-2xl">
                          Крај
                        </div>
                      )}
                    </PaperBackground>
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/5 pointer-events-none"></div>
                 </div>
               </div>
             );
          })}
       </div>

      {/* Desktop Navigation Controls */}
      <div className="absolute -left-16 top-1/2 -translate-y-1/2 z-50">
        <button
          onClick={() => flipDesktop('prev')}
          disabled={currentSheetIndex === 0}
          className="bg-indigo-600 text-white p-3 rounded-full shadow-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors flex items-center justify-center transform hover:scale-110 active:scale-95"
          title="Назад"
        >
          <ChevronLeft size={32} />
        </button>
      </div>
      
      <div className="absolute -right-16 top-1/2 -translate-y-1/2 z-50">
        <button
          onClick={() => flipDesktop('next')}
          disabled={currentSheetIndex >= totalSheets} 
          className="bg-indigo-600 text-white p-3 rounded-full shadow-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors flex items-center justify-center transform hover:scale-110 active:scale-95"
          title="Напред"
        >
          <ChevronRight size={32} />
        </button>
      </div>

    </div>
  );
};