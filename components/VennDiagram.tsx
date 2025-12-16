import React from 'react';

export const getVennRegion = (
  x: number, 
  y: number, 
  width: number, 
  height: number
): 'left' | 'right' | 'intersection' | null => {
  const scaleX = 300 / width;
  const scaleY = 200 / height;
  
  const svgX = x * scaleX;
  const svgY = y * scaleY;

  const cx1 = 100;
  const cx2 = 200;
  const cy = 100;
  const r = 80;

  const d1 = Math.sqrt(Math.pow(svgX - cx1, 2) + Math.pow(svgY - cy, 2));
  const d2 = Math.sqrt(Math.pow(svgX - cx2, 2) + Math.pow(svgY - cy, 2));

  if (d1 < r && d2 < r) return 'intersection';
  if (d1 < r) return 'left';
  if (d2 < r) return 'right';
  return null;
};

interface VennDiagramProps {
  mode: 'display' | 'interactive' | 'selectable';
  elements?: { left: number[]; right: number[]; intersection: number[] };
  selectedRegion?: 'left' | 'right' | 'intersection' | 'union' | null;
  onRegionClick?: (region: 'left' | 'right' | 'intersection') => void;
  width?: number;
  height?: number;
  className?: string;
}

export const VennDiagram: React.FC<VennDiagramProps> = ({ 
  mode, 
  elements = { left: [], right: [], intersection: [] }, 
  selectedRegion, 
  onRegionClick,
  width = 300,
  height = 200,
  className = ''
}) => {
  
  const cx1 = 100;
  const cx2 = 200;
  const cy = 100;
  const r = 80;

  const fillColor = '#6366f1'; // indigo-500
  const unionColor = '#a5b4fc'; // indigo-300
  const opacity = 0.6;

  return (
    <div className={`relative select-none ${className}`} style={{ width: '100%', maxWidth: width, aspectRatio: '3/2' }}>
      <svg width="100%" height="100%" viewBox="0 0 300 200" className="overflow-visible font-handwriting">
        <defs>
          <mask id="mask-right-cut">
            <rect x="0" y="0" width="300" height="200" fill="white" />
            <circle cx={cx2} cy={cy} r={r} fill="black" />
          </mask>
          <mask id="mask-left-cut">
             <rect x="0" y="0" width="300" height="200" fill="white" />
             <circle cx={cx1} cy={cy} r={r} fill="black" />
          </mask>
          <clipPath id="clip-right">
            <circle cx={cx2} cy={cy} r={r} />
          </clipPath>
        </defs>

        {/* FILLS */}

        {/* Union: Fill both */}
        {selectedRegion === 'union' && (
          <g opacity={opacity}>
            <circle cx={cx1} cy={cy} r={r} fill={unionColor} />
            <circle cx={cx2} cy={cy} r={r} fill={unionColor} />
          </g>
        )}

        {/* Intersection: Left circle clipped by Right circle */}
        {selectedRegion === 'intersection' && (
          <circle cx={cx1} cy={cy} r={r} fill={fillColor} fillOpacity={opacity} clipPath="url(#clip-right)" />
        )}

        {/* Left Only (A \ B): Left circle masked by Right */}
        {selectedRegion === 'left' && (
          <circle cx={cx1} cy={cy} r={r} fill={fillColor} fillOpacity={opacity} mask="url(#mask-right-cut)" />
        )}

        {/* Right Only (B \ A): Right circle masked by Left */}
        {selectedRegion === 'right' && (
          <circle cx={cx2} cy={cy} r={r} fill={fillColor} fillOpacity={opacity} mask="url(#mask-left-cut)" />
        )}

        {/* OUTLINES (Always visible on top) */}
        <circle 
          cx={cx1} cy={cy} r={r} 
          fill="transparent" 
          stroke="#1e293b" strokeWidth="2"
          className={onRegionClick ? "cursor-pointer hover:stroke-indigo-600 transition-colors" : ""}
          onClick={() => onRegionClick && onRegionClick('left')}
        />
        <circle 
          cx={cx2} cy={cy} r={r} 
          fill="transparent" 
          stroke="#1e293b" strokeWidth="2"
          className={onRegionClick ? "cursor-pointer hover:stroke-indigo-600 transition-colors" : ""}
          onClick={() => onRegionClick && onRegionClick('right')}
        />

        {/* LABELS - Scalable SVG Text positioned in corners */}
        <text x="20" y="30" fontSize="24" fontWeight="bold" fill="#334155" className="pointer-events-none">A</text>
        <text x="280" y="30" fontSize="24" fontWeight="bold" fill="#334155" textAnchor="end" className="pointer-events-none">B</text>
      </svg>

      {/* Elements Rendering */}
      {/* LEFT Region */}
      <div className="absolute top-1/2 left-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-wrap gap-1 w-20 justify-center pointer-events-none">
        {elements.left.map(e => (
          <span key={e} className="font-handwriting text-sm bg-white border border-slate-300 shadow-sm rounded-full w-6 h-6 flex items-center justify-center">
            {e}
          </span>
        ))}
      </div>

      {/* INTERSECTION Region */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-wrap gap-1 w-12 justify-center pointer-events-none">
        {elements.intersection.map(e => (
          <span key={e} className="font-handwriting text-sm bg-white border border-slate-300 shadow-sm rounded-full w-6 h-6 flex items-center justify-center">
            {e}
          </span>
        ))}
      </div>

      {/* RIGHT Region */}
      <div className="absolute top-1/2 left-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-wrap gap-1 w-20 justify-center pointer-events-none">
        {elements.right.map(e => (
          <span key={e} className="font-handwriting text-sm bg-white border border-slate-300 shadow-sm rounded-full w-6 h-6 flex items-center justify-center">
            {e}
          </span>
        ))}
      </div>
    </div>
  );
};