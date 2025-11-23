'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { useDrawingStore } from '@/lib/store';

interface DrawingCanvasProps {
  width?: number;
  height?: number;
}

export interface DrawingCanvasRef {
  clearCanvas: () => void;
  undo: () => void;
  exportCanvas: () => any;
}

const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(
  ({ width = 800, height = 600 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const historyRef = useRef<ImageData[]>([]);
    
    const { tool, color, strokeWidth } = useDrawingStore();

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Initialize white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      
      // Save initial state
      saveState();
    }, [width, height]);

    const saveState = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const imageData = ctx.getImageData(0, 0, width, height);
      historyRef.current.push(imageData);
      if (historyRef.current.length > 20) {
        historyRef.current.shift();
      }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      isDrawing.current = true;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.beginPath();
      ctx.moveTo(x, y);
      
      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = strokeWidth * 2;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;
      }
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing.current) return;
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      if (isDrawing.current) {
        isDrawing.current = false;
        saveState();
      }
    };

    const clearCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      historyRef.current = [];
      saveState();
    };

    const undo = () => {
      if (historyRef.current.length <= 1) return;
      
      historyRef.current.pop();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const lastState = historyRef.current[historyRef.current.length - 1];
      if (lastState) {
        ctx.putImageData(lastState, 0, 0);
      }
    };

    const exportCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      return canvas.toDataURL();
    };

    useImperativeHandle(ref, () => ({
      clearCanvas,
      undo,
      exportCanvas,
    }));

    return (
      <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="cursor-crosshair"
        />
      </div>
    );
  }
);

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;
