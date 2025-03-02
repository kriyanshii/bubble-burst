// palette - https://coolors.co/palette/1a535c-4ecdc4-f7fff7-ff6b6b-ffe66d
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlay, FaPause, FaInfoCircle } from "react-icons/fa";

interface BubbleProps {
	id: number;
	x: number;
	size: number;
	speed: number;
	color: string;
	points: number;
	onBurst: (id: number, points: number) => void;
	isPaused: boolean;
}

const bubbleColors = ["#1A535C", "#4ECDC4", "#FF6B6B", "#FFE66D"];

const Bubble = ({
	id,
	x,
	size,
	speed,
	color,
	points,
	onBurst,
	isPaused,
}: BubbleProps) => {
	const [isBursting, setIsBursting] = useState(false);

	const handleBurst = () => {
		if (!isBursting) {
			setIsBursting(true);
			// Delay the actual burst callback to allow animation to play
			setTimeout(() => {
				onBurst(id, points);
			}, 300); // Match this with animation duration
		}
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
			initial={{ y: 0, opacity: 0.8, scale: 1 }}
			animate={{
				y: isBursting ? "-95vh" : "-100vh",
				opacity: isBursting ? 0 : [0.8, 1, 0.8],
				scale: isBursting ? 1.5 : 1,
			}}
			transition={{
				y: { duration: speed, ease: "linear" },
				opacity: { duration: isBursting ? 0.3 : speed },
				scale: { duration: 0.3 },
				paused: isPaused,
			}}
			onAnimationComplete={!isBursting ? handleBurst : undefined}
			onMouseEnter={handleBurst}>
			{/* Add particles for burst effect */}
			{isBursting && (
				<motion.div
					className="absolute inset-0"
					initial={{ scale: 1 }}
					animate={{ scale: 1.5, opacity: 0 }}>
					{[...Array(8)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute w-2 h-2 rounded-full"
							style={{
								backgroundColor: color,
								left: "50%",
								top: "50%",
								transform: `rotate(${i * 45}deg)`,
							}}
							initial={{ x: 0, y: 0 }}
							animate={{
								x: Math.cos((i * Math.PI) / 4) * size,
								y: Math.sin((i * Math.PI) / 4) * size,
								opacity: 0,
							}}
							transition={{ duration: 0.3, ease: "easeOut" }}
						/>
					))}
				</motion.div>
			)}
		</motion.div>
	);
};

