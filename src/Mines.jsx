import React, { useState, useEffect, useContext } from "react";
import { MockUserCtx } from "./main";

export const Mines = () => {
    const { user, setUser } = useContext(MockUserCtx);
    const [grid, setGrid] = useState([]);
    const [revealed, setRevealed] = useState([]);
    const [mines, setMines] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [bet, setBet] = useState(1);
    const [won, setWon] = useState(false);

    const size = 5;
    const totalMines = 5;

    useEffect(() => {
        initGame();
    }, []);

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
    };

    const reveal = (i) => {
        if (gameOver || revealed.includes(i)) return;

        if (mines.includes(i)) {
            setRevealed((r) => [...r, i]);
            setGameOver(true);
        } else {
            const newRevealed = [...revealed, i];
            setRevealed(newRevealed);
            if (newRevealed.length === grid.length - totalMines) {
                setWon(true);
                setGameOver(true);
                setUser((u) => ({
                    ...u,
                    balance: u.balance + bet * 3, 
                }));
            }
        }
    };

    const handleStart = () => {
        if (user.balance < bet) return alert("Insufficient balance");
        setUser((u) => ({ ...u, balance: u.balance - bet }));
        initGame();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#43474B] text-white px-4">
            <h1 className="text-2xl font-bold mb-4">Mines</h1>
            <div className="mb-2 text-lg">
                Balance: ${user.balance.toFixed(2)}
            </div>
            <div className="mb-4">
                <input
                    type="number"
                    min="1"
                    max={user.balance}
                    value={bet}
                    onChange={(e) => setBet(parseFloat(e.target.value))}
                    className="px-2 py-1 text-black rounded"
                />
                <button
                    onClick={handleStart}
                    className="ml-2 bg-teal-600 hover:bg-teal-700 px-3 py-1 rounded"
                >
                    Start
                </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
                {grid.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => reveal(i)}
                        className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-lg rounded shadow ${
                            revealed.includes(i)
                                ? mines.includes(i)
                                    ? "bg-red-600"
                                    : "bg-green-600"
                                : "bg-gray-400"
                        }`}
                    >
                        {revealed.includes(i) && mines.includes(i) ? "💣" : revealed.includes(i) ? "💎" : ""}
                    </button>
                ))}
            </div>
            {gameOver && (
                <div className="mt-4 text-xl font-bold">
                    {won ? "YOU WIN! 💰" : "BOOM! YOU LOST 💥"}
                </div>
            )}
        </div>
    );
};
