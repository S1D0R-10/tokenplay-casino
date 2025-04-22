import { useContext, useState, useEffect, useRef } from "react";
import { MockUserCtx } from "./main";

const outcomes = ["Heads", "Tails"];

export const Coinflip = () => {
    const { user, setUser } = useContext(MockUserCtx);
    const [selectedSide, setSelectedSide] = useState("Heads");
    const [rawBetInput, setRawBetInput] = useState("1.00");
    const [betAmount, setBetAmount] = useState("1.00");
    const [isFlipping, setIsFlipping] = useState(false);
    const [lastResult, setLastResult] = useState(null);
    const [won, setWon] = useState(false);
    const [flipLetter, setFlipLetter] = useState("?");
    const flipIntervalRef = useRef(null);

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

    // Clean up interval on component unmount
    useEffect(() => {
        return () => {
            if (flipIntervalRef.current) {
                clearInterval(flipIntervalRef.current);
            }
        };
    }, []);

    const flipCoin = () => {
        const betValue = parseFloat(betAmount);
        if (betValue <= 0 || betValue > user.balance) return;

        // Deduct bet amount immediately
        setUser((u) => ({
            ...u,
            balance: u.balance - betValue,
        }));

        // Reset and start flipping
        setIsFlipping(true);
        setLastResult(null);
        setWon(false);
        
        // Start the letter animation
        if (flipIntervalRef.current) {
            clearInterval(flipIntervalRef.current);
        }
        
        // Initialize with a random letter
        setFlipLetter(Math.random() > 0.5 ? "H" : "T");
        
        // Set up interval to alternate between H and T
        flipIntervalRef.current = setInterval(() => {
            setFlipLetter((current) => (current === "H" ? "T" : "H"));
        }, 150); // Change letter every 150ms

        const timeout = setTimeout(() => {
            const outcome = outcomes[Math.floor(Math.random() * 2)];
            setLastResult(outcome);

            const playerWon = outcome === selectedSide;
            setWon(playerWon);

            if (playerWon) {
                // Win - return bet plus winnings (2x bet)
                setUser((u) => ({
                    ...u,
                    balance: u.balance + betValue * 2,
                }));
            }

            // Stop the letter animation
            if (flipIntervalRef.current) {
                clearInterval(flipIntervalRef.current);
                flipIntervalRef.current = null;
            }
            
            setIsFlipping(false);
            clearTimeout(timeout);
        }, 2000);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#43474B] text-white p-4">
            <div className="mb-6 w-full max-w-xs">
                <div className="bg-[#596063] p-4 shadow-lg rounded-lg">
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
                                    disabled={isFlipping}
                                    className="bg-transparent text-[#5A4F4F] text-xl font-bold text-center w-28 outline-none"
                                    aria-label="Bet amount"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between mb-4">
                        <button
                            className={`bg-[#A2A2A2] text-[#5A4F4F] px-4 py-2 rounded-md font-bold w-24 shadow-md ${
                                !isFlipping
                                    ? "hover:bg-gray-500"
                                    : "opacity-50 cursor-not-allowed"
                            }`}
                            onClick={handleHalfBet}
                            disabled={isFlipping}
                        >
                            0.5x
                        </button>
                        <button
                            className={`bg-[#A2A2A2] text-[#5A4F4F] px-4 py-2 rounded-md font-bold w-24 shadow-md ${
                                !isFlipping
                                    ? "hover:bg-gray-500"
                                    : "opacity-50 cursor-not-allowed"
                            }`}
                            onClick={handleDoubleBet}
                            disabled={isFlipping}
                        >
                            2x
                        </button>
                    </div>

                    <button
                        className={`bg-[#409253] text-[#23522E] w-full py-3 rounded-md font-bold text-xl shadow-md ${
                            !isFlipping &&
                            parseFloat(betAmount) > 0 &&
                            parseFloat(betAmount) <= user.balance
                                ? "hover:bg-green-600"
                                : "opacity-50 cursor-not-allowed"
                        }`}
                        onClick={flipCoin}
                        disabled={
                            isFlipping ||
                            parseFloat(betAmount) <= 0 ||
                            parseFloat(betAmount) > user.balance
                        }
                    >
                        {isFlipping ? "FLIPPING..." : "FLIP"}
                    </button>
                </div>
            </div>
            <div className="flex justify-between w-[80%] max-w-64">
                <button
                    onClick={() => setSelectedSide("Heads")}
                    disabled={isFlipping}
                    className={`px-4 py-2 rounded font-bold ${
                        selectedSide === "Heads"
                            ? "bg-[#409253] text-[#23522E]"
                            : "bg-[#737981] text-[#5A4F4F]"
                    }`}
                >
                    Heads
                </button>
                <button
                    onClick={() => setSelectedSide("Tails")}
                    disabled={isFlipping}
                    className={`px-4 py-2 rounded font-bold ${
                        selectedSide === "Tails"
                            ? "bg-[#409253] text-[#23522E]"
                            : "bg-[#737981] text-[#5A4F4F]"
                    }`}
                >
                    Tails
                </button>
            </div>

            <div className="mt-6 relative">
                <div
                    className="w-32 h-32 sm:w-48 sm:h-48 md:h-64 md:w-64 border-4 border-[#8b741b] text-[#8b741b] rounded-full flex items-center justify-center text-8xl font-[800] bg-[#b99f57] shadow-lg"
                >
                    {isFlipping ? (
                        flipLetter
                    ) : lastResult ? (
                        lastResult === "Heads" ? (
                            "H"
                        ) : (
                            "T"
                        )
                    ) : (
                        <span className="text-4xl sm:text-5xl md:text-6xl">Ready</span>
                    )}
                </div>
                {lastResult && !isFlipping && (
                    <div className="mt-4 text-center">
                        <span
                            className={`font-bold text-xl ${
                                won ? "text-green-400" : "text-red-400"
                            }`}
                        >
                            {won ? "You Won!" : "You Lost!"}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};