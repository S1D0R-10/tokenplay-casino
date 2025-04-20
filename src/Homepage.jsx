import { useNavigate } from "react-router";

export const Homepage = () => {
    const navigate = useNavigate();
    return (
        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 bg-[#43474B]">
            {[
                { src: "../assets/bj-1.svg", alt: "Blackjack", link: "/bj" },
                { src: "../assets/mines-1.svg", alt: "Mines", link: "/mines" },
                { src: "../assets/tower-1.svg", alt: "Tower", link: "/tower" },
                { src: "../assets/wheel-1.svg", alt: "Wheel", link: "/wheel" },
                {
                    src: "../assets/coinflip-1.svg",
                    alt: "Coinflip",
                    link: "/coin",
                },
                { src: "../assets/soon-1.svg", alt: "Coming Soon" },
            ].map((game, index) => (
                <div
                    key={index}
                    className="rounded-lg overflow-visible transition-transform aspect-square flex justify-center items-center"
                >
                    <img
                        src={game.src}
                        alt={game.alt}
                        className="w-3/5 h-3/5 sm:w-4/5 sm:h-4/5 object-contain cursor-pointer transition-transform hover:scale-105 rounded-[9.74%] shadow-[6px_4px_15px_3px_rgba(0,_0,_0,_0.1)]"
                        onClick={() =>
                            game.link ? navigate(game.link) : () => {}
                        }
                    />
                </div>
            ))}
        </div>
    );
};
