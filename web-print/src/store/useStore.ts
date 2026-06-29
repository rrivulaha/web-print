import { create } from 'zustand';
import { fabric } from 'fabric';

interface WebPrintStore {
  selectedObject: fabric.Object | null;
  canvasVersion: number;
  setSelectedObject: (obj: fabric.Object | null) => void;
  triggerRefresh: () => void;
}

export const useStore = create<WebPrintStore>((set) => ({
  selectedObject: null,
  canvasVersion: 0,
  setSelectedObject: (obj) => set({ selectedObject: obj }),
  triggerRefresh: () => set((state) => ({ canvasVersion: state.canvasVersion + 1 })),
}));