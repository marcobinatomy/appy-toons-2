import { NextRequest, NextResponse } from 'next/server';
import { AnimationData, AnimationConfig } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { drawingData } = body;

    if (!drawingData) {
      return NextResponse.json(
        { error: 'Drawing data is required' },
        { status: 400 }
      );
    }

    // Generate random animations based on drawing complexity
    const animations: AnimationConfig[] = generateAnimations(drawingData);

    const animationData: AnimationData = {
      drawingData,
      animations,
      totalDuration: calculateTotalDuration(animations),
    };

    return NextResponse.json({ 
      success: true, 
      data: animationData 
    });

  } catch (error) {
    console.error('Animation API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate animation' },
      { status: 500 }
    );
  }
}

function generateAnimations(drawingData: any): AnimationConfig[] {
  const animations: AnimationConfig[] = [];
  
  // Random animation types
  const types: AnimationConfig['type'][] = ['move', 'rotate', 'scale', 'fade', 'bounce'];
  const easings = ['power1.inOut', 'power2.inOut', 'elastic.out', 'back.out', 'bounce.out'];
  
  // Generate 3-5 random animations
  const numAnimations = Math.floor(Math.random() * 3) + 3;
  
  for (let i = 0; i < numAnimations; i++) {
    animations.push({
      type: types[Math.floor(Math.random() * types.length)],
      duration: Math.random() * 2 + 1, // 1-3 seconds
      easing: easings[Math.floor(Math.random() * easings.length)],
      delay: i * 0.5, // Stagger animations
    });
  }
  
  return animations;
}

function calculateTotalDuration(animations: AnimationConfig[]): number {
  return animations.reduce((total, anim) => {
    const endTime = (anim.delay || 0) + anim.duration;
    return Math.max(total, endTime);
  }, 0);
}
