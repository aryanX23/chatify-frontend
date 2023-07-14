import { createContext, useState } from "react";

export const Context = createContext();

export const AppContext = ({ children }) => {
    const [auth, setAuth] = useState("");
    const [rightPaneStyle, setRightPaneStyle] = useState({
        transform: `translateX(100%)`,
    });
    const [socket, setSocket] = useState(null);
    const rightPaneToggle = () => {
        setRightPaneStyle((prevValue) => ({
            transform:
                prevValue.transform === `translateX(0%)`
                    ? `translateX(100%)`
                    : `translateX(0%)`,
        }));
    };
    return (
        <Context.Provider
            value={{
                auth,
                setAuth,
                rightPaneStyle,
                rightPaneToggle,
                socket,
                setSocket,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export default AppContext;
