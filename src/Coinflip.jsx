import { useContext, useState } from "react";
import { MockUserCtx } from "./main";

const outcomes = ["Heads", "Tails"];

export const Coinflip = () => {
    const { user, setUser } = useContext(MockUserCtx);
    const [selectedSide, setSelectedSide] = useState("Heads");
    const [betAmount, setBetAmount] = useState(1);
    const [isFlipping, setIsFlipping] = useState(false);
    const [history, setHistory] = useState([]);
    const [result, setResult] = useState(null);

    const flipCoin = () => {
        if (betAmount <= 0 || betAmount > user.balance) return;

        setIsFlipping(true);
        setResult(null);

        const timeout = setTimeout(() => {
            const outcome = outcomes[Math.floor(Math.random() * 2)];
            setHistory(prev => [outcome, ...prev.slice(0, 9)]);
            setResult(outcome);

            if (outcome === selectedSide) {
                setUser({ balance: user.balance + betAmount });
            } else {
                setUser({ balance: user.balance - betAmount });
            }

            setIsFlipping(false);
            clearTimeout(timeout);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-700 text-white flex items-center justify-center p-6">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-4xl flex gap-6">
                {/* Left side: Coinflip */}
                <div className="flex-1 flex flex-col items-center gap-4">
                    <h1 className="text-3xl font-bold">Coinflip</h1>
                    <div className={`w-32 h-32 border-4 border-gray-600 rounded-full flex items-center justify-center text-2xl font-semibold bg-gray-900 ${isFlipping ? 'animate-spin-slow' : ''}`}>
                        {isFlipping ? '?' : result ?? 'Ready'}
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button onClick={() => setSelectedSide("Heads")} className={`px-4 py-2 rounded ${selectedSide === 'Heads' ? 'bg-blue-600 text-white' : 'bg-gray-400 text-black'}`}>Heads</button>
                        <button onClick={() => setSelectedSide("Tails")} className={`px-4 py-2 rounded ${selectedSide === 'Tails' ? 'bg-blue-600 text-white' : 'bg-gray-400 text-black'}`}>Tails</button>
                    </div>

                    <input
                        type="number"
                        value={betAmount}
                        min="1"
                        max={user.balance}
                        onChange={(e) => setBetAmount(Number(e.target.value))}
                        className="border border-gray-500 p-2 rounded w-32 text-center bg-gray-900 text-white"
                    />

                    <button onClick={flipCoin} disabled={isFlipping || betAmount > user.balance} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50">
                        {isFlipping ? 'Flipping...' : 'Play'}
                    </button>
                </div>

                {/* Right side: Balance and History */}
                <div className="w-1/3 flex flex-col gap-4">
                    <div className="bg-gray-900 p-4 rounded">
                        <h2 className="text-lg font-semibold">Balance</h2>
                        <p className="text-2xl font-bold mt-2">${user.balance.toFixed(2)}</p>
                    </div>

                    <div className="bg-gray-900 p-4 rounded">
                        <h2 className="text-lg font-semibold mb-2">History</h2>
                        {history.length === 0 ? (
                            <p className="text-sm text-gray-400">No game history yet</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {history.map((outcome, index) => (
                                    <div key={index} className={`p-2 rounded text-center text-sm font-medium ${outcome === 'Heads' ? 'bg-blue-500' : 'bg-red-500'}`}>
                                        {outcome}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};