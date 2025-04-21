import React, { useState, useEffect, useContext, useMemo } from "react";
import { MockUserCtx } from "./main";

export const Mines = () => {
    const { user, setUser } = useContext(MockUserCtx);
    const [grid, setGrid] = useState([]);
    const [revealed, setRevealed] = useState([]);
    const [mines, setMines] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [rawBetInput, setRawBetInput] = useState("1.00");
    const [betAmount, setBetAmount] = useState("1.00");
    const [won, setWon] = useState(false);
    const [gameState, setGameState] = useState("betting");
    const [totalMines, setTotalMines] = useState(5);
    const [multiplier, setMultiplier] = useState(1);

    const size = 5;
    const maxMines = 24;

    // CALCULATE PAYOUTS
    const payoutTable = useMemo(() => {
        const NUMBER_OF_TILES = 25;
        const HOUSE_EDGE = 0.99;

        const roundToTwo = (num) => Math.round(num * 100) / 100;
        const payoutObject = {};

        for (let diamonds = 1; diamonds < NUMBER_OF_TILES; diamonds++) {
            for (let mines = 1; mines < NUMBER_OF_TILES - diamonds + 1; mines++) {
                let probability = 1;
                for (let k = 0; k < diamonds; k++) {
                    probability *= (NUMBER_OF_TILES - mines - k) / (NUMBER_OF_TILES - k);
                }
                const payout = roundToTwo(HOUSE_EDGE / probability);
                if (!payoutObject[diamonds]) payoutObject[diamonds] = {};
                payoutObject[diamonds][mines] = payout;
            }
        }

        return payoutObject;
    }, []);

    useEffect(() => {
        initGrid();
    }, []);

    useEffect(() => {
        if (gameState !== "playing" || revealed.length === 0) {
            setMultiplier(1);
        }
    }, [gameState]);

    const updateMultiplier = () => {
        const diamonds = revealed.length + 1;
        const mines = totalMines;

        if (diamonds === 0) {
            setMultiplier(1);
            return;
        }

        const payout = payoutTable[diamonds]?.[mines];
        if (payout) {
            setMultiplier(payout.toFixed(2));
        } else {
            setMultiplier(1);
        }
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

    const handleMinesChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setTotalMines(value);
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

    const initGrid = () => {
        const newGrid = Array(size * size).fill(null);
        setGrid(newGrid);
        setRevealed([]);
        setGameOver(false);
        setWon(false);
    };

    const initGame = () => {
        const newGrid = Array(size * size).fill(null);
        const newMines = [];

        while (newMines.length < totalMines) {
            const idx = Math.floor(Math.random() * newGrid.length);
            if (!newMines.includes(idx)) newMines.push(idx);
        }

        setGrid(newGrid);
        setMines(newMines);
        setRevealed([]);
        setGameOver(false);
        setWon(false);
        setGameState("playing");
    };

    const reveal = (i) => {
        if (gameOver || revealed.includes(i) || gameState !== "playing") return;

        if (mines.includes(i)) {
            setRevealed((r) => [...r, i]);
            setGameOver(true);
            setGameState("betting");
        } else {
            const newRevealed = [...revealed, i];
            setRevealed(newRevealed);
            setTimeout(() => updateMultiplier(), 0);

            if (newRevealed.length === grid.length - totalMines) {
                setWon(true);
                setGameOver(true);
                setGameState("betting");
                setUser((u) => ({
                    ...u,
                    balance: u.balance + parseFloat(betAmount) * parseFloat(multiplier),
                }));
            }
        }
    };

    const startGame = () => {
        if (parseFloat(betAmount) <= 0 || parseFloat(betAmount) > user.balance) return;

        const newBal = user.balance - parseFloat(betAmount);

        setUser((user) => ({
            ...user,
            balance: newBal,
        }));

        initGame();
    };

    const cashout = () => {
        if (gameState !== "playing" || revealed.length === 0) return;

        const winnings = parseFloat(betAmount) * parseFloat(multiplier);
        setUser((u) => ({
            ...u,
            balance: u.balance + winnings,
        }));

        setWon(true);
        setGameOver(true);
        setGameState("betting");
    };

    const mineOptions = [];
    for (let i = 1; i <= maxMines; i++) {
        mineOptions.push(
            <option key={i} value={i}>
                {i} {i === 1 ? "Mine" : "Mines"}
            </option>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#43474B] text-white p-4">
            <div className="mb-6 w-full max-w-xs">
                <div className="bg-[#596063] p-4 shadow-lg rounded-lg">
                    <div className="mb-4">
                        <div className="bg-[#A2A2A2] p-3 rounded-md text-center shadow-md">
                            <div className="flex items-center justify-center">
                                <span className="text-[#5A4F4F] text-xl font-bold">$</span>
                                <input
                                    type="text"
                                    value={rawBetInput}
                                    onChange={handleBetChange}
                                    onBlur={handleBlur}
                                    onFocus={handleFocus}
                                    onKeyDown={handleKeyDown}
                                    disabled={gameState !== "betting"}
                                    className="bg-transparent text-[#5A4F4F] text-xl font-bold text-center w-28 outline-none"
                                    aria-label="Bet amount"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="bg-[#A2A2A2] p-3 rounded-md shadow-md">
                            <select
                                value={totalMines}
                                onChange={handleMinesChange}
                                disabled={gameState !== "betting"}
                                className="w-full bg-transparent text-[#5A4F4F] text-lg font-bold text-center appearance-none outline-none cursor-pointer"
                                aria-label="Number of mines"
                            >
                                {mineOptions}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-between mb-4">
                        <button
                            className={`bg-[#A2A2A2] text-[#5A4F4F] px-4 py-2 rounded-md font-bold w-24 shadow-md ${
                                gameState === "betting" ? "hover:bg-gray-500" : "opacity-50 cursor-not-allowed"
                            }`}
                            onClick={handleHalfBet}
                            disabled={gameState !== "betting"}
                        >
                            0.5x
                        </button>
                        <button
                            className={`bg-[#A2A2A2] text-[#5A4F4F] px-4 py-2 rounded-md font-bold w-24 shadow-md ${
                                gameState === "betting" ? "hover:bg-gray-500" : "opacity-50 cursor-not-allowed"
                            }`}
                            onClick={handleDoubleBet}
                            disabled={gameState !== "betting"}
                        >
                            2x
                        </button>
                    </div>

                    <div className="mb-4">
                        {gameState === "betting" ? (
                            <button
                                className={`bg-[#409253] text-[#23522E] w-full py-3 rounded-md font-bold text-xl shadow-md ${
                                    parseFloat(betAmount) > 0 && parseFloat(betAmount) <= user.balance
                                        ? "hover:bg-green-600"
                                        : "opacity-50 cursor-not-allowed"
                                }`}
                                onClick={startGame}
                                disabled={parseFloat(betAmount) <= 0 || parseFloat(betAmount) > user.balance}
                            >
                                BET
                            </button>
                        ) : (
                            <button
                                className={`bg-[#C89B3C] text-[#735A28] w-full py-3 rounded-md font-bold text-xl shadow-md ${
                                    revealed.length > 0 ? "hover:bg-yellow-600" : "opacity-50 cursor-not-allowed"
                                }`}
                                onClick={cashout}
                                disabled={revealed.length === 0}
                            >
                                CASHOUT ({multiplier}x)
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-1 sm:gap-2">
                {grid.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => reveal(i)}
                        className={`w-9 h-9 sm:w-12 sm:h-12 md:w-20 md:h-20 flex items-center justify-center text-lg rounded shadow hover:scale-105 ${
                            revealed.includes(i)
                                ? mines.includes(i)
                                    ? "bg-[#C04747]"
                                    : "bg-[#409253]"
                                : "bg-[#737981]"
                        } ${
                            gameState !== "playing" ? "cursor-not-allowed opacity-90" : ""
                        }`}
                        disabled={gameState !== "playing"}
                    >
                        {revealed.includes(i) && mines.includes(i) ? "💣" : revealed.includes(i) ? "💎" : ""}
                    </button>
                ))}
            </div>
        </div>
    );
};
