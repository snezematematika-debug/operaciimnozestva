import React, { useState } from 'react';
import { PaperBackground } from './PaperBackground';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookProps {
  pages: React.ReactNode[];
}

export const Book: React.FC<BookProps> = ({ pages }) => {
  // We track "sheet" index now, not page index.
  // Sheet 0: Front = Page 1, Back = Page 2
  // Sheet 1: Front = Page 3, Back = Page 4
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);

  // Group pages into sheets
  const sheets = [];
  for (let i = 0; i < pages.length; i += 2) {
    sheets.push({
      front: pages[i],
      back: pages[i + 1] || null, // Back might be empty if odd number of pages
    });
  }

  const totalSheets = sheets.length;

  const flipPage = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentSheetIndex < totalSheets) {
      setCurrentSheetIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentSheetIndex > 0) {
      setCurrentSheetIndex(prev => prev - 1);
    }
  };

  return (
    // Added style={{ height: '600px' }} to ensure it takes space even if Tailwind fails
    <div className="relative w-full max-w-6xl perspective-2000 mx-auto my-8 flex justify-center items-center" style={{ height: '600px' }}>
       
       {/* Book Container */}
       <div className="relative w-full h-full flex justify-center">
          
          {/* Static Spiral Binding - Centered */}
          <div className="absolute left-1/2 top-4 bottom-4 w-12 -ml-6 z-50 flex flex-col justify-evenly pointer-events-none">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-full h-6 bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-400 rounded-full shadow-lg border border-zinc-500 transform -rotate-2"></div>
              ))}
          </div>

          {/* Render Sheets */}
          {sheets.map((sheet, index) => {
             // Logic:
             // If this sheet's index is less than currentSheetIndex, it is FLIPPED (on the left pile).
             // If it equals or is greater, it is NOT FLIPPED (on the right pile).
             const isFlipped = index < currentSheetIndex;
             
             // Z-Index Logic:
             // If not flipped (Right pile): Lower indexes are on TOP. (0 on top of 1)
             // If flipped (Left pile): Higher indexes are on TOP. (0 flipped is under 1 flipped)
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
                 {/* FRONT FACE (Visible when sheet is on the Right) */}
                 {/* Replaced shadow-book with standard shadow-2xl */}
                 <div className={`absolute inset-0 backface-hidden overflow-hidden rounded-r-xl shadow-2xl bg-white border-l-4 border-zinc-300 ${!isFlipped ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                   <PaperBackground>
                      {sheet.front}
                      <div className="absolute bottom-4 right-6 text-gray-400 font-handwriting text-sm">
                        {index * 2 + 1}
                      </div>
                   </PaperBackground>
                 </div>

                 {/* BACK FACE (Visible when sheet is on the Left) */}
                 <div 
                    className={`absolute inset-0 backface-hidden overflow-hidden rounded-l-xl shadow-2xl bg-[#fdfbf7] border-r-4 border-zinc-300 rotate-y-180 ${isFlipped ? 'pointer-events-auto' : 'pointer-events-none'}`}
                 >
                    <PaperBackground className="">
                      {/* Render the next page content */}
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
                    
                    {/* Shadow Overlay for depth when flipped */}
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/5 pointer-events-none"></div>
                 </div>
               </div>
             );
          })}
       </div>

      {/* Navigation Controls - Moved to Sides */}
      
      {/* PREVIOUS BUTTON (Left Side) */}
      <div className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 z-50">
        <button
          onClick={() => flipPage('prev')}
          disabled={currentSheetIndex === 0}
          className="bg-indigo-600 text-white p-3 rounded-full shadow-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors flex items-center justify-center transform hover:scale-110 active:scale-95"
          title="Назад"
        >
          <ChevronLeft size={32} />
        </button>
      </div>
      
      {/* NEXT BUTTON (Right Side) */}
      <div className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 z-50">
        <button
          onClick={() => flipPage('next')}
          disabled={currentSheetIndex === totalSheets} 
          className="bg-indigo-600 text-white p-3 rounded-full shadow-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors flex items-center justify-center transform hover:scale-110 active:scale-95"
          title="Напред"
        >
          <ChevronRight size={32} />
        </button>
      </div>

    </div>
  );
};