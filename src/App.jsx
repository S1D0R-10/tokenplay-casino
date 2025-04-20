import { Footer } from "./Footer";
import { Header } from "./Header";
import { Outlet } from "react-router";

const TokenPlayHomepage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#737981] text-white">
            <Header />

            {/* Make sure this fills all space between Header and Footer */}
            <main className="flex flex-col flex-grow">
                <div className="flex flex-col flex-grow w-full max-w-7xl mx-auto px-5 sm:px-20 py-0">
                    <Outlet />
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default TokenPlayHomepage