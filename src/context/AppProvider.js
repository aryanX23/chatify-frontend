import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

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
        setSocket(io("http://192.168.12.1:8000/"));
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
