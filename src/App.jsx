import { Footer } from "./Footer";
import { Header } from "./Header";
import { Outlet, useLocation } from "react-router";

const TokenPlayHomepage = () => {
    const location = useLocation();
    return (
        <div className="flex flex-col min-h-screen bg-[#737981] text-white">
            <Header />

            {/* Make sure this fills all space between Header and Footer */}
            <main className="flex flex-col flex-grow">
                <div className="flex flex-col flex-grow w-full max-w-7xl mx-auto px-5 sm:px-20 py-0">
                    <div className=" bg-[#43474B]">
                        <h1 className="text-center text-5xl text-white py-6">
                            {location.pathname === "/"
                                ? "Homepage"
                                : location.pathname.substring(1)}
                        </h1>
                        <Outlet />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TokenPlayHomepage;
