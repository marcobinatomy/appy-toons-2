'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useDrawingStore } from '@/lib/store';
import { AnimationData } from '@/lib/types';

interface AnimationPreviewProps {
  canvasData: any;
}

export default function AnimationPreview({ canvasData }: AnimationPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { animationData, setAnimationData } = useDrawingStore();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const generateAnimation = async () => {
    if (!canvasData) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/animate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drawingData: canvasData }),
      });

      if (!response.ok) throw new Error('Failed to generate animation');

      const result = await response.json();
      setAnimationData(result.data);
    } catch (error) {
      console.error('Animation generation error:', error);
      alert('Errore nella generazione dell\'animazione');
    } finally {
      setIsLoading(false);
    }
  };

  const playAnimation = () => {
    if (!containerRef.current || !animationData) return;

    setIsPlaying(true);

    // Clear previous animation
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Create GSAP timeline
    const timeline = gsap.timeline({
      onComplete: () => setIsPlaying(false),
    });

    timelineRef.current = timeline;

    // Get all animated elements
    const elements = containerRef.current.querySelectorAll('.animated-element');

    // Apply animations
    animationData.animations.forEach((anim, index) => {
      const element = elements[index % elements.length];
      if (!element) return;

      const animProps: any = {
        duration: anim.duration,
        ease: anim.easing,
      };

      switch (anim.type) {
        case 'move':
          animProps.x = Math.random() * 200 - 100;
          animProps.y = Math.random() * 200 - 100;
          break;
        case 'rotate':
          animProps.rotation = 360;
          break;
        case 'scale':
          animProps.scale = 1.5;
          animProps.yoyo = true;
          animProps.repeat = 1;
          break;
        case 'fade':
          animProps.opacity = 0.3;
          animProps.yoyo = true;
          animProps.repeat = 1;
          break;
        case 'bounce':
          animProps.y = -50;
          animProps.ease = 'bounce.out';
          break;
      }

      timeline.to(element, animProps, anim.delay || 0);
    });

    timeline.play();
  };

  const stopAnimation = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      if (containerRef.current) {
        gsap.set(containerRef.current.querySelectorAll('.animated-element'), {
          clearProps: 'all',
        });
      }
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Preview Container */}
      <div
        ref={containerRef}
        className="relative w-full h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden border-2 border-purple-300"
      >
        {!animationData ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                Pronto per l'animazione?
              </h3>
              <p className="text-gray-600 mb-4">
                Clicca "Genera Animazione" per vedere il tuo disegno prendere vita!
              </p>
              <button
                onClick={generateAnimation}
                disabled={isLoading || !canvasData}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '⏳ Generazione...' : '🎬 Genera Animazione'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Animated elements representation */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="grid grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="animated-element w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg shadow-lg"
                  />
                ))}
              </div>
            </div>

            {/* Animation Info Overlay */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <p className="text-sm font-medium text-gray-700">
                🎬 Animazioni: {animationData.animations.length}
              </p>
              <p className="text-sm text-gray-600">
                ⏱️ Durata: {animationData.totalDuration.toFixed(1)}s
              </p>
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      {animationData && (
        <div className="flex gap-3">
          <button
            onClick={playAnimation}
            disabled={isPlaying}
            className="flex-1 py-3 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaying ? '⏸️ In riproduzione...' : '▶️ Riproduci'}
          </button>
          <button
            onClick={stopAnimation}
            disabled={!isPlaying}
            className="flex-1 py-3 px-4 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⏹️ Stop
          </button>
          <button
            onClick={generateAnimation}
            disabled={isLoading}
            className="px-6 py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-all disabled:opacity-50"
          >
            🔄 Nuova
          </button>
        </div>
      )}

      {/* Animation Details */}
      {animationData && (
        <div className="bg-white rounded-lg p-4 shadow">
          <h4 className="font-bold text-gray-700 mb-2">📋 Dettagli Animazione</h4>
          <div className="space-y-2">
            {animationData.animations.map((anim, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {i + 1}
                </span>
                <span className="capitalize font-medium">{anim.type}</span>
                <span className="text-gray-500">
                  • {anim.duration}s • {anim.easing}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
