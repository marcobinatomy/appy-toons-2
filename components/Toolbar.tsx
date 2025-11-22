'use client';

import React from 'react';
import { useDrawingStore } from '@/lib/store';
import { DrawingTool } from '@/lib/types';
import { motion } from 'framer-motion';

interface ToolbarProps {
  onClear?: () => void;
  onUndo?: () => void;
  onAnimate?: () => void;
}

export default function Toolbar({ onClear, onUndo, onAnimate }: ToolbarProps) {
  const { tool, color, strokeWidth, mode, canUndo, setTool, setColor, setStrokeWidth, setMode } = useDrawingStore();

  const tools: { id: DrawingTool; icon: string; label: string }[] = [
    { id: 'pencil', icon: '✏️', label: 'Matita' },
    { id: 'eraser', icon: '🧹', label: 'Gomma' },
    { id: 'circle', icon: '⭕', label: 'Cerchio' },
    { id: 'rectangle', icon: '▭', label: 'Rettangolo' },
    { id: 'line', icon: '📏', label: 'Linea' },
  ];

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
    '#800080', '#FFC0CB', '#8B4513', '#808080'
  ];

  const strokeWidths = [2, 5, 10, 15, 20];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMode('draw')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            mode === 'draw'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ✏️ Disegna
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMode('animate')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            mode === 'animate'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🎬 Anima
        </motion.button>
      </div>

      {/* Drawing Tools */}
      {mode === 'draw' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Strumenti
            </label>
            <div className="grid grid-cols-5 gap-2">
              {tools.map((t) => (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setTool(t.id)}
                  className={`p-3 rounded-lg text-2xl transition-all ${
                    tool === t.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  title={t.label}
                >
                  {t.icon}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Colore
            </label>
            <div className="grid grid-cols-6 gap-2">
              {colors.map((c) => (
                <motion.button
                  key={c}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    color === c ? 'ring-4 ring-blue-500 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
            {/* Custom Color Picker */}
            <div className="mt-2 flex items-center gap-2">
              <label className="text-sm text-gray-600">Personalizzato:</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-8 rounded cursor-pointer"
              />
              <span className="text-xs text-gray-500 font-mono">{color}</span>
            </div>
          </div>

          {/* Stroke Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Spessore: {strokeWidth}px
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1px</span>
              <span>30px</span>
            </div>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t">
        {mode === 'draw' && (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onUndo}
              disabled={!canUndo}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                canUndo
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              ↶ Annulla
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClear}
              className="w-full py-2 px-4 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              🗑️ Cancella Tutto
            </motion.button>
          </>
        )}

        {mode === 'animate' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAnimate}
            className="w-full py-3 px-4 rounded-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
          >
            🎬 Genera Animazione
          </motion.button>
        )}
      </div>

      {/* Info Section */}
      <div className="text-xs text-gray-500 pt-2 border-t">
        <p className="mb-1">💡 <strong>Suggerimenti:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Disegna liberamente sul canvas</li>
          <li>Usa forme per elementi precisi</li>
          <li>Passa a modalità Anima per vedere la magia!</li>
        </ul>
      </div>
    </div>
  );
}
