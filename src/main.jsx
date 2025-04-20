import { createContext, StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // Ensure you're using 'react-router-dom'
import { Homepage } from "./Homepage.jsx";
import "./index.css";
import App from "./App.jsx";
import { Blackjack } from "./BJ.jsx";

// Create the context
export const MockUserCtx = createContext();

// Define a component that provides the context
const AppWithUserContext = () => {
    const [user, setUser] = useState({ balance: 10 });

    return (
        <MockUserCtx.Provider value={{ user, setUser }}>
            <App />
        </MockUserCtx.Provider>
    );
};

// Configure the router
const router = createBrowserRouter([
    {
        path: "/",
        element: <AppWithUserContext />, // Use 'element' instead of 'Component'
        children: [
            {
                path: "/",
                element: <Homepage />, // Use 'element' here as well
            },
            {
                path: "/bj",
                element: <Blackjack />
            }
        ],
    },
]);

// Define the AppWrapper component
const AppWrapper = () => {
    return <RouterProvider router={router} />;
};

// Render the application
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AppWrapper />
    </StrictMode>
);
