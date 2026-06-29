import React, { useEffect, useRef, useState } from 'react';
import { CanvasManager } from './core/engine';
import { useStore } from './store/useStore';

/**
 * web-print: Design Edition
 * A lightweight institutional publisher focused on layout and consistency.
 */
function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [manager, setManager] = useState<CanvasManager | null>(null);
  
  // Selection state from our global store
  const { selectedObject, setSelectedObject } = useStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    // 1. Initialize the Canvas Engine
    const m = new CanvasManager(canvasRef.current);
    
    // 2. Setup Selection Listeners
    m.canvas.on('selection:created', (e) => setSelectedObject(e.selected?.[0] || null));
    m.canvas.on('selection:updated', (e) => setSelectedObject(e.selected?.[0] || null));
    m.canvas.on('selection:cleared', () => setSelectedObject(null));
    
    setManager(m);

    return () => {
      m.canvas.dispose();
    };
  }, [setSelectedObject]);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* SIDEBAR: Design Tools */}
      <aside className="w-64 bg-white border-r border-slate-200 p-8 flex flex-col shadow-sm z-10">
        <div className="mb-10">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase text-blue-600 leading-none">
            web-print
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
            Institutional Publisher
          </p>
        </div>

        <nav className="space-y-6">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Tools</p>
            <button 
              onClick={() => manager?.addText()}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
            >
              <span>+</span> Add Text Layer
            </button>
          </div>

          <div className="pt-6 border-t border-slate-100">
             <button 
              onClick={() => manager?.exportPNG()}
              className="w-full border border-slate-200 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-50 transition"
            >
              Export PNG
            </button>
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 opacity-40 text-center">
           <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
             MVP v1.0.0
           </p>
        </div>
      </aside>

      {/* CENTER: Canvas Workspace */}
      <main className="flex-1 flex flex-col items-center justify-center p-12 overflow-auto bg-slate-50">
        <div className="shadow-2xl border border-slate-200 bg-white ring-[12px] ring-slate-200/10 leading-[0]">
          <canvas ref={canvasRef} />
        </div>

        <div className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-slate-200">
          Canvas: 600 x 600 PX
        </div>
      </main>

      {/* RIGHT: Inspector */}
      <aside className="w-80 bg-white border-l border-slate-200 p-8 shadow-sm z-10 overflow-y-auto">
        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10 border-b pb-5 border-slate-100">
          Inspector
        </h2>

        {selectedObject ? (
          <div className="space-y-10 animate-in fade-in duration-300">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Color</label>
              <div className="flex gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <input 
                   type="color" 
                   className="w-10 h-10 rounded-lg cursor-pointer border-none p-0 bg-transparent"
                   value={(selectedObject.fill as string) || '#000000'}
                   onChange={(e) => {
                     selectedObject.set('fill', e.target.value);
                     manager?.canvas.renderAll();
                   }}
                />
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                  {(selectedObject.fill as string)}
                </span>
              </div>
            </div>

            <div className="pt-10">
              <button 
                onClick={() => {
                  manager?.canvas.remove(selectedObject);
                  manager?.canvas.discardActiveObject().renderAll();
                }}
                className="w-full bg-red-50 text-red-500 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition border border-red-100"
              >
                Delete Layer
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center pb-24 opacity-50">
            <p className="text-[11px] font-medium text-slate-400 px-10 leading-relaxed uppercase tracking-widest">
              Select an object to edit properties
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

export default App;