import React, { useEffect, useRef, useState } from 'react';
import { CanvasManager } from './core/engine';
import { useStore } from './store/useStore';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [manager, setManager] = useState<CanvasManager | null>(null);
  const { selectedObject, setSelectedObject } = useStore();

  useEffect(() => {
    if (!canvasRef.current) return;
    const m = new CanvasManager(canvasRef.current, 800, 800);
    
    m.canvas.on('selection:created', (e) => setSelectedObject(e.selected?.[0] || null));
    m.canvas.on('selection:cleared', () => setSelectedObject(null));
    
    setManager(m);
    return () => m.canvas.dispose();
  }, []);

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 flex flex-col gap-4">
        <h1 className="font-bold text-xl tracking-tighter">web-print</h1>
        <button onClick={() => manager?.addText()} className="bg-black text-white py-2 rounded text-sm">Add Text</button>
        <button onClick={() => manager?.exportPNG()} className="border py-2 rounded text-sm">Export PNG</button>
      </aside>

      {/* Canvas Workspace */}
      <main className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div className="bg-white shadow-2xl">
          <canvas ref={canvasRef} />
        </div>
      </main>

      {/* Inspector */}
      <aside className="w-72 bg-white border-l p-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase mb-4">Properties</h2>
        {selectedObject ? (
          <div className="space-y-4">
             <p className="text-xs">Type: {selectedObject.type}</p>
             {/* Property controls will be added here */}
          </div>
        ) : (
          <p className="text-xs italic text-gray-400">Select an object</p>
        )}
      </aside>
    </div>
  );
}