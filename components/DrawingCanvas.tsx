'use client';

import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useDrawingStore } from '@/lib/store';

interface DrawingCanvasProps {
  width?: number;
  height?: number;
}

export default function DrawingCanvas({ width = 800, height = 600 }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { 
    tool, 
    color, 
    strokeWidth, 
    mode,
    setCanUndo, 
    setCanRedo,
    setDrawingData 
  } = useDrawingStore();

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current || isInitialized) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
      isDrawingMode: false,
      selection: false,
    });

    fabricCanvasRef.current = canvas;
    setIsInitialized(true);

    // Cleanup
    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
      setIsInitialized(false);
    };
  }, [width, height, isInitialized]);

  // Update canvas drawing settings
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (tool === 'pencil') {
      canvas.isDrawingMode = true;
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = color;
        canvas.freeDrawingBrush.width = strokeWidth;
      }
    } else if (tool === 'eraser') {
      canvas.isDrawingMode = true;
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = '#ffffff';
        canvas.freeDrawingBrush.width = strokeWidth * 2;
      }
    } else {
      canvas.isDrawingMode = false;
    }
  }, [tool, color, strokeWidth]);

  // Handle shape drawing
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    let isDown = false;
    let startX = 0;
    let startY = 0;
    let shape: fabric.Object | null = null;

    const handleMouseDown = (e: fabric.IEvent<MouseEvent>) => {
      if (tool === 'pencil' || tool === 'eraser' || !e.pointer) return;
      
      isDown = true;
      const pointer = canvas.getPointer(e.e);
      startX = pointer.x;
      startY = pointer.y;

      const commonProps = {
        left: startX,
        top: startY,
        fill: 'transparent',
        stroke: color,
        strokeWidth: strokeWidth,
        selectable: false,
        evented: false,
      };

      switch (tool) {
        case 'circle':
          shape = new fabric.Circle({
            ...commonProps,
            radius: 1,
          });
          break;
        case 'rectangle':
          shape = new fabric.Rect({
            ...commonProps,
            width: 1,
            height: 1,
          });
          break;
        case 'line':
          shape = new fabric.Line([startX, startY, startX, startY], {
            stroke: color,
            strokeWidth: strokeWidth,
            selectable: false,
            evented: false,
          });
          break;
      }

      if (shape) {
        canvas.add(shape);
      }
    };

    const handleMouseMove = (e: fabric.IEvent<MouseEvent>) => {
      if (!isDown || !shape || !e.pointer) return;

      const pointer = canvas.getPointer(e.e);

      switch (tool) {
        case 'circle':
          const radius = Math.sqrt(
            Math.pow(pointer.x - startX, 2) + Math.pow(pointer.y - startY, 2)
          );
          (shape as fabric.Circle).set({ radius });
          break;
        case 'rectangle':
          (shape as fabric.Rect).set({
            width: Math.abs(pointer.x - startX),
            height: Math.abs(pointer.y - startY),
            left: Math.min(startX, pointer.x),
            top: Math.min(startY, pointer.y),
          });
          break;
        case 'line':
          (shape as fabric.Line).set({
            x2: pointer.x,
            y2: pointer.y,
          });
          break;
      }

      canvas.renderAll();
    };

    const handleMouseUp = () => {
      isDown = false;
      shape = null;
      updateHistory();
    };

    if (tool !== 'pencil' && tool !== 'eraser') {
      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);
    }

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [tool, color, strokeWidth]);

  // Update history after drawing
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const handlePathCreated = () => {
      updateHistory();
    };

    canvas.on('path:created', handlePathCreated);

    return () => {
      canvas.off('path:created', handlePathCreated);
    };
  }, []);

  const updateHistory = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const json = canvas.toJSON();
    setDrawingData({
      strokes: [], // Simplified for MVP
      width: canvas.width || width,
      height: canvas.height || height,
      background: '#ffffff',
    });

    setCanUndo(canvas.getObjects().length > 0);
    setCanRedo(false);
  };

  // Public methods
  const clearCanvas = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.renderAll();
    updateHistory();
  };

  const undo = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const objects = canvas.getObjects();
    if (objects.length > 0) {
      canvas.remove(objects[objects.length - 1]);
      canvas.renderAll();
      updateHistory();
    }
  };

  const exportCanvas = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;

    return canvas.toJSON();
  };

  // Expose methods via ref
  useEffect(() => {
    if (fabricCanvasRef.current) {
      (fabricCanvasRef.current as any).clearCanvas = clearCanvas;
      (fabricCanvasRef.current as any).undo = undo;
      (fabricCanvasRef.current as any).exportCanvas = exportCanvas;
    }
  }, []);

  return (
    <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white">
      <canvas ref={canvasRef} />
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-500">Caricamento canvas...</div>
        </div>
      )}
    </div>
  );
}

// Export methods for external use
export const getCanvasMethods = (canvas: fabric.Canvas) => ({
  clear: () => {
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.renderAll();
  },
  undo: () => {
    const objects = canvas.getObjects();
    if (objects.length > 0) {
      canvas.remove(objects[objects.length - 1]);
      canvas.renderAll();
    }
  },
  export: () => canvas.toJSON(),
  exportImage: () => canvas.toDataURL({ format: 'png' }),
});
