import * as deck from "@letele/playing-cards";
import { useState, useEffect } from "react";

export const Blackjack = () => {
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [gameState, setGameState] = useState({});
    const Card = ({ f }) => {
        const Fn = deck[f];

        return (
            <div className="card-container relative -ml-4 -mt-5">
                <Fn className="h-[15vh] md:h-[20vh] w-auto drop-shadow-lg" />
            </div>
        );
    };

    return (
        <div className="flex flex-col md:flex-row bg-[#43474B] justify-center items-center w-full h-screen">
            <div className="flex-grow w-full md:w-1/2"></div>
            <div className="flex flex-col items-center justify-start flex-grow gap-5 py-20 bg-[#596063] w-full md:w-[35vw] rounded-lg h-full min-h-fit">
                <div className="flex flex-row flex-wrap px-4 pl-8 py-2 max-w-full justify-center">
                    <Card f="Ha" />
                    <Card f="Hq" />
                    <Card f="Hq" />
                    <Card f="Ha" />
                    <Card f="Hq" />
                    <Card f="Hq" />
                </div>
                <p className="text-center p-3">
                    Dealer hits to all 16 and stays to all 17
                </p>
                <div className="flex flex-row flex-wrap px-4 pl-8 py-2 max-w-full justify-center">
                    <Card f="Ha" />
                    <Card f="Hq" />
                    <Card f="Hq" /> <Card f="Ha" />
                    <Card f="Hq" />
                    <Card f="Hq" />
                </div>
            </div>
            <div className="flex-grow h-[40vh]">d</div>
        </div>
    );
};
