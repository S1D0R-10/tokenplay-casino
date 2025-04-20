import { useContext, useState } from "react";
import { Menu, X } from "lucide-react";
import { MockUserCtx } from "./main";

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isWalletOpen, setIsWalletOpen] = useState(false);
    const { user } = useContext(MockUserCtx);
    return (
        <>
            <header className="bg-[#596063] p-3 flex justify-between items-center px-2 sm:px-[15%] shadow-[0px_9px_19px_10px_rgba(0,_0,_0,_0.1)] z-100">
                <div className="h-9 w-[40%] sm:w-full flex justify-start sm:justify-end">
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
                        <span className="mr-1 font-bold">{`$${user.balance.toFixed(
                            2
                        )}`}</span>
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
                <div className="absolute right-0 top-14 bg-gray-800 w-48 shadow-lg rounded-l-sm z-100">
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
        </>
    );
};
