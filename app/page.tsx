'use client';

import { useRef, useState } from 'react';
import DrawingCanvas from '@/components/DrawingCanvas';
import Toolbar from '@/components/Toolbar';
import AnimationPreview from '@/components/AnimationPreview';
import { useDrawingStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function Home() {
  const canvasRef = useRef<any>(null);
  const [canvasData, setCanvasData] = useState<any>(null);
  const { mode } = useDrawingStore();

  const handleClear = () => {
    if (canvasRef.current?.clearCanvas) {
      canvasRef.current.clearCanvas();
      setCanvasData(null);
    }
  };

  const handleUndo = () => {
    if (canvasRef.current?.undo) {
      canvasRef.current.undo();
    }
  };

  const handleAnimate = () => {
    if (canvasRef.current?.exportCanvas) {
      const data = canvasRef.current.exportCanvas();
      setCanvasData(data);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎨</div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AppyToons2
                </h1>
                <p className="text-sm text-gray-600">Disegna e Anima i tuoi Cartoni</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                ✅ MVP Ready
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar - Toolbar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Toolbar
              onClear={handleClear}
              onUndo={handleUndo}
              onAnimate={handleAnimate}
            />
          </motion.div>

          {/* Main Canvas Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Mode Indicator */}
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {mode === 'draw' ? '✏️' : '🎬'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {mode === 'draw' ? 'Modalità Disegno' : 'Modalità Animazione'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {mode === 'draw'
                      ? 'Usa gli strumenti per creare il tuo disegno'
                      : 'Genera e visualizza animazioni del tuo disegno'}
                  </p>
                </div>
              </div>
            </div>

            {/* Canvas or Animation Preview */}
            {mode === 'draw' ? (
              <motion.div
                key="canvas"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <DrawingCanvas ref={canvasRef} width={800} height={600} />
              </motion.div>
            ) : (
              <motion.div
                key="animation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <AnimationPreview canvasData={canvasData} />
              </motion.div>
            )}

            {/* Tips Section */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <span>💡</span>
                <span>Come usare AppyToons2</span>
              </h3>
              <ol className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[24px]">1.</span>
                  <span>Seleziona uno strumento dalla barra laterale (matita, gomma, forme)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[24px]">2.</span>
                  <span>Scegli un colore e lo spessore del tratto</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[24px]">3.</span>
                  <span>Disegna liberamente sul canvas bianco</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[24px]">4.</span>
                  <span>Passa alla modalità "Anima" per generare animazioni</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[24px]">5.</span>
                  <span>Clicca "Genera Animazione" e guarda la magia! ✨</span>
                </li>
              </ol>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md mt-12 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>🎨 AppyToons2 - Creato con Next.js, Fabric.js, GSAP e Zustand</p>
          <p className="mt-1">Disegna, Anima, Divertiti! 🚀</p>
        </div>
      </footer>
    </main>
  );
}
