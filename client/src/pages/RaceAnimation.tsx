// components/BinaryRaceAnimation.tsx
import { useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import { Loader2 } from 'lucide-react';
import animationData from '../assets/animation.json';

const messages = [
  "Please wait while we fetch your data...",
  "We are trying to race fast! 🏎️",
  "We are sorry if we're not as fast as you! 🐌",
  "Vrooooom... Almost there! 🏁",
];

export function BinaryRaceAnimation() {
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let messageIndex = 0;
    let frame = 0;

    const updateMessage = () => {
      if (messageRef.current) {
        messageIndex = (messageIndex + 1) % messages.length;
        messageRef.current.textContent = messages[messageIndex];
      }
    };

    const interval = setInterval(updateMessage, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
      <div className="w-64 h-64">
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
        />
      </div>
      <div className="mt-8">
        <div
          ref={messageRef}
          className="text-primary text-2xl font-mono bg-background/80 p-4 rounded-lg shadow-lg"
        >
          {messages[0]}
        </div>
      </div>
    </div>
  );
}
