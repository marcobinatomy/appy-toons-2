import { create } from 'zustand';
import { DrawingTool, DrawingMode, DrawingData, AnimationData } from './types';

interface DrawingStore {
  // Drawing state
  tool: DrawingTool;
  color: string;
  strokeWidth: number;
  mode: DrawingMode;
  isDrawing: boolean;
  
  // Canvas data
  drawingData: DrawingData | null;
  animationData: AnimationData | null;
  
  // History
  canUndo: boolean;
  canRedo: boolean;
  
  // Actions
  setTool: (tool: DrawingTool) => void;
  setColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setMode: (mode: DrawingMode) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  setDrawingData: (data: DrawingData | null) => void;
  setAnimationData: (data: AnimationData | null) => void;
  setCanUndo: (canUndo: boolean) => void;
  setCanRedo: (canRedo: boolean) => void;
  clearCanvas: () => void;
}

export const useDrawingStore = create<DrawingStore>((set) => ({
  // Initial state
  tool: 'pencil',
  color: '#000000',
  strokeWidth: 5,
  mode: 'draw',
  isDrawing: false,
  drawingData: null,
  animationData: null,
  canUndo: false,
  canRedo: false,
  
  // Actions
  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color }),
  setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
  setMode: (mode) => set({ mode, animationData: mode === 'draw' ? null : undefined }),
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  setDrawingData: (drawingData) => set({ drawingData }),
  setAnimationData: (animationData) => set({ animationData }),
  setCanUndo: (canUndo) => set({ canUndo }),
  setCanRedo: (canRedo) => set({ canRedo }),
  clearCanvas: () => set({ 
    drawingData: null, 
    animationData: null,
    canUndo: false,
    canRedo: false
  }),
}));
