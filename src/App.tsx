import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './App.css';

interface BubbleProps {
  id: number;
  x: number;
  size: number;
  onBurst: (id: number) => void;
}

const Bubble = ({ id, x, size, onBurst }: BubbleProps) => {
  // Array of Tailwind blue color classes
  const blueShades = [
    'bg-blue-300',
    'bg-blue-400',
    'bg-blue-500',
    'bg-blue-600',
    'bg-blue-700'
  ];
  
  // Pick a random blue shade
  const randomBlue = blueShades[Math.floor(Math.random() * blueShades.length)];
  
  return (
    <motion.div
      className={`${randomBlue} rounded-full absolute cursor-pointer shadow-lg`}
      style={{ 
        left: `${x}px`,
        bottom: 0,
        width: `${size}px`,
        height: `${size}px` 
      }}
      initial={{ y: 0 }}
      animate={{ y: `-${window.innerHeight + size}px` }}
      transition={{ duration: 5, ease: 'linear' }}
      onMouseEnter={() => onBurst(id)}
    ></motion.div>
  );
};

function App() {
  const [bubbles, setBubbles] = useState<BubbleProps[]>([]);
  const [burstCount, setBurstCount] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const nextIdRef = useRef(0);

  useEffect(() => {
    if (!isPlaying) return;

    const createBubble = () => {
      const newBubble: BubbleProps = {
        id: nextIdRef.current++,
        x: Math.random() * (window.innerWidth - 100),
        size: Math.random() * (50 - 20) + 20,
        onBurst: burstBubble,
      };
      console.log("creating bubble...")
      setBubbles((prev) => [...prev, newBubble]);
    };

    const interval = setInterval(() => {
      const bubblesPerSecond = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < bubblesPerSecond; i++) {
        createBubble();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const burstBubble = (id: number) => {
    setBubbles((prev) => prev.filter((bubble) => bubble.id !== id));
    setBurstCount((prev) => {
      const newCount = prev + 1;
      if (newCount > bestScore) setBestScore(newCount);
      return newCount;
    });
  };

  const startGame = () => {
    setIsPlaying(true);
    setBurstCount(0);
    setBubbles([]);
    nextIdRef.current = 0;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-800 to-blue-900 text-white relative overflow-hidden">
      <h1 className="text-4xl font-bold mb-4 z-10">Bubble Burst Game</h1>
      {isPlaying ? (
        <div className="absolute inset-0">
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <p className="text-xl">Burst Count: {burstCount}</p>
            <p className="text-xl mb-4">Best Score: {bestScore}</p>
          </div>
          {bubbles.map((bubble) => (
            <Bubble key={bubble.id} id={bubble.id} x={bubble.x} size={bubble.size} onBurst={burstBubble} />
          ))}
        </div>
      ) : (
        <button onClick={startGame} className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition z-10">
          Play
        </button>
      )}
    </div>
  );
}

export default App;
