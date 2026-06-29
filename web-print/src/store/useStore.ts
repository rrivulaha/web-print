import { create } from 'zustand';
import { fabric } from 'fabric';

interface WebPrintStore {
  selectedObject: fabric.Object | null;
  setSelectedObject: (obj: fabric.Object | null) => void;
}

export const useStore = create<WebPrintStore>((set) => ({
  selectedObject: null,
  setSelectedObject: (obj) => set({ selectedObject: obj }),
}));