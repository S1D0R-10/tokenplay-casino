import { useState, useEffect, useRef, useContext } from "react";
import { MockUserCtx } from "./main";

export const Wheel = () => {
    const { user, setUser } = useContext(MockUserCtx);
    const [betAmount, setBetAmount] = useState(1);
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const wheelRef = useRef(null);
    const canvasRef = useRef(null);
    const pointerRef = useRef(null);
    const [difficulty, setDifficulty] = useState("medium");

    const difficultySegments = {
        easy: [
            { color: "#E84242", text: "1x", value: 1 },
            { color: "#4CAF50", text: "1.5x", value: 1.5 },
            { color: "#FF9800", text: "0.5x", value: 0.5 },
            { color: "#2196F3", text: "2x", value: 2 },
            { color: "#9C27B0", text: "0.8x", value: 0.8 },
            { color: "#FFC107", text: "0.7x", value: 0.7 },
            { color: "#2196F3", text: "1.2x", value: 1.2 },
            { color: "#E84242", text: "0.9x", value: 0.9 },
            { color: "#4CAF50", text: "3x", value: 3 },
            { color: "#FF9800", text: "0.5x", value: 0.5 },
        ],
        medium: [
            { color: "#E84242", text: "1x", value: 1 },
            { color: "#4CAF50", text: "1.5x", value: 1.5 },
            { color: "#FF9800", text: "0.2x", value: 0.2 },
            { color: "#2196F3", text: "3x", value: 3 },
            { color: "#9C27B0", text: "0.5x", value: 0.5 },
            { color: "#FFC107", text: "0.2x", value: 0.2 },
            { color: "#2196F3", text: "2x", value: 2 },
            { color: "#E84242", text: "0.5x", value: 0.5 },
            { color: "#4CAF50", text: "5x", value: 5 },
            { color: "#FF9800", text: "0.2x", value: 0.2 },
            { color: "#9C27B0", text: "1x", value: 1 },
            { color: "#FFC107", text: "0.5x", value: 0.5 },
            { color: "#E84242", text: "1.5x", value: 1.5 },
            { color: "#2196F3", text: "10x", value: 10 },
        ],
        hard: [
            { color: "#E84242", text: "0.2x", value: 0.2 },
            { color: "#4CAF50", text: "0.5x", value: 0.5 },
            { color: "#FF9800", text: "0.1x", value: 0.1 },
            { color: "#2196F3", text: "5x", value: 5 },
            { color: "#9C27B0", text: "0.3x", value: 0.3 },
            { color: "#FFC107", text: "0.1x", value: 0.1 },
            { color: "#2196F3", text: "1x", value: 1 },
            { color: "#E84242", text: "0.2x", value: 0.2 },
            { color: "#4CAF50", text: "8x", value: 8 },
            { color: "#FF9800", text: "0.1x", value: 0.1 },
            { color: "#9C27B0", text: "0.5x", value: 0.5 },
            { color: "#FFC107", text: "0.2x", value: 0.2 },
            { color: "#E84242", text: "0.5x", value: 0.5 },
            { color: "#2196F3", text: "15x", value: 15 },
            { color: "#9C27B0", text: "0.3x", value: 0.3 },
            { color: "#4CAF50", text: "0.2x", value: 0.2 },
            { color: "#E84242", text: "20x", value: 20 },
            { color: "#FF9800", text: "0.1x", value: 0.1 },
        ]
    };

    const segments = difficultySegments[difficulty];

    const houseEdge = {
        easy: "3.5%",
        medium: "5%",
        hard: "8%"
    };

    useEffect(() => {
        drawWheel();
        drawPointer();
    }, [difficulty]);

    const drawWheel = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 10;

        ctx.clearRect(0, 0, width, height);

        const segmentAngle = (2 * Math.PI) / segments.length;
        segments.forEach((segment, i) => {
            const startAngle = i * segmentAngle;
            const endAngle = (i + 1) * segmentAngle;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();

            ctx.fillStyle = segment.color;
            ctx.fill();
            ctx.strokeStyle = "#2C3034";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.save();
            ctx.translate(
                centerX + (radius / 1.5) * Math.cos(startAngle + segmentAngle / 2),
                centerY + (radius / 1.5) * Math.sin(startAngle + segmentAngle / 2)
            );
            ctx.rotate(startAngle + segmentAngle / 2 + Math.PI / 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 16px Switzer-Bold";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(segment.text, 0, 0);
            ctx.restore();
        });

        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "#2C3034";
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    const drawPointer = () => {
        const pointer = pointerRef.current;
        if (!pointer) return;

        const pointerCtx = pointer.getContext("2d");
        const width = pointer.width;
        const height = pointer.height;
        
        pointerCtx.clearRect(0, 0, width, height);
        
        pointerCtx.beginPath();
        pointerCtx.moveTo(width / 2, 20);
        pointerCtx.lineTo(width / 2 - 10, 0);
        pointerCtx.lineTo(width / 2 + 10, 0);
        pointerCtx.closePath();
        pointerCtx.fillStyle = "#FFFFFF";
        pointerCtx.fill();
        pointerCtx.strokeStyle = "#2C3034";
        pointerCtx.lineWidth = 2;
        pointerCtx.stroke();
    };

    const spinWheel = () => {
        if (isSpinning || betAmount > user.balance) return;

        setUser((prev) => ({ ...prev, balance: prev.balance - betAmount }));
        setIsSpinning(true);
        setResult(null);

        const randomIndex = Math.floor(Math.random() * segments.length);
        const selectedSegment = segments[randomIndex];
        
        const segmentAngle = (2 * Math.PI) / segments.length;
        
        let targetAngle = (3 * Math.PI / 2) - (randomIndex * segmentAngle + segmentAngle / 2);
        
        if (targetAngle < 0) {
            targetAngle += 2 * Math.PI;
        }
        
        const spins = 4 * 2 * Math.PI;
        const finalRotation = spins + targetAngle;

        const wheel = wheelRef.current;
        wheel.style.transition = "transform 4s cubic-bezier(0.17, 0.67, 0.24, 0.99)";
        wheel.style.transform = `rotate(${finalRotation}rad)`;

        const winAmount = betAmount * selectedSegment.value;
        
        setTimeout(() => {
            setIsSpinning(false);
            
            setResult({ 
                multiplier: selectedSegment.value,
                winAmount: winAmount,
                segment: selectedSegment.text
            });
            
            setUser((prev) => ({ ...prev, balance: prev.balance + winAmount }));
            
            setHistory((prev) => [{
                id: Date.now(),
                bet: betAmount,
                multiplier: selectedSegment.value,
                win: winAmount,
                difficulty: difficulty
            }, ...prev.slice(0, 9)]);
            
            setTimeout(() => {
                wheel.style.transition = "none";
                wheel.style.transform = "rotate(0deg)";
            }, 1000);
        }, 4000);
    };

    const handleDifficultyChange = (newDifficulty) => {
        if (!isSpinning) {
            setDifficulty(newDifficulty);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 pb-8">
            <div className="flex-1 bg-[#2C3034] rounded-lg p-4 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">Wheel</h2>
                
                <div className="flex justify-center mb-4 w-full max-w-sm">
                    <button 
                        className={`px-4 py-2 rounded-l-lg ${difficulty === 'easy' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-[#43474B] hover:bg-[#3A3D41]'}`}
                        onClick={() => handleDifficultyChange('easy')}
                        disabled={isSpinning}
                    >
                        Easy
                    </button>
                    <button 
                        className={`px-4 py-2 ${difficulty === 'medium' 
                            ? 'bg-yellow-600 text-white' 
                            : 'bg-[#43474B] hover:bg-[#3A3D41]'}`}
                        onClick={() => handleDifficultyChange('medium')}
                        disabled={isSpinning}
                    >
                        Medium
                    </button>
                    <button 
                        className={`px-4 py-2 rounded-r-lg ${difficulty === 'hard' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-[#43474B] hover:bg-[#3A3D41]'}`}
                        onClick={() => handleDifficultyChange('hard')}
                        disabled={isSpinning}
                    >
                        Hard
                    </button>
                </div>
                
                <div className="text-sm text-gray-400 mb-4">
                    {segments.length} segments | House Edge: {houseEdge[difficulty]}
                </div>
                
                <div className="relative w-full max-w-md">
                    <div className="relative">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 w-8 h-8">
                            <canvas 
                                ref={pointerRef} 
                                width="40" 
                                height="40" 
                                className="w-full h-full"
                            />
                        </div>
                        
                        <div 
                            ref={wheelRef} 
                            className="relative w-full pb-[100%]"
                        >
                            <canvas 
                                ref={canvasRef} 
                                width="400" 
                                height="400" 
                                className="absolute top-0 left-0 w-full h-full"
                            />
                        </div>
                    </div>
                    
                    {result && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 px-4 py-2 rounded-lg text-center">
                            <div className="text-2xl font-bold">
                                {result.segment}
                            </div>
                            <div className={result.winAmount >= betAmount ? "text-green-500" : "text-red-500"}>
                                {result.winAmount >= betAmount ? "+" : ""}{(result.winAmount - betAmount).toFixed(2)}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="w-full max-w-sm mt-6">
                    <div className="flex items-center gap-2 mb-4">
                        <button 
                            className="bg-[#43474B] hover:bg-[#3A3D41] px-3 py-1 rounded"
                            onClick={() => setBetAmount((prev) => Math.max(1, prev / 2))}
                            disabled={isSpinning}
                        >
                            ½
                        </button>
                        <input
                            type="number"
                            value={betAmount}
                            onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))}
                            className="bg-[#43474B] text-center rounded px-2 py-1 flex-1"
                            min="1"
                            disabled={isSpinning}
                        />
                        <button 
                            className="bg-[#43474B] hover:bg-[#3A3D41] px-3 py-1 rounded"
                            onClick={() => setBetAmount((prev) => prev * 2)}
                            disabled={isSpinning}
                        >
                            2×
                        </button>
                    </div>
                    
                    <button
                        onClick={spinWheel}
                        disabled={isSpinning || betAmount > user.balance}
                        className={`w-full py-2 rounded-lg font-bold text-lg ${
                            isSpinning || betAmount > user.balance
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-[#4CAF50] hover:bg-[#45a049]"
                        }`}
                    >
                        {isSpinning ? "Spinning..." : "Spin"}
                    </button>
                </div>
            </div>
            
            <div className="w-full md:w-72 flex flex-col gap-4">
                <div className="bg-[#2C3034] rounded-lg p-4">
                    <div className="text-gray-400 mb-1">Balance</div>
                    <div className="text-xl font-bold">{user.balance.toFixed(2)}</div>
                </div>
                
                <div className="bg-[#2C3034] rounded-lg p-4 flex-grow">
                    <h3 className="text-lg font-bold mb-3">History</h3>
                    
                    {history.length > 0 ? (
                        <div className="space-y-2">
                            {history.map((item) => (
                                <div key={item.id} className="flex justify-between items-center p-2 bg-[#43474B] rounded">
                                    <div>
                                        <div className="text-gray-400">Bet: {item.bet.toFixed(2)}</div>
                                        <div className={item.win > item.bet ? "text-green-500" : "text-red-500"}>
                                            {item.win > item.bet ? "+" : ""}{(item.win - item.bet).toFixed(2)}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {item.difficulty === 'easy' ? 'Easy' : 
                                             item.difficulty === 'medium' ? 'Medium' : 'Hard'}
                                        </div>
                                    </div>
                                    <div className="text-xl font-bold">{item.multiplier}x</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-400 text-center py-4">No game history yet</div>
                    )}
                </div>
            </div>
        </div>
    );
}; 