import React, { useState, useEffect, useContext } from "react";
import * as deck from "@letele/playing-cards";

import { MockUserCtx } from "./main";

export const Blackjack = () => {
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const { user, setUser } = useContext(MockUserCtx);
    const [currentDeck, setCurrentDeck] = useState([]);

    const [gameState, setGameState] = useState("betting"); // betting, playing, dealer, result
    const [betAmount, setBetAmount_] = useState("10.00");
    const [canDouble, setCanDouble] = useState(false);
    const [canHit, setCanHit] = useState(false);
    const [canStand, setCanStand] = useState(false);
    const [result, setResult] = useState("");
    const [playerScore, setPlayerScore] = useState(0);
    const [dealerScore, setDealerScore] = useState(0);

    // Create a deck of cards
    const createDeck = () => {
        const suits = ["S", "H", "D", "C"]; // Spades, Hearts, Diamonds, Clubs
        const ranks = [
            "a",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "j",
            "q",
            "k",
        ];
        const deck = [];

        for (
            let i = 0;
            i < 8;
            i++ // 8 deck shoe
        )
            for (const suit of suits) {
                for (const rank of ranks) {
                    deck.push({ id: `${suit}${rank}` });
                }
            }

        return shuffle(deck);
    };

    // Shuffle the deck
    const shuffle = (deck) => {
        const newDeck = [...deck];
        for (let i = newDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
        }
        return newDeck;
    };

    // Calculate hand value
    const calculateHandValue = (hand) => {
        let value = 0;
        let aces = 0;

        for (const card of hand) {
            if (!card || !card.id) continue; // Skip invalid cards

            const rank = card.id.substr(1);
            if (rank === "a") {
                aces += 1;
                value += 11;
            } else if (["j", "q", "k"].includes(rank)) {
                value += 10;
            } else {
                value += parseInt(rank);
            }
        }

        // Adjust for aces
        while (value > 21 && aces > 0) {
            value -= 10;
            aces -= 1;
        }

        return value;
    };

    // Format to two decimal places
    const formatToTwoDecimalPlaces = (value) => {
        const floatValue = parseFloat(value) || 0;
        return floatValue.toFixed(2);
    };

    // Set bet amount with validation
    const setBetAmount = (amt) => {
        setBetAmount_(formatToTwoDecimalPlaces(Math.min(amt, user.balance)));
    };

    // Handle bet input change
    const handleBetChange = (e) => {
        const value = e.target.value.replace(/[^0-9.]/g, "");
        setBetAmount(value);
    };

    // Handle input blur
    const handleBlur = () => {
        setBetAmount(betAmount);
    };

    // Handle input focus
    const handleFocus = (e) => {
        const input = e.target;
        setTimeout(() => {
            input.selectionStart = 1;
            input.selectionEnd = input.value.length;
        }, 0);
    };

    // Handle key down
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.target.blur();
        }
    };

    // Half bet
    const handleHalfBet = () => {
        const currentValue = parseFloat(betAmount) || 0;
        const halvedValue = Math.max(currentValue * 0.5, 0.01);
        setBetAmount(halvedValue);
    };

    // Double bet
    const handleDoubleBet = () => {
        const currentValue = parseFloat(betAmount) || 0;
        const doubledValue = Math.min(currentValue * 2, user.balance);
        setBetAmount(doubledValue);
    };

    // Draw a card from the deck
    const drawCard = () => {
        // Make sure we have cards left
        if (currentDeck.length === 0) {
            setCurrentDeck(createDeck());
            return drawCard();
        }

        const newDeck = [...currentDeck];
        const card = newDeck.pop();
        setCurrentDeck(newDeck);
        return card;
    };

    // Start a new game
    const startGame = () => {
        const newDeck = createDeck();

        const newBal = user.balance - parseFloat(betAmount);

        setUser((user) => ({
            ...user,
            balance: newBal,
        }));

        setCurrentDeck(newDeck);
        setPlayerHand([]);
        setDealerHand([]);

        // Deal initial cards
        const pHand = [newDeck.pop(), newDeck.pop()];
        const dHand = [newDeck.pop(), { id: "B1" }]; // Second dealer card is face down

        setCurrentDeck(newDeck.slice(0, newDeck.length - 3)); // Remove the drawn cards
        setPlayerHand(pHand);
        setDealerHand(dHand);
        setGameState("playing");
        setCanHit(true);
        setCanStand(true);
        setResult(""); // Clear any previous result

        const cd = newBal >= parseFloat(betAmount);
        setCanDouble(cd);

        // Calculate scores
        setPlayerScore(calculateHandValue(pHand));
        setDealerScore(calculateHandValue([dHand[0]])); // Only count visible card

        // Check for blackjack
        const playerVal = calculateHandValue(pHand);

        if (playerVal === 21) {
            // Player has blackjack
            const dealerHoleCard = newDeck.pop();
            const fullDealerHand = [dHand[0], dealerHoleCard];
            const dealerVal = calculateHandValue(fullDealerHand);

            setDealerHand(fullDealerHand);
            setDealerScore(dealerVal);

            if (dealerVal === 21) {
                // Push: Both player and dealer have blackjack
                setResult("Push - both have Blackjack");
                setUser((u) => ({
                    ...u,
                    balance: u.balance + parseFloat(betAmount),
                }));
            } else {
                // Player wins with blackjack
                setResult("Blackjack! Player wins");
                setUser((u) => ({
                    ...u,
                    balance: u.balance + 2.5 * parseFloat(betAmount),
                }));
            }

            finishGame();
            return;
        }
    };

    // Player hits
    const playerHit = () => {
        const card = drawCard();
        const newHand = [...playerHand, card];

        setPlayerHand(newHand);
        setCanDouble(false);

        const newScore = calculateHandValue(newHand);
        setPlayerScore(newScore);

        if (newScore >= 21) {
            setCanHit(false);
            setCanStand(false);
            dealerPlay(newHand);
        }
    };

    // Player stands
    const playerStand = () => {
        setCanHit(false);
        setCanDouble(false);
        setCanStand(false);

        dealerPlay(playerHand);
    };

    // Player doubles
    const playerDouble = () => {
        if (!canDouble) return;

        const card = drawCard();
        const newHand = [...playerHand, card];

        const newBal = user.balance - parseFloat(betAmount);

        setUser((user) => ({
            ...user,
            balance: newBal,
        }));

        setBetAmount((ba) => 2 * ba);

        setPlayerHand(newHand);

        const newScore = calculateHandValue(newHand);
        setPlayerScore(newScore);

        setCanHit(false);
        setCanDouble(false);
        setCanStand(false);

        dealerPlay(newHand);
    };

    // Dealer plays
    const dealerPlay = (playerFinalHand) => {
        let deckCopy = [...currentDeck];

        // Reveal dealer's hole card
        const holeCard = deckCopy.pop();
        let fullDealerHand = [dealerHand[0], holeCard];

        let dScore = calculateHandValue(fullDealerHand);
        const pScore = calculateHandValue(playerFinalHand);

        // Player busted
        if (pScore > 21) {
            setDealerHand(fullDealerHand);
            setDealerScore(dScore);
            setResult("Dealer wins");
            finishGame();
            return;
        }

        // Dealer draws until 17 or higher
        while (dScore < 17) {
            const newCard = deckCopy.pop();
            fullDealerHand.push(newCard);
            dScore = calculateHandValue(fullDealerHand);
        }

        // Determine winner
        let resultMsg = "";
        if (dScore > 21 || pScore > dScore) {
            resultMsg = "Player wins";
            setUser((u) => ({
                ...u,
                balance: u.balance + 2 * parseFloat(betAmount),
            }));
        } else if (dScore > pScore) {
            resultMsg = "Dealer wins";
        } else {
            resultMsg = "Push";
            setUser((u) => ({
                ...u,
                balance: u.balance + parseFloat(betAmount),
            }));
        }

        // Update all final states at once
        setCurrentDeck(deckCopy);
        setDealerHand(fullDealerHand);
        setDealerScore(dScore);
        setResult(resultMsg);
        setGameState("betting");
        setCanHit(false);
        setCanStand(false);
        setCanDouble(false);
        setPlayerScore(0);
        setDealerScore(0);
        setBetAmount(0);
    };

    // Finish the game and return to betting state
    const finishGame = () => {
        setGameState("betting");
        setCanHit(false);
        setCanStand(false);
        setCanDouble(false);
        setPlayerScore(0);
        setDealerScore(0);
        setBetAmount(0);
        // Note: keep the result visible for the player to see
    };

    // Card component
    const Card = ({ f }) => {
        // Add safeguard for undefined card IDs
        if (!f) {
            return (
                <div className="card-container relative -ml-4 -mt-5">
                    <div className="h-[15vh] md:h-[20vh] w-auto drop-shadow-lg bg-gray-200 rounded-lg flex items-center justify-center">
                        ?
                    </div>
                </div>
            );
        }

        const Fn = deck[f]; // Get card component from deck

        if (!Fn) {
            // Fallback for invalid card ID
            return (
                <div className="card-container relative -ml-4 -mt-5">
                    <div className="h-[15vh] md:h-[20vh] w-auto drop-shadow-lg bg-gray-200 rounded-lg flex items-center justify-center">
                        {f}
                    </div>
                </div>
            );
        }

        return (
            <div className="card-container relative -ml-4 -mt-5">
                <Fn className="h-[15vh] md:h-[20vh] w-auto drop-shadow-lg" />
            </div>
        );
    };

    return (
        <div className="flex flex-col md:flex-row bg-[#43474B] justify-center items-center w-full h-screen min-h-fit px-0 md:px-20 gap-5">
            <div className="flex-grow w-full md:w-1/2">
                <div className="flex w-full max-w-xs mx-auto flex-col gap-5">
                    <div className="bg-[#596063] p-4 shadow-lg rounded-b-lg md:rounded-t-lg">
                        <div className="mb-4">
                            <div className="bg-[#A2A2A2] p-3 rounded-md text-center shadow-md">
                                <input
                                    type="text"
                                    value={`$${betAmount}`}
                                    onChange={handleBetChange}
                                    onBlur={handleBlur}
                                    onFocus={handleFocus}
                                    onKeyDown={handleKeyDown}
                                    disabled={gameState !== "betting"}
                                    className="bg-transparent text-[#5A4F4F] text-xl font-bold text-center w-32 outline-none overflow-x-visible"
                                    aria-label="Bet amount"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between mb-4">
                            <button
                                className={`bg-[#A2A2A2] text-[#5A4F4F] px-4 py-2 rounded-md font-bold w-24 shadow-md ${
                                    gameState === "betting"
                                        ? "hover:bg-gray-500"
                                        : "opacity-50 cursor-not-allowed"
                                }`}
                                onClick={handleHalfBet}
                                disabled={gameState !== "betting"}
                            >
                                0.5x
                            </button>
                            <button
                                className={`bg-[#A2A2A2] text-[#5A4F4F] px-4 py-2 rounded-md font-bold w-24 shadow-md ${
                                    gameState === "betting"
                                        ? "hover:bg-gray-500"
                                        : "opacity-50 cursor-not-allowed"
                                }`}
                                onClick={handleDoubleBet}
                                disabled={gameState !== "betting"}
                            >
                                2x
                            </button>
                        </div>

                        <div className="mb-4">
                            <button
                                className={`bg-[#409253] text-[#23522E] w-full py-3 rounded-md font-bold text-xl shadow-md ${
                                    gameState === "betting"
                                        ? "hover:bg-green-600"
                                        : "opacity-50 cursor-not-allowed"
                                }`}
                                onClick={startGame}
                                disabled={gameState !== "betting"}
                            >
                                BET
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-4 gap-3 py-1">
                            <button
                                className={`bg-[#A1793D] text-[#614D2F] px-4 py-2 rounded-md font-bold w-full shadow-md ${
                                    canDouble
                                        ? "hover:bg-yellow-700"
                                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                }`}
                                onClick={playerDouble}
                                disabled={!canDouble}
                            >
                                DOUBLE
                            </button>
                        </div>

                        <div className="flex justify-between mb-4 gap-3 py-1">
                            <button
                                className={`bg-[#409253] text-[#23522E] px-4 py-2 rounded-md font-bold w-full shadow-md ${
                                    canHit
                                        ? "hover:bg-green-600"
                                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                }`}
                                onClick={playerHit}
                                disabled={!canHit}
                            >
                                HIT
                            </button>
                            <button
                                className={`bg-[#C04747] text-[#6B3232] px-4 py-2 rounded-md font-bold w-full shadow-md ${
                                    canStand
                                        ? "hover:bg-red-600"
                                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                }`}
                                onClick={playerStand}
                                disabled={!canStand}
                            >
                                STAND
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center flex-grow gap-5 py-20 bg-[#596063] w-full md:w-[35vw] rounded-lg shadow-lg h-[90%] min-h-fit">
                {gameState !== "betting" && dealerScore > 0 && (
                    <p className="text-center p-3 text-[#9aa2a9] font-[800]">
                        Dealer hand: {dealerScore}
                    </p>
                )}
                <div className="flex flex-row flex-wrap px-4 pl-8 py-2 max-w-full justify-center">
                    {dealerHand.map((c, index) => (
                        <Card key={`dealer-${index}`} f={c?.id} />
                    ))}
                </div>

                {/* Central message area */}
                {result ? (
                    <p className="text-center p-3 text-[#9aa2a9] font-[800] text-xl">
                        {result}
                    </p>
                ) : (
                    <p className="text-center p-3 text-[#9aa2a9] font-[800]">
                        Dealer hits to all 16 and stays to all 17
                    </p>
                )}

                <div className="flex flex-row flex-wrap px-4 pl-8 py-2 max-w-full justify-center">
                    {playerHand.map((c, index) => (
                        <Card key={`player-${index}`} f={c?.id} />
                    ))}
                </div>
                {gameState !== "betting" && playerScore > 0 && (
                    <p className="text-center p-3 text-[#9aa2a9] font-[800]">
                        Your hand: {playerScore}
                    </p>
                )}
            </div>
        </div>
    );
};
