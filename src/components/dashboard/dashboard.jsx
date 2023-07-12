import React, { useState, useEffect, useContext } from "react";
import "./dashboard.css";
import { Axios, URL } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Leftpane from "./leftpane/leftpane";
import Rightpane from "./rightpane/rightpane";
import Middlepane from "./middlepane/middlepane";
import { Context } from "../../context/AppProvider";

export default function Dashboard() {
    const { rightPaneStyle, socket, setSocket, setAuth} = useContext(Context);
    const [userDetails, setUserDetails] = useState({
        userId: localStorage.getItem("userId"),
        email: localStorage.getItem("email"),
        fullName: localStorage.getItem("fullName"),
    });
    const [pannelVisibility, setPannelVisibility] = useState("false");
    const [currentChatDetails, setCurrentChatDetails] = useState({
        name: "",
        email: "",
        conversationId: "",
        receiverId: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        Axios({
            method: "post",
            url: URL + "/api/users/checkAuth/",
            data: {
                userId: localStorage.getItem("userId"),
            },
            withCredentials: true,
        })
            .then(function (response) {
                if (!response.data.authenticated) {
                    localStorage.clear();
                    setUserDetails((prev) => ({
                        fullName: "",
                        email: "",
                        userId: "",
                    }));
                    socket?.emit("disconnect");
                    setSocket(null);
                    setAuth(prev => false);
                    navigate("/chatify-frontend/");
                } else {
                    localStorage.setItem("isAuthenticated", true);
                    setAuth((prev) => true);
                }
            })
            .catch(function (response) {
                console.log("Invalid Operation!");
            });
    }, [navigate,socket,setSocket,setAuth]);
    function handleLogout() {
        Axios({
            method: "post",
            url: URL + "/api/users/logOut/",
            data: {
                userId: userDetails.userId,
            },
            withCredentials: true,
        })
            .then(function (response) {
                localStorage.clear();
                setUserDetails((prev) => ({
                    fullName: "",
                    email: "",
                    userId: "",
                }));
                socket?.emit("disconnect");
                setSocket(null);
                setAuth((prev) => false);
                navigate("/chatify-frontend/");
            })
            .catch(function (response) {
                console.log("Invalid Operation!");
                window.location.reload();
            });
    }
    function handleUpdateState(data) {
        setCurrentChatDetails((prev) => data);
    }
    function handleVisibility() {
        setPannelVisibility((prev) => (prev === "false" ? "true" : "false"));
    }

    return (
        <div className="dashboardBody">
            <Leftpane
                handleUpdateState={handleUpdateState}
                userDetails={userDetails}
                currentChatDetails={currentChatDetails}
            />
            <Middlepane
                currentChatDetails={currentChatDetails}
                userDetails={userDetails}
                pannelVisibility={pannelVisibility}
                handleVisibility={handleVisibility}
                handleLogout = {handleLogout}
            />
            <Rightpane
                style={rightPaneStyle}
                currentChatDetails={currentChatDetails}
                pannelVisibility={pannelVisibility}
                handleVisibility={handleVisibility}
            />
        </div>
    );
}