function App() {
	const [bubbles, setBubbles] = useState<BubbleProps[]>([]);
	const [burstCount, setBurstCount] = useState(0);
	const [bestScore, setBestScore] = useState(() => {
		const savedScore = localStorage.getItem('bubbleBurstBestScore');
		return savedScore ? parseInt(savedScore) : 0;
	});
	const [isPlaying, setIsPlaying] = useState(false);
	const [timeLeft, setTimeLeft] = useState(30);
	const [showScore, setShowScore] = useState(false);
	const [mode, setMode] = useState<"easy" | "mid" | "hard">("easy");
	const [isPaused, setIsPaused] = useState(false);
	const [showInfo, setShowInfo] = useState(false);

	useEffect(() => {
		localStorage.setItem('bubbleBurstBestScore', bestScore.toString());
	}, [bestScore]);

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

	const calculatePoints = (size: number) => {
		if (size < 40) return 3;
		if (size < 60) return 2;
		return 1;
	};

	useEffect(() => {
		if (!isPlaying || isPaused) return;

		const createBubble = () => {
			const size = Math.random() * (80 - 30) + 30;
			const newBubble: BubbleProps = {
				id: Date.now(),
				x: Math.random() * (window.innerWidth - 50),
				size,
				speed: getSpeed(),
				color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
				points: calculatePoints(size),
				onBurst: burstBubble,
				isPaused: isPaused,
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
	}, [isPlaying, mode, isPaused]);

	const burstBubble = (id: number, points: number) => {
		setBubbles((prev) => prev.filter((bubble) => bubble.id !== id));
		setBurstCount((prev) => {
			const newCount = prev + points;
			if (newCount > bestScore) {
				setBestScore(newCount);
			}
			return newCount;
		});
	};

	const togglePause = () => {
		setIsPaused(!isPaused);
	};

	const startGame = () => {
		setIsPlaying(true);
		setShowScore(false);
		setBurstCount(0);
		setBubbles([]);
		setTimeLeft(30);
		setIsPaused(false);
	};

	const resetGame = () => {
		setShowScore(false);
		setBurstCount(0);
		setBubbles([]);
		setTimeLeft(30);
		setIsPaused(false);
	};

	const DifficultySelector = () => (
		<motion.div
			className="text-center"
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}>
			<h1 className="text-4xl flex flex-col font-bold mb-4">
				Bubble Burst
			</h1>
			<div className="flex gap-4 mb-4">
				<button
					onClick={() => {
						setMode("easy");
						startGame();
					}}
					className={`px-4 py-2 rounded-lg font-semibold shadow-md ${
						mode === "easy" ? "bg-black text-white" : "bg-gray-300"
					}`}>
					Easy
				</button>
				<button
					onClick={() => {
						setMode("mid");
						startGame();
					}}
					className={`px-4 py-2 rounded-lg font-semibold shadow-md ${
						mode === "mid" ? "bg-black text-white" : "bg-gray-300"
					}`}>
					Mid
				</button>
				<button
					onClick={() => {
						setMode("hard");
						startGame();
					}}
					className={`px-4 py-2 rounded-lg font-semibold shadow-md ${
						mode === "hard" ? "bg-black text-white" : "bg-gray-300"
					}`}>
					Hard
				</button>
			</div>
		</motion.div>
	);

	const InfoModal = () => (
		<motion.div 
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.2 }}
		>
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.8, opacity: 0 }}
				transition={{ duration: 0.2 }}
				className="bg-white text-black p-8 rounded-lg max-w-md shadow-xl relative">
				<button
					onClick={() => setShowInfo(false)}
					className="absolute top-2 right-2 text-gray-500 hover:text-black transition-colors">
					✕
				</button>
				<h2 className="text-2xl font-bold mb-4">About Bubble Burst</h2>
				<div className="space-y-4 text-gray-700">
					<p>
						Built by Kriyanshi Shah as a fun project to explore React, Framer Motion, and game development concepts.
					</p>
					<p>
						The game challenges players to catch bubbles of different sizes, with smaller bubbles worth more points!
					</p>
					<p className="text-sm text-gray-500 mt-4">
						Tech Stack: React, TypeScript, Tailwind CSS, Framer Motion
					</p>
          <a href="https://kriyanshii.github.io/">reach out  to me</a>
				</div>
			</motion.div>
		</motion.div>
	);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-white text-black relative overflow-hidden sigmar-regular">
			<motion.button
				onClick={() => !showInfo && setShowInfo(true)}
				className="absolute top-4 right-4 p-2 text-gray-600 hover:text-black z-50 select-none"
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
				transition={{ duration: 0.2 }}
			>
				<FaInfoCircle className="w-6 h-6" />
			</motion.button>

			{showInfo && <InfoModal />}

			{isPlaying && (
				<>
					<motion.div className="absolute top-4 right-16 bg-white text-black px-4 py-2 rounded-full text-lg font-semibold shadow-md">
						Burst Count: {burstCount}
					</motion.div>
					<motion.div className="absolute top-4 left-4 bg-white text-black px-4 py-2 rounded-full text-lg font-semibold shadow-md">
						Time Left: {timeLeft}s | Best Score: {bestScore}
					</motion.div>
					<motion.button
						onClick={togglePause}
						className="absolute top-4 left-1/2 -translate-x-1/2 p-4 bg-black text-white font-semibold rounded-full shadow-md hover:bg-gray-800 transition flex items-center justify-center z-50">
						{isPaused ? (
							<FaPlay className="h-6 w-6" />
						) : (
							<FaPause className="h-6 w-6" />
						)}
					</motion.button>
				</>
			)}

			{isPlaying ? (
				<div className="text-center">
					{isPaused && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
							<motion.div
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								className="text-white text-4xl font-bold">
								PAUSED
							</motion.div>
						</div>
					)}
					{bubbles.map((bubble) => (
						<Bubble key={bubble.id} {...bubble} isPaused={isPaused} />
					))}
				</div>
			) : showScore ? (
				<motion.div 
					className="text-center flex flex-col items-center justify-center p-4"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
				>
					<motion.h2 
						className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
						initial={{ scale: 0.9 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.3 }}
					>
						Game Over!
					</motion.h2>
					<motion.p 
						className="text-2xl md:text-3xl lg:text-4xl mb-8"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						Your score: {burstCount}
					</motion.p>
					<motion.button
						onClick={resetGame}
						className="px-8 py-4 bg-black text-white text-xl md:text-2xl font-semibold rounded-xl shadow-lg hover:bg-gray-800 active:scale-95 transform transition-all duration-150 ease-in-out"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						Play Again
					</motion.button>
				</motion.div>
			) : (
				<DifficultySelector />
			)}
		</div>
	);
}

export default App;
