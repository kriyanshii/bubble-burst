// palette - https://coolors.co/palette/1a535c-4ecdc4-f7fff7-ff6b6b-ffe66d
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay } from "react-icons/fa";

interface BubbleProps {
	id: number;
	x: number;
	size: number;
	speed: number;
	color: string;
	onBurst: (id: number) => void;
}

const bubbleColors = ["#1A535C", "#4ECDC4", "#FF6B6B", "#FFE66D"];

const Bubble = ({ id, x, size, speed, color, onBurst }: BubbleProps) => {
	const handleBurst = () => {
		onBurst(id);
	};

	return (
		<motion.div
			className="rounded-full absolute cursor-pointer shadow-lg"
			style={{
				left: x,
				bottom: "-3rem",
				width: size,
				height: size,
				backgroundColor: color,
			}}
			initial={{ y: 0, opacity: 0.8 }}
			animate={{ y: "-100vh", opacity: [0.8, 1, 0.8] }}
			transition={{ duration: speed, ease: "linear" }}
			onAnimationComplete={handleBurst}
			onMouseEnter={handleBurst}>
			<motion.div
				className="w-full h-full rounded-full"
				initial={{ scale: 1 }}
				exit={{ scale: 1.5, opacity: 0 }}
				transition={{ duration: 0.3 }}></motion.div>
		</motion.div>
	);
};

function App() {
	const [bubbles, setBubbles] = useState<BubbleProps[]>([]);
	const [burstCount, setBurstCount] = useState(0);
	const [bestScore, setBestScore] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [timeLeft, setTimeLeft] = useState(30);
	const [showScore, setShowScore] = useState(false);
	const [mode, setMode] = useState<"easy" | "mid" | "hard">("easy");

	const getSpeed = () => {
		switch (mode) {
			case "mid":
				return 4;
			case "hard":
				return 2.5;
			default:
				return 5;
		}
	};

	useEffect(() => {
		if (!isPlaying) return;

		const createBubble = () => {
			const newBubble: BubbleProps = {
				id: Date.now(),
				x: Math.random() * (window.innerWidth - 50),
				size: Math.random() * (80 - 30) + 30,
				speed: getSpeed(),
				color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
				onBurst: burstBubble,
			};
			setBubbles((prev) => [...prev, newBubble]);
		};

		const bubbleInterval = setInterval(() => {
			createBubble();
		}, 500);

		const timerInterval = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(bubbleInterval);
					clearInterval(timerInterval);
					setIsPlaying(false);
					setShowScore(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => {
			clearInterval(bubbleInterval);
			clearInterval(timerInterval);
		};
	}, [isPlaying, mode]);

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
		setShowScore(false);
		setBurstCount(0);
		setBubbles([]);
		setTimeLeft(30);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-white text-black relative overflow-hidden sigmar-regular">
			<AnimatePresence>
				{!isPlaying && !showScore && (
					<motion.div
						className="text-center"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}>
						<h1 className="text-4xl  flex flex-col font-bold mb-4">
							Bubble Burst
						</h1>
						<div className="flex gap-4 mb-4">
							<button
								onClick={() => setMode("easy")}
								className={`px-4 py-2 rounded-lg font-semibold shadow-md ${
									mode === "easy" ? "bg-black text-white" : "bg-gray-300"
								}`}>
								Easy
							</button>
							<button
								onClick={() => setMode("mid")}
								className={`px-4 py-2 rounded-lg font-semibold shadow-md ${
									mode === "mid" ? "bg-black text-white" : "bg-gray-300"
								}`}>
								Mid
							</button>
							<button
								onClick={() => setMode("hard")}
								className={`px-4 py-2 rounded-lg font-semibold shadow-md ${
									mode === "hard" ? "bg-black text-white" : "bg-gray-300"
								}`}>
								Hard
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{isPlaying && (
				<>
					<motion.div className="absolute top-4 right-4 bg-white text-black px-4 py-2 rounded-full text-lg font-semibold shadow-md">
						Burst Count: {burstCount}
					</motion.div>
					<motion.div className="absolute top-4 left-4 bg-white text-black px-4 py-2 rounded-full text-lg font-semibold shadow-md">
						Time Left: {timeLeft}s | Best Score: {bestScore}
					</motion.div>
				</>
			)}

			{isPlaying ? (
				<div className="text-center">
					{bubbles.map((bubble) => (
						<Bubble key={bubble.id} {...bubble} />
					))}
				</div>
			) : showScore ? (
				<motion.div className="text-center flex flex-col text-3xl font-bold">
					Game Over! Your score: {burstCount}
					<button
						onClick={startGame}
						className="block mt-4 px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition">
						Play Again
					</button>
				</motion.div>
			) : (
				<motion.button
					onClick={startGame}
					className="p-4 bg-black text-white font-semibold rounded-full shadow-md hover:bg-gray-800 transition flex items-center justify-center">
					<FaPlay className="h-8 w-8" />
				</motion.button>
			)}
		</div>
	);
}

export default App;
