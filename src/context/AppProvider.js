import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { URL } from "../api/axios";

export const Context = createContext();

export const AppContext = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [imgUrl, setImgUrl] = useState();
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
    useEffect(() => {
        setSocket(io(URL));
    }, []);
    return (
        <Context.Provider
            value={{
                auth,
                setAuth,
                imgUrl,
                setImgUrl,
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
