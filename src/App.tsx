import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';

interface BubbleProps {
  id: number;
  x: number;
  onBurst: (id: number) => void;
}

const Bubble = ({ id, x, onBurst }: BubbleProps) => {
  return (
    <motion.div
      className="w-12 h-12 bg-blue-400 rounded-full absolute cursor-pointer shadow-lg"
      style={{ left: x, bottom: '-3rem' }}
      initial={{ y: 0 }}
      animate={{ y: '-100vh' }}
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

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const newBubble: BubbleProps = {
        id: Date.now(),
        x: Math.random() * (window.innerWidth - 50),
        onBurst: burstBubble,
      };
      setBubbles((prev) => [...prev, newBubble]);
    }, 1000);

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
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-800 to-blue-900 text-white relative overflow-hidden">
      <h1 className="text-4xl font-bold mb-4">Bubble Burst Game</h1>
      {isPlaying ? (
        <div className="text-center">
          <p className="text-xl">Burst Count: {burstCount}</p>
          <p className="text-xl mb-4">Best Score: {bestScore}</p>
          {bubbles.map((bubble) => (
            <Bubble key={bubble.id} id={bubble.id} x={bubble.x} onBurst={burstBubble} />
          ))}
        </div>
      ) : (
        <button onClick={startGame} className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">Play</button>
      )}
    </div>
  );
}

export default App;
