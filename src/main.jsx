import { createContext, StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

export const MockUserCtx = createContext();

const AppWrapper = () => {
    const [user, setUser] = useState({balance: 10})
    return (
        <MockUserCtx.Provider value={{user, setUser}}>
            <App />
        </MockUserCtx.Provider>
    );
};

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AppWrapper />
    </StrictMode>
);
