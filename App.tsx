// ... (imports remain the same)
import React, { useState, useEffect } from 'react';
import { Book } from './components/Book';
import { VennDiagram, getVennRegion } from './components/VennDiagram';
import { DrawingCanvas } from './components/DrawingCanvas';
import { WelcomeScreen } from './components/WelcomeScreen';
import { getMathHint } from './services/geminiService';
import { CheckCircle, Undo2, Check, X } from 'lucide-react';

export default function App() {
  // ... (All state and helper functions remain exactly the same until Page9)
  // --- Global State ---
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).MathJax) {
      setTimeout(() => {
        try {
          if ((window as any).MathJax.typesetPromise) {
            (window as any).MathJax.typesetPromise().catch((err: any) => 
              console.debug('MathJax typeset deferred:', err)
            );
          }
        } catch(e) {
          console.error("MathJax error:", e);
        }
      }, 100);
    }
  });

  const normalizeSet = (val: string) => {
    const cleaned = val.replace(/[{}]/g, '').replace(/∅/g, '').trim();
    if (!cleaned) return ""; 
    return cleaned
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== "")
      .map(n => isNaN(Number(n)) ? n : Number(n))
      .sort((a, b) => (typeof a === 'number' && typeof b === 'number') ? a - b : 0)
      .join(',');
  };

  const [p1Selection, setP1Selection] = useState<string | null>(null);
  const [p1Feedback, setP1Feedback] = useState<string>("");

  const [p2IntersectionInput, setP2IntersectionInput] = useState("");
  const [p2UnionInput, setP2UnionInput] = useState("");
  const [p2Feedback, setP2Feedback] = useState<{type: 'idle'|'success'|'error', msg: string}>({type:'idle', msg:''});
  const [p2Loading, setP2Loading] = useState(false);
  const initialDraggables = [0, 1, 2, 3, 4, 5, 6];
  const [p2DragState, setP2DragState] = useState<Record<number, string>>(
    initialDraggables.reduce((acc, num) => ({ ...acc, [num]: 'bank' }), {})
  );
  const [p2DragFeedback, setP2DragFeedback] = useState("");

  const [p3Inputs, setP3Inputs] = useState({ a: '', b: '', c: '', d: '' });
  const [p3Feedback, setP3Feedback] = useState<{type: 'idle'|'success'|'error', msg: string}>({type:'idle', msg:''});

  const [p4Inputs, setP4Inputs] = useState({ defA: '', defB: '', defC: '', a: '', b: '', c: '' });
  const [p4Feedback, setP4Feedback] = useState<{type: 'idle'|'success'|'error', msg: string}>({type:'idle', msg:''});

  const [p5Inputs, setP5Inputs] = useState({ int: '', a: '', b: '' });
  const [p5Feedback, setP5Feedback] = useState<{type: 'idle'|'success'|'error', msg: string}>({type:'idle', msg:''});

  const [p6SelectedLabel, setP6SelectedLabel] = useState<string | null>(null);
  const [p6Matches, setP6Matches] = useState<{[key: number]: string}>({});
  const [p6Feedback, setP6Feedback] = useState<{type: 'idle'|'success'|'error', msg: string}>({type:'idle', msg:''});

  const [p7Answer, setP7Answer] = useState("");
  const [p7Feedback, setP7Feedback] = useState<{type: 'idle'|'success'|'error', msg: string}>({type:'idle', msg:''});

  const [p8Answer, setP8Answer] = useState("");
  const [p8Feedback, setP8Feedback] = useState<{type: 'idle'|'success'|'error', msg: string}>({type:'idle', msg:''});

  const [p9Selection, setP9Selection] = useState<string | null>(null);
  const [p9Feedback, setP9Feedback] = useState<string>("");

  const [p10AnswerA, setP10AnswerA] = useState("");
  const [p10AnswerB, setP10AnswerB] = useState("");
  const [p10Feedback, setP10Feedback] = useState<{type: 'idle'|'success'|'error', msg: string}>({type:'idle', msg:''});


  const checkP1 = (val: string) => {
    setP1Selection(val);
    if (val === 'c') setP1Feedback("Точно! Пресекот се само заедничките делители.");
    else setP1Feedback("Неточно. Пробај пак.");
  };

  const checkP2 = async () => {
    setP2Loading(true);
    const userInt = normalizeSet(p2IntersectionInput);
    const userUnion = normalizeSet(p2UnionInput);
    
    if (userInt === "2,3,6" && userUnion === "0,1,2,3,4,5,6") {
      setP2Feedback({type: 'success', msg: "Браво! Ги одреди точно."});
    } else {
      const hint = await getMathHint(
        "Sets P={0,2,3,6}, R={1,2,3,4,5,6}. Find Intersection and Union.",
        `Int: {${userInt}}, Union: {${userUnion}}`,
        "Int: {2,3,6}, Union: {0,1,2,3,4,5,6}"
      );
      setP2Feedback({type: 'error', msg: hint});
    }
    setP2Loading(false);
  };

  const handleDragStart = (e: React.DragEvent, number: number) => {
    e.dataTransfer.setData("text/plain", number.toString());
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const numberStr = e.dataTransfer.getData("text/plain");
    const number = parseInt(numberStr, 10);
    if (isNaN(number)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const region = getVennRegion(x, y, rect.width, rect.height);
    setP2DragState(prev => ({ ...prev, [number]: region || 'bank' }));
  };
  const resetP2Drag = () => {
    setP2DragState(initialDraggables.reduce((acc, num) => ({ ...acc, [num]: 'bank' }), {}));
    setP2DragFeedback("");
  };
  const checkP2Drag = () => {
    const errors: string[] = [];
    if (p2DragState[0] !== 'left') errors.push("0");
    [2, 3, 6].forEach(n => { if (p2DragState[n] !== 'intersection') errors.push(`${n}`); });
    [1, 4, 5].forEach(n => { if (p2DragState[n] !== 'right') errors.push(`${n}`); });
    if (errors.length === 0) setP2DragFeedback("Одлично! Сите елементи се точно распоредени.");
    else setP2DragFeedback("Имаш грешки. Провери каде припаѓаат елементите.");
  };

  const checkP3 = () => {
    const ansA = normalizeSet(p3Inputs.a);
    const ansB = normalizeSet(p3Inputs.b);
    const ansC = normalizeSet(p3Inputs.c);
    const ansD = normalizeSet(p3Inputs.d);
    if (ansA === '2,5,7,9' && ansB === '5' && ansC === '5' && ansD === '9') {
      setP3Feedback({type: 'success', msg: "Точно! Ги совлада операциите."});
    } else {
      setP3Feedback({type: 'error', msg: "Имаш грешки. Провери ги уште еднаш."});
    }
  };

  const checkP4 = () => {
    const defA = normalizeSet(p4Inputs.defA);
    const defB = normalizeSet(p4Inputs.defB);
    const defC = normalizeSet(p4Inputs.defC);
    const ansA = normalizeSet(p4Inputs.a);
    const ansB = normalizeSet(p4Inputs.b);
    const ansC = normalizeSet(p4Inputs.c);

    const isDefACorrect = defA === "4,5";
    const isDefBCorrect = defB === "1,2,3,4,5,6,7,8";
    const isDefCCorrect = defC === "4,6";
    
    const isOpACorrect = ansA === "";
    const isOpBCorrect = ansB === "4,6";
    const isOpCCorrect = ansC === "";

    if (isDefACorrect && isDefBCorrect && isDefCCorrect && isOpACorrect && isOpBCorrect && isOpCCorrect) {
      setP4Feedback({type: 'success', msg: "Браво! Ги одреди множествата и ги реши задачите точно."});
    } else {
      let errors = [];
      if (!isDefACorrect) errors.push("Множество А");
      if (!isDefBCorrect) errors.push("Множество B");
      if (!isDefCCorrect) errors.push("Множество C");
      if (errors.length > 0) {
        setP4Feedback({type: 'error', msg: `Провери ги елементите на: ${errors.join(', ')}.`});
      } else {
        setP4Feedback({type: 'error', msg: "Множествата се точни, но имаш грешка во операциите долу."});
      }
    }
  };

  const checkP5 = () => {
    const ansInt = normalizeSet(p5Inputs.int);
    const ansA = normalizeSet(p5Inputs.a);
    const ansB = normalizeSet(p5Inputs.b);
    if (ansInt === '3,4' && ansA === '1,2,3,4' && ansB === '3,4,5,6') {
      setP5Feedback({type: 'success', msg: "Одлично! Ги реконструираше множествата."});
    } else {
      setP5Feedback({type: 'error', msg: "Обиди се повторно. Унијата ги содржи сите елементи."});
    }
  };

  const getRegionItems = (region: string) => {
    return Object.entries(p2DragState).filter(([_, r]) => r === region).map(([num]) => parseInt(num));
  };
  const labelsP6 = [
    { id: 'int', text: '\\( A \\cap B \\)' },
    { id: 'diffB', text: '\\( B \\setminus A \\)' },
    { id: 'union', text: '\\( A \\cup B \\)' },
    { id: 'diffA', text: '\\( A \\setminus B \\)' }
  ];
  
  const handleDiagramClick = (idx: number) => {
    if (p6SelectedLabel) {
      setP6Matches(prev => ({...prev, [idx]: p6SelectedLabel}));
      setP6SelectedLabel(null);
    }
  };

  const checkP6 = () => {
    const correctMap: {[key: number]: string} = {
      1: labelsP6[2].text,
      2: labelsP6[0].text,
      3: labelsP6[3].text,
      4: labelsP6[1].text
    };

    let allCorrect = true;
    let filled = 0;
    
    for (let i = 1; i <= 4; i++) {
        if (p6Matches[i]) filled++;
        if (p6Matches[i] !== correctMap[i]) {
            allCorrect = false;
        }
    }

    if (filled < 4) {
        setP6Feedback({type: 'error', msg: "Пополни ги сите полиња пред проверка."});
        return;
    }

    if (allCorrect) {
        setP6Feedback({type: 'success', msg: "Браво! Сите дијаграми се точно означени."});
    } else {
        setP6Feedback({type: 'error', msg: "Имаш грешки. Разгледај ги обоените делови внимателно."});
    }
  };

  const checkP7 = () => {
    if (!p7Answer.trim()) {
        setP7Feedback({type: 'error', msg: "Внеси го твојот одговор пред да провериш."});
        return;
    }
    const val = parseInt(p7Answer);
    if (val === 5) {
        setP7Feedback({type: 'success', msg: "Точно! 5 студенти играат и фудбал и кошарка."});
    } else {
        setP7Feedback({type: 'error', msg: "Неточно. Пробај ја формулата: |F U K| = |F| + |K| - |F n K|"});
    }
  }

  const checkP8 = () => {
    if (!p8Answer.trim()) {
        setP8Feedback({type: 'error', msg: "Внеси го твојот одговор пред да провериш."});
        return;
    }
    const val = parseInt(p8Answer);
    if (val === 69) {
        setP8Feedback({type: 'success', msg: "Точно! 69 луѓе праќаат текстуални пораки."});
    } else {
        setP8Feedback({type: 'error', msg: "Неточно. Пробај: Вкупно = Фото + Текст - Заеднички"});
    }
  }

  const checkP9 = (val: string) => {
    setP9Selection(val);
    if (val === 'd') setP9Feedback("Точно! Елементот 4 е во А и С, но не во В. Затоа не е во пресекот на А и В.");
    else setP9Feedback("Неточно. Разгледај го дијаграмот повторно.");
  };

  const checkP10 = () => {
    if (!p10AnswerA.trim() || !p10AnswerB.trim()) {
        setP10Feedback({type: 'error', msg: "Внеси ги двата одговори пред да провериш."});
        return;
    }
    const valA = parseInt(p10AnswerA);
    const valB = parseInt(p10AnswerB);

    if (valA === 4 && valB === 18) {
        setP10Feedback({type: 'success', msg: "Браво! Ги реши двете барања точно."});
    } else if (valA === 4) {
        setP10Feedback({type: 'error', msg: "Под а) е точно, но провери го под б). (Собери ги пресеците без центарот)."});
    } else if (valB === 18) {
        setP10Feedback({type: 'error', msg: "Под б) е точно, но провери го под а)."});
    } else {
        setP10Feedback({type: 'error', msg: "Неточно. Обиди се да нацрташ Венов дијаграм."});
    }
  }

  const checkButtonStyle = "bg-indigo-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-md hover:bg-indigo-700 transition flex items-center gap-2";

  // ... (Page 1-8 components remain the same)
  const Page1 = (
    <div className="flex flex-col h-full">
      <div className="border-b-2 border-slate-300 pb-2 mb-4">
         <h2 className="text-lg font-bold text-slate-700 uppercase">Задача 1</h2>
         <span className="text-xs text-slate-500">Избери го точниот одговор</span>
      </div>
      <div className="bg-white/60 rounded-lg border border-slate-300 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex gap-3 flex-col">
          <div className="flex gap-3">
             <div className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-sm">1</div>
             <div className="font-medium text-base text-slate-800">
                Дадени се множествата {'\\( X = \\{x \\mid x \\text{ е делител на 12}\\} \\)'} и {'\\( Y = \\{y \\mid y \\text{ е делител на 16}\\} \\)'}.
                Кое од множествата е {'\\( X \\cap Y \\)'}?
             </div>
          </div>
          <p className="text-slate-500 text-xs ml-9">(Кликни на копчето со точниот одговор)</p>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="grid grid-cols-1 gap-3 text-base">
            {[
              {id: 'a', label: 'а', val: '\\( \\{2\\} \\)'},
              {id: 'b', label: 'б', val: '\\( \\{0, 1, 2, 4\\} \\)'},
              {id: 'c', label: 'в', val: '\\( \\{1, 2, 4\\} \\)'},
              {id: 'd', label: 'г', val: '\\( \\{1, 2, 3, 4, 6, 8, 12, 16\\} \\)'}
            ].map((opt) => (
               <button 
                  key={opt.id}
                  onClick={() => checkP1(opt.id)}
                  className={`text-left px-4 py-3 rounded border transition-all ${
                    p1Selection === opt.id 
                      ? (opt.id === 'c' ? 'bg-green-100 border-green-500 ring-1 ring-green-500' : 'bg-red-50 border-red-300') 
                      : 'bg-white hover:bg-indigo-50 border-slate-200'
                  }`}
               >
                 <span className="font-bold mr-2">{opt.label}.</span> {opt.val}
               </button>
            ))}
          </div>
          {p1Feedback && (
            <div className="flex justify-center mt-4">
               <div className="bg-indigo-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-md animate-pulse">
                 {p1Feedback}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const Page2 = (
    <div className="flex flex-col h-full">
       <div className="border-b-2 border-slate-300 pb-2 mb-4">
         <h2 className="text-lg font-bold text-slate-700 uppercase">Задача 2</h2>
         <span className="text-xs text-slate-500">Унија, Пресек и Венови дијаграми</span>
      </div>
      <div className="bg-white/60 rounded-lg border border-slate-300 shadow-sm flex-1 flex flex-col overflow-hidden">
         <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex flex-col gap-1 shrink-0">
            <div className="flex gap-3">
                <div className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                <p className="font-medium text-base text-slate-800">
                Пресекот и унијата на множествата {'\\( P=\\{0,2,3,6\\} \\)'} и {'\\( R=\\{1,2,3,4,5,6\\} \\)'} запиши ги:
                </p>
            </div>
            <p className="text-slate-500 text-xs ml-9">(Елементите одвој ги со запирка, пр. 1,2,3)</p>
         </div>
         
         <div className="p-4 overflow-y-auto flex-1 space-y-5">
           <div className="flex flex-col gap-3 text-base">
             <div className="flex items-center gap-2">
               <span className="w-20 text-right font-bold text-slate-700">а.</span>
               <span>{'\\( P \\cap R = \\)'}</span>
               <input 
                 className="border-b-2 border-slate-400 bg-white/50 w-full outline-none font-mono text-blue-800 px-2 focus:bg-white focus:border-indigo-400"
                 placeholder="{...}"
                 value={p2IntersectionInput}
                 onChange={e => setP2IntersectionInput(e.target.value)}
               />
             </div>
             <div className="flex items-center gap-2">
               <span className="w-20 text-right font-bold text-slate-700">б.</span>
               <span>{'\\( P \\cup R = \\)'}</span>
               <input 
                 className="border-b-2 border-slate-400 bg-white/50 w-full outline-none font-mono text-blue-800 px-2 focus:bg-white focus:border-indigo-400"
                 placeholder="{...}"
                 value={p2UnionInput}
                 onChange={e => setP2UnionInput(e.target.value)}
               />
             </div>
             
             <div className="flex justify-center mt-2">
                <button 
                  onClick={checkP2}
                  className={checkButtonStyle}
                >
                  {p2Loading ? '...' : 'Провери'} <CheckCircle size={16}/>
                </button>
             </div>
             {p2Feedback.msg && (
               <p className={`text-sm p-2 text-center rounded border ${p2Feedback.type === 'success' ? 'text-green-800 bg-green-50 border-green-200' : 'text-amber-800 bg-amber-50 border-amber-200'}`}>
                 {p2Feedback.msg}
               </p>
             )}
           </div>

           <div className="border-t border-slate-300 pt-3 mt-2">
             <div className="flex gap-2 mb-2 flex-col">
                <div className="flex gap-2">
                    <span className="font-bold text-slate-700">в.</span>
                    <span className="text-slate-600">Распореди ги елементите во Веновиот дијаграм:</span>
                </div>
                <span className="text-slate-500 text-xs ml-5">(Повлечи ги броевите во соодветната област)</span>
             </div>
             
             <div className="bg-slate-100 p-2 rounded-lg border border-slate-200 mb-2 min-h-[50px] flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-500 uppercase">Елементи:</span>
                {initialDraggables.filter(n => p2DragState[n] === 'bank').map(n => (
                  <div 
                    key={n}
                    draggable
                    onDragStart={(e) => handleDragStart(e, n)}
                    className="w-8 h-8 rounded-full bg-white border-2 border-indigo-400 text-indigo-800 font-bold flex items-center justify-center cursor-grab active:cursor-grabbing shadow-sm hover:scale-110 transition-transform z-10"
                  >
                    {n}
                  </div>
                ))}
                {initialDraggables.filter(n => p2DragState[n] === 'bank').length === 0 && (
                  <span className="text-xs text-green-600 italic">Сите елементи се поставени!</span>
                )}
             </div>

             <div 
               className="relative border-2 border-dashed border-slate-300 rounded-xl p-2 bg-slate-50/50"
               onDragOver={handleDragOver}
               onDrop={handleDrop}
             >
                <div className="flex justify-center w-full">
                  <VennDiagram 
                    mode="display" 
                    elements={{
                      left: getRegionItems('left'),
                      intersection: getRegionItems('intersection'),
                      right: getRegionItems('right')
                    }}
                    width={280}
                  />
                </div>
             </div>

             <div className="flex justify-center gap-2 mt-2">
               <button onClick={checkP2Drag} className={checkButtonStyle}>
                  Провери Распоред <CheckCircle size={14}/>
               </button>
               <button onClick={resetP2Drag} className="bg-slate-200 text-slate-600 px-3 py-2 rounded-full hover:bg-slate-300 transition" title="Ресетирај">
                 <Undo2 size={16}/>
               </button>
             </div>
             {p2DragFeedback && (
                <p className={`mt-2 text-xs font-bold p-2 text-center rounded ${p2DragFeedback.includes('Одлично') ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                  {p2DragFeedback}
                </p>
             )}
           </div>
         </div>
      </div>
    </div>
  );

  const Page3 = (
    <div className="flex flex-col h-full">
       <div className="border-b-2 border-slate-300 pb-2 mb-4">
         <h2 className="text-lg font-bold text-slate-700 uppercase">Задача 3</h2>
         <span className="text-xs text-slate-500">Операции со дадени множества</span>
      </div>
      <div className="bg-white/60 rounded-lg border border-slate-300 shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex gap-3 shrink-0 flex-col">
            <div className="flex gap-3">
                <div className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                <div className="space-y-2 w-full">
                <p className="font-medium text-base">Дадени се множествата:</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm bg-white/50 p-3 rounded-md border border-slate-200">
                    <div>{'\\( A = \\{2, 5\\} \\)'}</div>
                    <div>{'\\( B = \\{5, 7, 9\\} \\)'}</div>
                    <div>{'\\( C = \\{1, 3, 5, 7\\} \\)'}</div>
                    <div>{'\\( D = \\{2, 4, 6, 8\\} \\)'}</div>
                </div>
                <p className="font-medium pt-2">Запиши ги множествата:</p>
                </div>
            </div>
            <p className="text-slate-500 text-xs ml-9">(Пресметај ги множествата и внеси ги елементите одвоени со запирка)</p>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
             <div className="grid grid-cols-2 gap-4 text-base">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-700">а. {'\\( A \\cup B \\)'}</span>
                  <input 
                    placeholder="{...}" 
                    className="border border-slate-300 rounded px-3 py-2 text-sm bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-300 outline-none" 
                    value={p3Inputs.a}
                    onChange={(e) => setP3Inputs({...p3Inputs, a: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-700">б. {'\\( A \\cap C \\)'}</span>
                  <input 
                    placeholder="{...}" 
                    className="border border-slate-300 rounded px-3 py-2 text-sm bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-300 outline-none" 
                    value={p3Inputs.b}
                    onChange={(e) => setP3Inputs({...p3Inputs, b: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-700">в. {'\\( A \\setminus D \\)'}</span>
                  <input 
                    placeholder="{...}" 
                    className="border border-slate-300 rounded px-3 py-2 text-sm bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-300 outline-none" 
                    value={p3Inputs.c}
                    onChange={(e) => setP3Inputs({...p3Inputs, c: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-700">г. {'\\( B \\setminus C \\)'}</span>
                  <input 
                    placeholder="{...}" 
                    className="border border-slate-300 rounded px-3 py-2 text-sm bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-300 outline-none" 
                    value={p3Inputs.d}
                    onChange={(e) => setP3Inputs({...p3Inputs, d: e.target.value})}
                  />
                </div>
             </div>
             
             <div className="flex justify-center mt-6">
               <button 
                 onClick={checkP3}
                 className={checkButtonStyle}
               >
                 Провери <CheckCircle size={16}/>
               </button>
             </div>
             {p3Feedback.msg && (
                 <p className={`text-center p-3 rounded border font-medium mt-4 ${p3Feedback.type === 'success' ? 'text-green-800 bg-green-50 border-green-200' : 'text-amber-800 bg-amber-50 border-amber-200'}`}>
                   {p3Feedback.msg}
                 </p>
              )}
          </div>
       </div>
    </div>
  );

  const Page4 = (
    <div className="flex flex-col h-full">
      <div className="border-b-2 border-slate-300 pb-2 mb-4">
         <h2 className="text-lg font-bold text-slate-700 uppercase">Задача 4</h2>
         <span className="text-xs text-slate-500">Множества со описни својства</span>
      </div>
      <div className="bg-white/60 rounded-lg border border-slate-300 shadow-sm flex-1 overflow-hidden">
          <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex gap-3 flex-col">
            <div className="flex gap-3">
                <div className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-sm">4</div>
                <div className="space-y-2 w-full">
                <p className="font-medium text-base">Запиши ги табеларно множествата:</p>
                <ul className="list-disc pl-5 text-sm space-y-2 text-slate-700">
                    <li className="flex flex-wrap items-center gap-2">
                       <span>{'\\( A = \\{x \\mid x \\in \\mathbb{N}, 3 < x < 6\\} \\)'} &rarr; </span>
                       <span className="font-bold text-slate-900">A = </span>
                       <input 
                         className="border-b-2 border-slate-400 bg-white/50 w-24 text-center font-mono text-indigo-800 outline-none focus:bg-white focus:border-indigo-400 py-0" 
                         placeholder="{...}" 
                         value={p4Inputs.defA}
                         onChange={(e) => setP4Inputs({...p4Inputs, defA: e.target.value})}
                       />
                    </li>
                    <li className="flex flex-wrap items-center gap-2">
                       <span>{'\\( B = \\{x \\mid x \\in \\mathbb{N}, x \\le 8\\} \\)'} &rarr; </span>
                       <span className="font-bold text-slate-900">B = </span>
                       <input 
                         className="border-b-2 border-slate-400 bg-white/50 w-32 text-center font-mono text-indigo-800 outline-none focus:bg-white focus:border-indigo-400 py-0" 
                         placeholder="{...}" 
                         value={p4Inputs.defB}
                         onChange={(e) => setP4Inputs({...p4Inputs, defB: e.target.value})}
                       />
                    </li>
                    <li className="flex flex-wrap items-center gap-2">
                       <span>{'\\( C = \\{x \\mid x \\text{ сложен} < 7\\} \\)'} &rarr; </span>
                       <span className="font-bold text-slate-900">C = </span>
                       <input 
                         className="border-b-2 border-slate-400 bg-white/50 w-24 text-center font-mono text-indigo-800 outline-none focus:bg-white focus:border-indigo-400 py-0" 
                         placeholder="{...}" 
                         value={p4Inputs.defC}
                         onChange={(e) => setP4Inputs({...p4Inputs, defC: e.target.value})}
                       />
                    </li>
                </ul>
                </div>
            </div>
            <p className="text-slate-500 text-xs ml-9">(Реши ги операциите врз основа на множествата што ги запиша погоре)</p>
          </div>
          <div className="p-4 space-y-6 text-base mt-4">
             <div className="flex items-center gap-3">
               <span className="font-bold text-slate-700 w-32">а. {'\\( (A \\cap B) \\setminus A \\)'}</span>
               <span className="font-bold">=</span>
               <input 
                  className="border-b-2 border-slate-400 bg-white/50 flex-1 text-center font-mono text-indigo-800 outline-none focus:bg-white focus:border-indigo-400 py-1" 
                  placeholder="{}" 
                  value={p4Inputs.a}
                  onChange={(e) => setP4Inputs({...p4Inputs, a: e.target.value})}
               />
             </div>
             <div className="flex items-center gap-3">
               <span className="font-bold text-slate-700 w-32">б. {'\\( (A \\setminus B) \\cup C \\)'}</span>
               <span className="font-bold">=</span>
               <input 
                  className="border-b-2 border-slate-400 bg-white/50 flex-1 text-center font-mono text-indigo-800 outline-none focus:bg-white focus:border-indigo-400 py-1" 
                  placeholder="{...}" 
                  value={p4Inputs.b}
                  onChange={(e) => setP4Inputs({...p4Inputs, b: e.target.value})}
               />
             </div>
             <div className="flex items-center gap-3">
               <span className="font-bold text-slate-700 w-32">в. {'\\( (C \\setminus B) \\cap \\emptyset \\)'}</span>
               <span className="font-bold">=</span>
               <input 
                  className="border-b-2 border-slate-400 bg-white/50 flex-1 text-center font-mono text-indigo-800 outline-none focus:bg-white focus:border-indigo-400 py-1" 
                  placeholder="{}" 
                  value={p4Inputs.c}
                  onChange={(e) => setP4Inputs({...p4Inputs, c: e.target.value})}
               />
             </div>

             <div className="flex justify-center pt-6">
               <button 
                 onClick={checkP4}
                 className={checkButtonStyle}
               >
                 Провери <CheckCircle size={16}/>
               </button>
             </div>
             {p4Feedback.msg && (
                 <p className={`text-center p-3 rounded border font-medium ${p4Feedback.type === 'success' ? 'text-green-800 bg-green-50 border-green-200' : 'text-amber-800 bg-amber-50 border-amber-200'}`}>
                   {p4Feedback.msg}
                 </p>
               )}
          </div>
       </div>
    </div>
  );

  const Page5 = (
    <div className="flex flex-col h-full">
      <div className="border-b-2 border-slate-300 pb-2 mb-4">
         <h2 className="text-lg font-bold text-slate-700 uppercase">Задача 5</h2>
         <span className="text-xs text-slate-500">Одредување множества</span>
      </div>
      <div className="bg-white/60 rounded-lg border border-slate-300 shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex gap-3 flex-col">
             <div className="flex gap-3">
                <div className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-sm">5</div>
                <div className="text-base w-full">
                <p className="mb-4">Ако {'\\( A \\cup B = \\{1,2,3,4,5,6\\} \\)'}; {'\\( A \\setminus B = \\{1,2\\} \\)'}; {'\\( B \\setminus A = \\{5,6\\} \\)'}.</p>
                <p className="font-bold text-slate-800">Одреди ги елементите на множествата А и В како и множеството {'\\( A \\cap B \\)'}.</p>
                </div>
             </div>
             <p className="text-slate-500 text-xs ml-9">(Искористи ги својствата на унија и разлика за да ги најдеш оригиналните множества)</p>
          </div>
          <div className="p-4 flex flex-col gap-6">
             <div className="flex flex-col gap-5 text-base">
                <div className="flex items-center gap-4">
                  <div className="w-24 font-bold text-indigo-900 text-right">{'\\( A \\cap B = \\)'}</div>
                  <input 
                    className="flex-1 border-2 border-indigo-200 bg-white/50 rounded-lg p-2 text-left shadow-sm focus:border-indigo-400 focus:bg-white outline-none" 
                    placeholder="{...}" 
                    value={p5Inputs.int}
                    onChange={(e) => setP5Inputs({...p5Inputs, int: e.target.value})}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 font-bold text-indigo-900 text-right">{'\\( A = \\)'}</div>
                  <input 
                    className="flex-1 border-2 border-indigo-200 bg-white/50 rounded-lg p-2 text-left shadow-sm focus:border-indigo-400 focus:bg-white outline-none" 
                    placeholder="{...}" 
                    value={p5Inputs.a}
                    onChange={(e) => setP5Inputs({...p5Inputs, a: e.target.value})}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 font-bold text-indigo-900 text-right">{'\\( B = \\)'}</div>
                  <input 
                    className="flex-1 border-2 border-indigo-200 bg-white/50 rounded-lg p-2 text-left shadow-sm focus:border-indigo-400 focus:bg-white outline-none" 
                    placeholder="{...}" 
                    value={p5Inputs.b}
                    onChange={(e) => setP5Inputs({...p5Inputs, b: e.target.value})}
                  />
                </div>
             </div>
             
             <div className="flex justify-center mt-4">
               <button 
                 onClick={checkP5}
                 className={checkButtonStyle}
               >
                 Провери <CheckCircle size={16}/>
               </button>
             </div>
             {p5Feedback.msg && (
               <div className="flex justify-center">
                 <p className={`text-base px-6 py-3 rounded border font-medium ${p5Feedback.type === 'success' ? 'text-green-800 bg-green-50 border-green-200' : 'text-amber-800 bg-amber-50 border-amber-200'}`}>
                   {p5Feedback.msg}
                 </p>
               </div>
             )}
          </div>
       </div>
    </div>
  );

  const Page6 = (
    <div className="flex flex-col h-full">
      <div className="border-b-2 border-slate-300 pb-2 mb-4">
         <h2 className="text-lg font-bold text-slate-700 uppercase">Задача 6</h2>
         <span className="text-xs text-slate-500">Поврзување</span>
      </div>
      <div className="bg-white/60 rounded-lg border border-slate-300 shadow-sm flex-1 flex flex-col overflow-hidden">
          {/* Header Instruction - Fixed Height */}
          <div className="bg-indigo-50 p-3 border-b border-indigo-100 flex gap-3 shrink-0">
             <div className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-sm">6</div>
             <div className="text-sm">
                <p className="font-medium leading-tight">Поврзи ги областите со операциите.</p>
                <p className="text-slate-500 text-[10px] mt-1">(Кликни на операцијата, па на дијаграмот)</p>
             </div>
          </div>
          
          {/* Toolbar for Buttons - Sticky/Fixed below header */}
          <div className="bg-slate-50 p-2 border-b border-slate-200 flex justify-center flex-wrap gap-2 shrink-0 z-10 shadow-sm">
              {labelsP6.map(l => (
                <button 
                  key={l.id} 
                  onClick={() => setP6SelectedLabel(l.text)}
                  className={`px-3 py-1.5 border rounded-lg text-sm transition-all shadow-sm flex items-center justify-center min-w-[60px] ${
                    p6SelectedLabel === l.text 
                      ? 'bg-indigo-600 text-white shadow-md transform scale-105 ring-2 ring-indigo-300' 
                      : Object.values(p6Matches).includes(l.text) 
                        ? 'bg-gray-200 text-gray-400 border-transparent cursor-not-allowed'
                        : 'bg-white hover:bg-indigo-50 border-indigo-200 text-indigo-900'
                  }`}
                >
                  {l.text}
                </button>
              ))}
          </div>
          
          {/* Scrollable Content for Diagrams */}
          <div className="p-4 flex-1 flex flex-col justify-start overflow-y-auto">
            {/* Diagrams Grid */}
            <div className="grid grid-cols-2 gap-4 pb-4">
               {/* 1. Union (Top Left) */}
               <div 
                 className={`relative border-2 rounded-xl p-2 flex flex-col items-center justify-center transition-all cursor-pointer bg-white ${
                   p6Matches[1] ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                 }`}
                 onClick={() => handleDiagramClick(1)}
               >
                 <VennDiagram mode="display" width={120} height={80} selectedRegion="union" />
                 <div className="mt-2 h-8 flex items-center justify-center font-bold text-indigo-700 bg-slate-50 w-full border border-slate-200 rounded-lg text-sm">
                   {p6Matches[1] || "?"}
                 </div>
               </div>
               
               {/* 2. Intersection (Top Right) */}
               <div 
                 className={`relative border-2 rounded-xl p-2 flex flex-col items-center justify-center transition-all cursor-pointer bg-white ${
                   p6Matches[2] ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                 }`}
                 onClick={() => handleDiagramClick(2)}
               >
                 <VennDiagram mode="display" width={120} height={80} selectedRegion="intersection" />
                 <div className="mt-2 h-8 flex items-center justify-center font-bold text-indigo-700 bg-slate-50 w-full border border-slate-200 rounded-lg text-sm">
                   {p6Matches[2] || "?"}
                 </div>
               </div>

               {/* 3. Difference A \ B (Bottom Left) */}
               <div 
                 className={`relative border-2 rounded-xl p-2 flex flex-col items-center justify-center transition-all cursor-pointer bg-white ${
                   p6Matches[3] ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                 }`}
                 onClick={() => handleDiagramClick(3)}
               >
                 <VennDiagram mode="display" width={120} height={80} selectedRegion="left" />
                 <div className="mt-2 h-8 flex items-center justify-center font-bold text-indigo-700 bg-slate-50 w-full border border-slate-200 rounded-lg text-sm">
                   {p6Matches[3] || "?"}
                 </div>
               </div>

               {/* 4. Difference B \ A (Bottom Right) */}
               <div 
                 className={`relative border-2 rounded-xl p-2 flex flex-col items-center justify-center transition-all cursor-pointer bg-white ${
                   p6Matches[4] ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                 }`}
                 onClick={() => handleDiagramClick(4)}
               >
                 <VennDiagram mode="display" width={120} height={80} selectedRegion="right" />
                 <div className="mt-2 h-8 flex items-center justify-center font-bold text-indigo-700 bg-slate-50 w-full border border-slate-200 rounded-lg text-sm">
                   {p6Matches[4] || "?"}
                 </div>
               </div>
            </div>

            <div className="flex justify-center mt-2 shrink-0">
               <button 
                 onClick={checkP6}
                 className={checkButtonStyle}
               >
                 Провери <CheckCircle size={16}/>
               </button>
            </div>
            {p6Feedback.msg && (
               <div className="flex justify-center mt-2 pb-2">
                 <p className={`text-sm px-4 py-2 rounded border font-medium ${p6Feedback.type === 'success' ? 'text-green-800 bg-green-50 border-green-200' : 'text-amber-800 bg-amber-50 border-amber-200'}`}>
                   {p6Feedback.msg}
                 </p>
               </div>
             )}
          </div>
       </div>
    </div>
  );

  const Page7 = (
    <div className="flex flex-col h-full">
      <div className="border-b-2 border-slate-300 pb-2 mb-4">
         <h2 className="text-lg font-bold text-slate-700 uppercase">Задача 7</h2>
         <span className="text-xs text-slate-500">Проблемска ситуација</span>
      </div>
      <div className="bg-white/60 rounded-lg border border-slate-300 shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex gap-3 flex-col">
             <div className="flex gap-3">
                <div className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-sm">7</div>
                <div className="text-sm font-medium text-slate-800">
                   Во група од 50 студенти, 30 сакаат да играат фудбал, а 25 сакаат да играат кошарка.
                   Секој студент сака да игра барем еден од двата спорта.
                   <br/>
                   <span className="font-bold block mt-2">Колку студенти сакаат да играат и фудбал и кошарка?</span>
                </div>
             </div>
             <p className="text-slate-500 text-xs ml-9">(Користи го просторот долу за да скицираш или пресметаш)</p>
          </div>

          <div className="h-40 shrink-0 p-2 bg-slate-50/50">
             <DrawingCanvas />
          </div>

          <div className="flex items-center gap-2 bg-white p-2 border-t border-slate-200">
             <span className="text-sm font-bold text-slate-700">Одговор:</span>
             <input
                type="number"
                className={`w-16 p-1 border-2 rounded text-center font-bold text-base outline-none transition-colors ${
                  p7Feedback.type === 'success' ? 'border-green-500 bg-green-50' :
                  p7Feedback.type === 'error' ? 'border-red-500 bg-red-50' :
                  'border-slate-300 focus:border-indigo-500 focus:bg-indigo-50'
                }`}
                value={p7Answer}
                onChange={(e) => setP7Answer(e.target.value)}
             />
             <button onClick={checkP7} className="bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow hover:bg-indigo-700 transition ml-1">
                Провери
             </button>
             
             {p7Feedback.type === 'success' && <Check className="text-green-600 ml-2" size={24} strokeWidth={3} />}
             {p7Feedback.type === 'error' && <X className="text-red-600 ml-2" size={24} strokeWidth={3} />}
          </div>
           {p7Feedback.msg && (
               <div className="bg-white px-4 pb-1">
                 <p className={`text-sm px-4 py-2 rounded border font-medium text-center ${p7Feedback.type === 'success' ? 'text-green-800 bg-green-50 border-green-200' : 'text-amber-800 bg-amber-50 border-amber-200'}`}>
                   {p7Feedback.msg}
                 </p>
               </div>
             )}
      </div>
    </div>
  );

  const Page8 = (
    <div className="flex flex-col h-full">
      <div className="border-b-2 border-slate-300 pb-2 mb-4">
         <h2 className="text-lg font-bold text-slate-700 uppercase">Задача 8</h2>
         <span className="text-xs text-slate-500">Проблемска ситуација</span>
      </div>
      <div className="bg-white/60 rounded-lg border border-slate-300 shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex gap-3 flex-col">
             <div className="flex gap-3">
                <div className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-sm">8</div>
                <div className="text-sm font-medium text-slate-800">
                   Од 75 луѓе со мобилни телефони, 42 прават фотографии со нивниот мобилен телефон, а 36 го користат телефонот за да прават фотографии и да праќаат текстуални пораки.
                   <br/>
                   <span className="font-bold block mt-2">Колку луѓе ги користат своите телефони за да праќаат текстуални пораки?</span>
                </div>
             </div>
             <p className="text-slate-500 text-xs ml-9">(Користи го просторот долу за да скицираш или пресметаш)</p>
          </div>

          <div className="h-40 shrink-0 p-2 bg-slate-50/50 relative">
             <DrawingCanvas />
          </div>

          <div className="flex items-center gap-2 bg-white p-2 border-t border-slate-200">
             <span className="text-sm font-bold text-slate-700">Одговор:</span>
             <input
                type="number"
                className={`w-16 p-1 border-2 rounded text-center font-bold text-base outline-none transition-colors ${
                  p8Feedback.type === 'success' ? 'border-green-500 bg-green-50' :
                  p8Feedback.type === 'error' ? 'border-red-500 bg-red-50' :
                  'border-slate-300 focus:border-indigo-500 focus:bg-indigo-50'
                }`}
                value={p8Answer}
                onChange={(e) => setP8Answer(e.target.value)}
             />
             <button onClick={checkP8} className="bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow hover:bg-indigo-700 transition ml-1">
                Провери
             </button>
             
             {p8Feedback.type === 'success' && <Check className="text-green-600 ml-2" size={24} strokeWidth={3} />}
             {p8Feedback.type === 'error' && <X className="text-red-600 ml-2" size={24} strokeWidth={3} />}
          </div>
           {p8Feedback.msg && (
               <div className="bg-white px-4 pb-1">
                 <p className={`text-sm px-4 py-2 rounded border font-medium text-center ${p8Feedback.type === 'success' ? 'text-green-800 bg-green-50 border-green-200' : 'text-amber-800 bg-amber-50 border-amber-200'}`}>
                   {p8Feedback.msg}
                 </p>
               </div>
             )}
      </div>
    </div>
  );

  const Page9 = (
    <div className="flex flex-col h-full">
      <div className="border-b-2 border-slate-300 pb-2 mb-4 shrink-0">
         <h2 className="text-lg font-bold text-slate-700 uppercase">Задача 9</h2>
         <span className="text-xs text-slate-500">Анализа на Венов дијаграм</span>
      </div>
      <div className="bg-white/60 rounded-lg border border-slate-300 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex gap-3 flex-col shrink-0">
          <div className="flex gap-3">
             <div className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-sm">9</div>
             <div className="font-medium text-base text-slate-800">
                Даден е Венов дијаграм за множествата A, B и C. Според дијаграмот, на кое од следниве множества <span className="font-bold text-red-600">НЕ</span> му припаѓа елементот 4?
             </div>
          </div>
        </div>
        
        {/* Scrollable container for Diagram and Options */}
        <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Venn Diagram Container */}
            <div className="flex items-center justify-center p-4 min-h-[180px] shrink-0">
               <svg viewBox="0 0 300 220" className="w-full max-w-[260px] select-none font-sans font-bold text-lg">
                  {/* Set A (Top) - Orange */}
                  <circle cx="150" cy="80" r="60" fill="none" stroke="#f97316" strokeWidth="3" />
                  {/* Set B (Left) - Red */}
                  <circle cx="110" cy="150" r="60" fill="none" stroke="#dc2626" strokeWidth="3" />
                  {/* Set C (Right) - Blue */}
                  <circle cx="190" cy="150" r="60" fill="none" stroke="#0ea5e9" strokeWidth="3" />

                  {/* Updated Labels: Positioned outside the circles clearly */}
                  {/* A centered above top circle */}
                  <text x="150" y="15" textAnchor="middle" fill="#f97316" fontSize="18" fontWeight="bold">A</text>
                  {/* B to the left of left circle */}
                  <text x="30" y="160" textAnchor="middle" fill="#dc2626" fontSize="18" fontWeight="bold">B</text>
                  {/* C to the right of right circle */}
                  <text x="270" y="160" textAnchor="middle" fill="#0ea5e9" fontSize="18" fontWeight="bold">C</text>

                  {/* Elements */}
                  {/* 1 in A only */}
                  <text x="150" y="50" textAnchor="middle" fill="#334155">1</text>
                  {/* 6 in B only */}
                  <text x="90" y="160" textAnchor="middle" fill="#334155">6</text>
                  {/* 7 in C only */}
                  <text x="210" y="160" textAnchor="middle" fill="#334155">7</text>
                  
                  {/* 2 in A n B */}
                  <text x="115" y="105" textAnchor="middle" fill="#334155">2</text>
                  {/* 4 in A n C */}
                  <text x="185" y="105" textAnchor="middle" fill="#334155">4</text>
                  {/* 5 in B n C */}
                  <text x="150" y="180" textAnchor="middle" fill="#334155">5</text>
                  
                  {/* 3 in A n B n C */}
                  <text x="150" y="135" textAnchor="middle" fill="#334155">3</text>
               </svg>
            </div>

            {/* Options */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 mt-auto">
               <div className="grid grid-cols-2 gap-3">
                 {[
                   {id: 'a', val: '\\( A \\cap C \\)'},
                   {id: 'b', val: '\\( C \\cup B \\)'},
                   {id: 'c', val: '\\( B \\cup A \\)'},
                   {id: 'd', val: '\\( A \\cap B \\)'}
                 ].map(opt => (
                   <button
                     key={opt.id}
                     onClick={() => checkP9(opt.id)}
                     className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        p9Selection === opt.id 
                        ? (opt.id === 'd' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-300 text-red-800')
                        : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'
                     }`}
                   >
                     <span className="font-bold uppercase text-slate-500">{opt.id})</span>
                     <span className="font-bold text-lg">{opt.val}</span>
                     {p9Selection === opt.id && (
                        <span className="ml-auto">
                            {opt.id === 'd' ? <Check size={20}/> : <X size={20}/>}
                        </span>
                     )}
                   </button>
                 ))}
               </div>
               {p9Feedback && (
                 <div className={`mt-3 text-center text-sm font-bold py-2 px-4 rounded ${p9Selection === 'd' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {p9Feedback}
                 </div>
               )}
            </div>
        </div>
      </div>
    </div>
  );

  // ... (Page 10 and return statement remain the same)
  const Page10 = (
    <div className="flex flex-col h-full">
      <div className="border-b-2 border-slate-300 pb-2 mb-4">
         <h2 className="text-lg font-bold text-slate-700 uppercase">Задача 10</h2>
         <span className="text-xs text-slate-500">Проблемска ситуација</span>
      </div>
      <div className="bg-white/60 rounded-lg border border-slate-300 shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Problem Text */}
        <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex gap-3 overflow-y-auto max-h-[220px]">
           <div className="flex gap-3">
              <div className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold text-sm mt-1">10</div>
              <div className="text-xs font-medium text-slate-800 space-y-1">
                 <p>Учениците од VII-а одделение (вкупно 32) користат апликации: TikTok (T), Instagram (I) и Snapchat (S). Секој користи барем една.</p>
                 <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                    <li>Вкупно 20 користат TikTok.</li>
                    <li>Вкупно 22 користат Instagram.</li>
                    <li>Вкупно 18 користат Snapchat.</li>
                    <li>5 ученици се „супер-корисници“ (сите три).</li>
                    <li>12 користат TikTok и Instagram.</li>
                    <li>11 користат Instagram и Snapchat.</li>
                    <li>Бројот на ученици кои користат само TikTok и Snapchat (без Instagram) е 5.</li>
                 </ul>
                 <p className="text-slate-500 text-[10px] mt-1">(Користи го просторот долу за да нацрташ Венов дијаграм и да пресметаш)</p>
              </div>
           </div>
        </div>

        {/* Canvas Area */}
        <div className="h-40 shrink-0 p-2 bg-slate-50/50 border-b border-slate-200">
           <DrawingCanvas />
        </div>

        {/* Inputs */}
        <div className="flex-1 bg-white p-3 flex flex-col justify-center gap-3">
           <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-700 w-2/3">а) Колку ученици користат САМО Instagram?</span>
              <input
                 type="number"
                 className="w-16 p-1 border-2 border-slate-300 rounded text-center font-bold outline-none focus:border-indigo-500 focus:bg-indigo-50"
                 value={p10AnswerA}
                 onChange={(e) => setP10AnswerA(e.target.value)}
              />
           </div>
           <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-700 w-2/3">б) Колку вкупно ученици користат точно две апликации?</span>
              <input
                 type="number"
                 className="w-16 p-1 border-2 border-slate-300 rounded text-center font-bold outline-none focus:border-indigo-500 focus:bg-indigo-50"
                 value={p10AnswerB}
                 onChange={(e) => setP10AnswerB(e.target.value)}
              />
           </div>
           
           <div className="flex justify-center mt-1">
             <button onClick={checkP10} className={checkButtonStyle}>
                Провери <CheckCircle size={16}/>
             </button>
           </div>
           
           {p10Feedback.msg && (
               <div className="flex justify-center">
                 <p className={`text-xs px-3 py-1.5 rounded border font-medium text-center ${p10Feedback.type === 'success' ? 'text-green-800 bg-green-50 border-green-200' : 'text-amber-800 bg-amber-50 border-amber-200'}`}>
                   {p10Feedback.msg}
                 </p>
               </div>
           )}
        </div>
      </div>
    </div>
  );

  if (!hasStarted) {
    return <WelcomeScreen onStart={() => setHasStarted(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#e6d5b8] py-4 px-4 font-sans text-slate-900 flex flex-col items-center">
      <div className="max-w-4xl w-full flex items-center justify-between mb-4 px-4">
        <button 
           onClick={() => setHasStarted(false)}
           className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 text-sm font-bold"
        >
           <Undo2 size={18} /> Назад кон почеток
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Работна Тетратка</h1>
          <p className="text-slate-600 text-sm">Тема: Множества</p>
        </div>
        <div className="w-24"></div> 
      </div>

      <Book pages={[Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10]} />
      
      <div className="text-center text-slate-500 text-xs mt-8">
        Powered by React, Tailwind & Gemini AI
      </div>
    </div>
  );
}