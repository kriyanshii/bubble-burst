import { motion } from 'framer-motion';

interface BubbleProps {
  id: number;
  x: number;
  size: number;
  onBurst: (id: number) => void;
}

const Bubble = ({ id, x, size, onBurst }: BubbleProps) => {
  return (
    <motion.div
      className="bg-blue-400 rounded-full absolute shadow-lg"
      style={{ left: x, bottom: '-3rem', width: size, height: size }}
      initial={{ y: 0, opacity: 0.8 }}
      animate={{ y: '-100vh', opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 5, ease: 'linear' }}
      onMouseEnter={() => onBurst(id)}
    />
  );
};

export default Bubble;
