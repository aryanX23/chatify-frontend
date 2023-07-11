import { createContext, useState } from "react";

export const Context = createContext();

export const AppContext = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [imgUrl, setImgUrl] = useState();
    const [rightPaneStyle, setRightPaneStyle] = useState({
        transform: `translateX(0%)`,
    });
    console.log(rightPaneStyle);
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
                imgUrl,
                setImgUrl,
                rightPaneStyle,
                rightPaneToggle,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export default AppContext;
