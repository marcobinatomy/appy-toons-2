// Types for AppyToons2

export type DrawingTool = 'pencil' | 'eraser' | 'circle' | 'rectangle' | 'line';

export type DrawingMode = 'draw' | 'animate';

export interface DrawingState {
  tool: DrawingTool;
  color: string;
  strokeWidth: number;
  mode: DrawingMode;
  isDrawing: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  id: string;
  tool: DrawingTool;
  color: string;
  strokeWidth: number;
  points: Point[];
  timestamp: number;
}

export interface DrawingData {
  strokes: Stroke[];
  width: number;
  height: number;
  background: string;
}

export interface AnimationConfig {
  duration: number;
  type: 'move' | 'rotate' | 'scale' | 'fade' | 'bounce';
  easing: string;
  delay?: number;
}

export interface AnimationData {
  drawingData: DrawingData;
  animations: AnimationConfig[];
  totalDuration: number;
}

export interface CanvasHistory {
  past: string[];
  present: string;
  future: string[];
}
