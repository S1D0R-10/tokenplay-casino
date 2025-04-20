export const Footer = () => {
    return (
        <footer className="bg-[#596063] p-3 shadow-[0px_-9px_19px_10px_rgba(0,_0,_0,_0.1)]">
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
                <img
                    src="/assets/begambleaware-vector-logo.svg"
                    style={{height: "40px", aspectRatio: 5 / 1, objectFit: "cover"}}
                />
            </div>
        </footer>
    );
};
