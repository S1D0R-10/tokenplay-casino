import { useState, useEffect, useRef, useContext } from "react";
import { MockUserCtx } from "./main";

export const Wheel = () => {
    const { user, setUser } = useContext(MockUserCtx);
    const [rawBetInput, setRawBetInput] = useState("1.00");
    const [betAmount, setBetAmount] = useState("1.00");
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
        ],
    };

    const segments = difficultySegments[difficulty];

    const houseEdge = {
        easy: "3.5%",
        medium: "5%",
        hard: "8%",
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
                centerX +
                    (radius / 1.5) * Math.cos(startAngle + segmentAngle / 2),
                centerY +
                    (radius / 1.5) * Math.sin(startAngle + segmentAngle / 2)
            );
            ctx.rotate(startAngle + segmentAngle / 2 + Math.PI / 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 20px Switzer-Bold";
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

    const formatToTwoDecimalPlaces = (value) => {
        const floatValue = parseFloat(value) || 0;
        return floatValue.toFixed(2);
    };

    const validateAndSetBetAmount = (amt) => {
        const validAmount = Math.min(
            Math.max(parseFloat(amt) || 0, 0.01),
            Math.floor(user.balance * 100) / 100
        );
        const formatted = formatToTwoDecimalPlaces(validAmount);
        setBetAmount(formatted);
        setRawBetInput(formatted);
    };

    const handleBetChange = (e) => {
        const value = e.target.value.replace(/^\$/, "");
        setRawBetInput(value);
    };

    const handleBlur = () => {
        validateAndSetBetAmount(rawBetInput);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            validateAndSetBetAmount(rawBetInput);
            e.target.blur();
        }
    };

    const handleFocus = (e) => {
        e.target.select();
    };

    const handleHalfBet = () => {
        const currentValue = parseFloat(betAmount) || 0;
        const halvedValue = Math.max(currentValue * 0.5, 0.01);
        validateAndSetBetAmount(halvedValue);
    };

    const handleDoubleBet = () => {
        const currentValue = parseFloat(betAmount) || 0;
        const doubledValue = Math.min(currentValue * 2, user.balance);
        validateAndSetBetAmount(doubledValue);
    };

    const spinWheel = () => {
        const betValue = parseFloat(betAmount);
        if (isSpinning || betValue > user.balance) return;

        setUser((prev) => ({ ...prev, balance: prev.balance - betValue }));
        setIsSpinning(true);
        setResult(null);

        const randomIndex = Math.floor(Math.random() * segments.length);
        const selectedSegment = segments[randomIndex];

        const segmentAngle = (2 * Math.PI) / segments.length;

        let targetAngle =
            (3 * Math.PI) / 2 - (randomIndex * segmentAngle + segmentAngle / 2);

        if (targetAngle < 0) {
            targetAngle += 2 * Math.PI;
        }

        const spins = 4 * 2 * Math.PI;
        const finalRotation = spins + targetAngle;

        const wheel = wheelRef.current;
        wheel.style.transition =
            "transform 4s cubic-bezier(0.17, 0.67, 0.24, 0.99)";
        wheel.style.transform = `rotate(${finalRotation}rad)`;

        const winAmount = betValue * selectedSegment.value;

        setTimeout(() => {
            setIsSpinning(false);

            setResult({
                multiplier: selectedSegment.value,
                winAmount: winAmount,
                segment: selectedSegment.text,
            });

            setUser((prev) => ({ ...prev, balance: prev.balance + winAmount }));

            setHistory((prev) => [
                {
                    id: Date.now(),
                    bet: betValue,
                    multiplier: selectedSegment.value,
                    win: winAmount,
                    difficulty: difficulty,
                },
                ...prev.slice(0, 9),
            ]);

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#43474B] text-white p-4">
            <div className="w-full max-w-md">
                <div className="bg-[#596063] p-4 pb-0 shadow-lg rounded-lg">
                    <div className="mb-4">
                        <div className="bg-[#A2A2A2] p-3 rounded-md text-center shadow-md">
                            <div className="flex items-center justify-center">
                                <span className="text-[#5A4F4F] text-xl font-bold">
                                    $
                                </span>
                                <input
                                    type="text"
                                    value={rawBetInput}
                                    onChange={handleBetChange}
                                    onBlur={handleBlur}
                                    onFocus={handleFocus}
                                    onKeyDown={handleKeyDown}
                                    disabled={isSpinning}
                                    className="bg-transparent text-[#5A4F4F] text-xl font-bold text-center w-28 outline-none"
                                    aria-label="Bet amount"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button
                            className={`bg-[#A2A2A2] text-[#5A4F4F] px-4 py-2 rounded-md font-bold w-24 shadow-md ${
                                !isSpinning
                                    ? "hover:bg-gray-500"
                                    : "opacity-50 cursor-not-allowed"
                            }`}
                            onClick={handleHalfBet}
                            disabled={isSpinning}
                        >
                            0.5x
                        </button>
                        <button
                            className={`bg-[#A2A2A2] text-[#5A4F4F] px-4 py-2 rounded-md font-bold w-24 shadow-md ${
                                !isSpinning
                                    ? "hover:bg-gray-500"
                                    : "opacity-50 cursor-not-allowed"
                            }`}
                            onClick={handleDoubleBet}
                            disabled={isSpinning}
                        >
                            2x
                        </button>
                    </div>

                    {/* Updated difficulty buttons section with responsive column layout */}
                    <div className="mb-4">
                        <div className="py-3 rounded-md">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <button
                                    className={`px-3 py-2 rounded-md font-bold transition-colors duration-200 ${
                                        difficulty === "easy"
                                            ? "bg-[#409253] text-[#23522E]"
                                            : "bg-[#737981] text-[#5A4F4F] hover:bg-gray-500"
                                    } ${isSpinning ? "opacity-75" : ""}`}
                                    onClick={() => handleDifficultyChange("easy")}
                                    disabled={isSpinning}
                                >
                                    Easy
                                </button>
                                <button
                                    className={`px-3 py-2 rounded-md font-bold transition-colors duration-200 ${
                                        difficulty === "medium"
                                            ? "bg-[#C89B3C] text-[#735A28]"
                                            : "bg-[#737981] text-[#5A4F4F] hover:bg-gray-500"
                                    } ${isSpinning ? "opacity-75" : ""}`}
                                    onClick={() => handleDifficultyChange("medium")}
                                    disabled={isSpinning}
                                >
                                    Medium
                                </button>
                                <button
                                    className={`px-3 py-2 rounded-md font-bold transition-colors duration-200 ${
                                        difficulty === "hard"
                                            ? "bg-[#C04747] text-[#5A2828]"
                                            : "bg-[#737981] text-[#5A4F4F] hover:bg-gray-500"
                                    } ${isSpinning ? "opacity-75" : ""}`}
                                    onClick={() => handleDifficultyChange("hard")}
                                    disabled={isSpinning}
                                >
                                    Hard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={spinWheel}
                    disabled={
                        isSpinning ||
                        parseFloat(betAmount) <= 0 ||
                        parseFloat(betAmount) > user.balance
                    }
                    className={`bg-[#409253] text-[#23522E] w-full py-3 rounded-md font-bold text-xl shadow-md ${
                        !isSpinning &&
                        parseFloat(betAmount) > 0 &&
                        parseFloat(betAmount) <= user.balance
                            ? "hover:bg-green-600"
                            : "opacity-50 cursor-not-allowed"
                    }`}
                >
                    {isSpinning ? "SPINNING..." : "SPIN"}
                </button>
                <div className="relative w-full mb-6">
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

                    {result && !isSpinning && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 px-4 py-2 rounded-lg text-center">
                            <div className="text-2xl font-bold">
                                {result.segment}
                            </div>
                            <div
                                className={
                                    parseFloat(result.winAmount) >=
                                    parseFloat(betAmount)
                                        ? "text-green-400"
                                        : "text-red-400"
                                }
                            >
                                {parseFloat(result.winAmount) >=
                                parseFloat(betAmount)
                                    ? "+"
                                    : ""}
                                {(
                                    parseFloat(result.winAmount) -
                                    parseFloat(betAmount)
                                ).toFixed(2)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};