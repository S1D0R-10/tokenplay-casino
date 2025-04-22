import React, { useState, useEffect, useContext, useMemo } from "react";
import { MockUserCtx } from "./main";

export const Tower = () => {
    const { user, setUser } = useContext(MockUserCtx);
    const [rawBetInput, setRawBetInput] = useState("1.00");
    const [betAmount, setBetAmount] = useState("1.00");
    const [gameState, setGameState] = useState("betting");
    const [towerHeight, setTowerHeight] = useState(5);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [selectedTiles, setSelectedTiles] = useState([]);
    const [safeTiles, setSafeTiles] = useState([]);
    
    
    const maxHeight = 10;
    const tilesPerRow = 3;
    
    
    const payoutTable = useMemo(() => {
        const HOUSE_EDGE = 0.97;
        const payoutObject = {};
        
        for (let height = 1; height <= maxHeight; height++) {
            payoutObject[height] = {};
            for (let level = 1; level <= height; level++) {
                
                
                
                
                
                let probability = 1;
                for (let l = 1; l <= level; l++) {
                    probability *= 2/3; 
                }
                
                const payout = Math.round(HOUSE_EDGE / probability * 100) / 100;
                payoutObject[height][level] = payout;
            }
        }
        
        return payoutObject;
    }, []);
    
    useEffect(() => {
        resetGame();
    }, []);
    
    useEffect(() => {
        if (gameState === "playing" && currentLevel > 0) {
            updateMultiplier();
        } else if (gameState !== "playing") {
            setMultiplier(1);
        }
    }, [gameState, currentLevel]);
    
    const updateMultiplier = () => {
        const level = currentLevel;
        const height = towerHeight;
        
        if (level === 0) {
            setMultiplier(1);
            return;
        }
        
        const payout = payoutTable[height]?.[level];
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
    
    const handleHeightChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setTowerHeight(value);
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
    
    const resetGame = () => {
        setCurrentLevel(0);
        setGameOver(false);
        setWon(false);
        setSelectedTiles([]);
        setSafeTiles([]);
        setGameState("betting");
        setMultiplier(1);
    };
    
    const initGame = () => {
        const newSafeTiles = [];
        
        
        for (let level = 0; level < towerHeight; level++) {
            const levelSafeTiles = [];
            
            
            while (levelSafeTiles.length < 2) {
                const tileIndex = Math.floor(Math.random() * tilesPerRow);
                if (!levelSafeTiles.includes(tileIndex)) {
                    levelSafeTiles.push(tileIndex);
                }
            }
            
            
            newSafeTiles.push(levelSafeTiles);
        }
        
        setSafeTiles(newSafeTiles);
        setCurrentLevel(0);
        setSelectedTiles([]);
        setGameOver(false);
        setWon(false);
        setGameState("playing");
    };
    
    const selectTile = (level, tileIndex) => {
        if (gameOver || gameState !== "playing" || level !== currentLevel) return;
        
        
        const isSafe = safeTiles[level].includes(tileIndex);
        const newSelectedTiles = [...selectedTiles, { level, tileIndex, isSafe }];
        setSelectedTiles(newSelectedTiles);
        
        if (isSafe) {
            
            const newLevel = currentLevel + 1;
            setCurrentLevel(newLevel);
            
            
            if (newLevel >= towerHeight) {
                setWon(true);
                setGameOver(true);
                setGameState("betting");
                
                
                setUser((u) => ({
                    ...u,
                    balance: u.balance + parseFloat(betAmount) * parseFloat(multiplier),
                }));
            }
        } else {
            
            setGameOver(true);
            setGameState("betting");
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
        if (gameState !== "playing" || currentLevel === 0) return;
        
        const winnings = parseFloat(betAmount) * parseFloat(multiplier);
        setUser((u) => ({
            ...u,
            balance: u.balance + winnings,
        }));
        
        setWon(true);
        setGameOver(true);
        setGameState("betting");
    };
    
    const heightOptions = [];
    for (let i = 1; i <= maxHeight; i++) {
        heightOptions.push(
            <option key={i} value={i}>
                {i} {i === 1 ? "Level" : "Levels"}
            </option>
        );
    }
    
    
    const renderTower = () => {
        const rows = [];
        
        for (let level = towerHeight - 1; level >= 0; level--) {
            const isCurrentLevel = level === currentLevel;
            const isPastLevel = level < currentLevel;
            
            
            const selectedTile = selectedTiles.find(t => t.level === level);
            
            const row = (
                <div 
                    key={level} 
                    className={`flex justify-center gap-2 mb-2 ${isCurrentLevel ? "animate-pulse" : ""}`}
                >
                    {Array.from({ length: tilesPerRow }).map((_, tileIndex) => {
                        
                        const isSelected = selectedTile && selectedTile.tileIndex === tileIndex;
                        const showRevealed = isPastLevel || (isSelected && gameOver);
                        const isSafe = safeTiles[level]?.includes(tileIndex);
                        
                        let tileClass = "w-16 h-16 flex items-center justify-center rounded-md shadow-md transition-all";
                        
                        if (showRevealed) {
                            
                            tileClass += isSelected && !isSafe 
                                ? " bg-[#C04747]" 
                                : " bg-[#409253]"; 
                        } else if (isCurrentLevel) {
                            
                            tileClass += " bg-[#A2A2A2] hover:bg-gray-400 hover:scale-105 cursor-pointer";
                        } else {
                            
                            tileClass += " bg-[#737981] opacity-70";
                        }
                        
                        return (
                            <button
                                key={tileIndex}
                                onClick={() => selectTile(level, tileIndex)}
                                className={tileClass}
                                disabled={!isCurrentLevel || gameState !== "playing"}
                            >
                                {showRevealed && (
                                    <span className="text-xl">
                                        {isSafe ? "💎" : "🔥"}
                                    </span>
                                )}
                                {isCurrentLevel && !showRevealed && (
                                    <span className="text-[#5A4F4F] text-xl font-bold">?</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            );
            
            rows.push(row);
        }
        
        return rows;
    };
    
    return (
        <div className="flex flex-col items-center justify-center bg-[#43474B] text-white p-4">
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
                                value={towerHeight}
                                onChange={handleHeightChange}
                                disabled={gameState !== "betting"}
                                className="w-full bg-transparent text-[#5A4F4F] text-lg font-bold text-center appearance-none outline-none cursor-pointer"
                                aria-label="Tower height"
                            >
                                {heightOptions}
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
                                    currentLevel > 0 ? "hover:bg-yellow-600" : "opacity-50 cursor-not-allowed"
                                }`}
                                onClick={cashout}
                                disabled={currentLevel === 0}
                            >
                                CASHOUT ({multiplier}x)
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="my-4">
                {gameOver && won && (
                    <div className="text-xl font-bold text-green-400 mb-4 text-center">
                        You Won ${(parseFloat(betAmount) * parseFloat(multiplier)).toFixed(2)}!
                    </div>
                )}
                {gameOver && !won && (
                    <div className="text-xl font-bold text-red-400 mb-4 text-center">
                        Game Over!
                    </div>
                )}
                {!gameOver && gameState === "playing" && (
                    <div className="text-lg text-yellow-300 mb-4 text-center">
                        Level {currentLevel + 1} of {towerHeight} - Current Multiplier: {multiplier}x
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center justify-center mb-4">
                {renderTower()}
            </div>

            <div className="mt-4 max-w-md text-center text-sm text-gray-300">
                <p>Choose a safe path up the tower to increase your multiplier. Each level has 2 safe tiles and 1 trap. Cash out anytime to secure your winnings!</p>
            </div>
        </div>
    );
};
