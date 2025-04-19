import { useContext, useState } from "react";
import { Menu, X } from "lucide-react";
import { MockUserCtx } from "./main";

export default function TokenPlayHomepage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isWalletOpen, setIsWalletOpen] = useState(false);
    const {user, setUser} = useContext(MockUserCtx);
    return (
        <div className="flex flex-col min-h-screen bg-[#737981] text-white">
            {/* Header */}
            <header className="bg-[#596063] p-3 flex justify-between items-center px-[15%] shadow-[0px_9px_19px_10px_rgba(0,_0,_0,_0.1)] z-100">
                <div className="h-8 w-[33%] sm:w-full flex justify-start sm:justify-end">
                    <img
                        src="../assets/tokenplay-2.svg"
                        alt="TokenPlay Logo"
                        className="h-full"
                    />
                </div>

                {/* Wallet Button */}
                <div className="w-[33%] sm:w-full flex justify-center">
                    <button
                        className="bg-white text-gray-800 rounded px-1 md:px-3 py-1 flex items-center text-xs sm:text-lg w-min-fit"
                        onClick={() => setIsWalletOpen(true)}
                    >
                        <span className="mr-1 font-bold">{`$${user.balance.toFixed(2)}`}</span>
                        <img
                            src="../assets/wallet-2.svg"
                            alt="Wallet"
                            className="w-4 h-4 md:w-7 md:h-7 lg:w-9 lg:h-9"
                        />
                    </button>
                </div>

                {/* Hamburger Menu */}
                <div className="w-[23%] sm:w-full flex justify-end">
                    <button
                        className="text-white ml-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu size={32} />
                    </button>
                </div>
            </header>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className="absolute right-0 top-14 bg-gray-800 w-48 z-10 shadow-lg rounded-l-sm">
                    <div className="p-3 text-sm">
                        <div className="mb-2 pb-2 border-b border-gray-700 hover:text-teal-400 cursor-pointer">
                            ABOUT US
                        </div>
                        <div className="mb-2 pb-2 border-b border-gray-700 hover:text-teal-400 cursor-pointer">
                            LEGAL
                        </div>
                        <div className="mb-2 pb-2 border-b border-gray-700 hover:text-teal-400 cursor-pointer">
                            TERMS & CONDITIONS
                        </div>
                        <div className="mb-2 pb-2 border-b border-gray-700 hover:text-teal-400 cursor-pointer">
                            CONTACT
                        </div>
                        <div className="hover:text-teal-400 cursor-pointer">
                            SELF-EXCLUDE
                        </div>
                    </div>
                </div>
            )}

            {/* Wallet Modal */}
            {isWalletOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                    <div className="bg-gray-800 p-4 rounded-lg w-full max-w-xs">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-bold">Wallet</h2>
                            <button onClick={() => setIsWalletOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="mb-3">
                            <p className="text-sm">Current Balance</p>
                            <p className="text-xl font-bold text-teal-400">
                                $10.00
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-teal-500 text-white py-1 px-3 rounded text-sm flex-1 hover:bg-teal-600">
                                Deposit
                            </button>
                            <button className="bg-gray-600 text-white py-1 px-3 rounded text-sm flex-1 hover:bg-gray-700">
                                Withdraw
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Game Grid - Flex Grow to push footer down */}
            <main className="flex-grow container justify-center w-full items-center content-center bg-[#737981]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-2 w-[80%] bg-[#43474B] mx-auto">
                    {/* Blackjack Game */}
                    <div className="rounded-lg overflow-visible transition-transform aspect-square">
                        <div className="p-2 flex justify-center items-center h-full overflow-visible">
                            <img
                                src="../assets/bj-1.svg"
                                alt="Blackjack"
                                className="w-4/5 h-4/5 object-contain cursor-pointer transition-transform hover:scale-105 overflow-visible rounded-[9.74%] shadow-[6px_4px_15px_3px_rgba(0,_0,_0,_0.1)]"
                            />
                        </div>
                    </div>

                    {/* Mines Game */}
                    <div className="rounded-lg overflow-hidden transition-transform aspect-square">
                        <div className="p-2 flex justify-center items-center h-full">
                            <img
                                src="../assets/mines-1.svg"
                                alt="Mines"
                                className="w-4/5 h-4/5 object-contain cursor-pointer transition-transform hover:scale-105 overflow-visible rounded-[9.74%] shadow-[6px_4px_15px_3px_rgba(0,_0,_0,_0.1)] "
                            />
                        </div>
                    </div>

                    {/* Tower Game */}
                    <div className="rounded-lg overflow-hidden transition-transform aspect-square">
                        <div className="p-2 flex justify-center items-center h-full">
                            <img
                                src="../assets/tower-1.svg"
                                alt="Tower"
                                className="w-4/5 h-4/5 object-contain cursor-pointer transition-transform hover:scale-105 overflow-visible rounded-[9.74%] shadow-[6px_4px_15px_3px_rgba(0,_0,_0,_0.1)] "
                            />
                        </div>
                    </div>

                    {/* Wheel Game */}
                    <div className="rounded-lg overflow-hidden transition-transform aspect-square">
                        <div className="p-2 flex justify-center items-center h-full">
                            <img
                                src="../assets/wheel-1.svg"
                                alt="Wheel"
                                className="w-4/5 h-4/5 object-contain cursor-pointer transition-transform hover:scale-105 overflow-visible rounded-[9.74%] shadow-[6px_4px_15px_3px_rgba(0,_0,_0,_0.1)] "
                            />
                        </div>
                    </div>

                    {/* Coinflip Game */}
                    <div className="rounded-lg overflow-hidden transition-transform aspect-square">
                        <div className="p-2 flex justify-center items-center h-full">
                            <img
                                src="../assets/coinflip-1.svg"
                                alt="Coinflip"
                                className="w-4/5 h-4/5 object-contain cursor-pointer transition-transform hover:scale-105 overflow-visible rounded-[9.74%] shadow-[6px_4px_15px_3px_rgba(0,_0,_0,_0.1)] "
                            />
                        </div>
                    </div>

                    {/* Coming Soon */}
                    <div className="rounded-lg overflow-hidden transition-transform aspect-square">
                        <div className="p-2 flex justify-center items-center h-full">
                            <img
                                src="../assets/soon-1.svg"
                                alt="More Coming Soon"
                                className="w-4/5 h-4/5 object-contain cursor-pointer transition-transform hover:scale-105 overflow-visible rounded-[9.74%] shadow-[6px_4px_15px_3px_rgba(0,_0,_0,_0.1)] "
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer - Now sticks to bottom */}
            <footer className="bg-[#596063] p-3 mt-auto shadow-[0px_-9px_19px_10px_rgba(0,_0,_0,_0.1)]">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-xs font-[600]">
                    <div className="mb-2 md:mb-0">
                        <div className="h-6 mb-1">
                            <img
                                src="../assets/tokenplay-2.svg"
                                alt="TokenPlay Logo"
                                className="h-full"
                            />
                        </div>
                        <div className="text-gray-400">
                            ©TOKENPLAY Casinos Inc., 2025
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 text-gray-300">
                        <span className="hover:text-teal-400 cursor-pointer">
                            ABOUT US
                        </span>
                        <span>|</span>
                        <span className="hover:text-teal-400 cursor-pointer">
                            LEGAL
                        </span>
                        <span>|</span>
                        <span className="hover:text-teal-400 cursor-pointer">
                            TERMS & CONDITIONS
                        </span>
                        <span>|</span>
                        <span className="hover:text-teal-400 cursor-pointer">
                            CONTACT
                        </span>
                        <span>|</span>
                        <span className="hover:text-teal-400 cursor-pointer">
                            SELF-EXCLUDE
                        </span>
                    </div>

                    <div className="mt-2 md:mt-0 text-gray-400">
                        BeGambleAware.org
                    </div>
                </div>
            </footer>
        </div>
    );
}
