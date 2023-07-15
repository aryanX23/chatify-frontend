import React, { useState, useRef, useEffect, useContext } from "react";
import EmojiPicker from "emoji-picker-react";
import { IonIcon } from "@ionic/react";
import { happyOutline, sendSharp, settingsOutline, logOutOutline} from "ionicons/icons";
import "./middlepane.css";
import { Axios,URL } from "../../../api/axios";
import { Context } from "../../../context/AppProvider";
import { io } from "socket.io-client";

export default function Middlepane(props) {
    const [chatText, setChatText] = useState("");
    const [showEmojis, setShowEmojis] = useState(false);
    const [messages, setMessages] = useState([]);
    const [online] = useState(false);
    const ref = useRef(null);
    const messagesEndRef = useRef(null);
    const { rightPaneToggle } = useContext(Context);
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        const conId = props.currentChatDetails.conversationId;
        if (conId !== "") {
            Axios.get(URL+"/message/get/" + conId)
                .then((response) => {
                    const data = response.data.data;
                    setMessages((prev) => data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [props.currentChatDetails.conversationId]);
    useEffect(() => {
        scrollToBottom();
    }, [chatText, messages]);
    useEffect(() => {
        setSocket(io("https://chatify-production.up.railway.app"));
    },[]);
    useEffect(() => {
        socket.emit("addUser", props.userDetails.userId);
        socket.on("getUsers", (users) => {
            console.log(users);
        });
        socket.on("getMessage", (data) => {
            setMessages((prev) => [
                ...prev,
                { senderId: data.senderId, message: data.message },
            ]);
        });
    }, [socket]);
    
    function handleShow() {
        setShowEmojis(!showEmojis);
    }
    function handleChange(e) {
        setChatText((prev) => e.target.value);
    }
    const onEmojiClick = (event, emojiObject) => {
        const cursor = ref.current.selectionStart;
        const text =
            chatText.slice(0, cursor) + event.emoji + chatText.slice(cursor);
        setChatText(text);
        const newCursor = cursor + event.emoji.length;
        setTimeout(
            () => ref.current.setSelectionRange(newCursor, newCursor),
            10
        );
    };
    function handleSend(e) {
        if (chatText !== "") {
            const conversationId = props.currentChatDetails.conversationId;
            if (conversationId === null) {
                setChatText((prev) => "");
                setShowEmojis((prev) => false);
                return;
            }
            const bodyFormData = {
                conversationId: conversationId,
                senderId: localStorage.getItem("userId"),
                message: chatText,
            };
            Axios({
                method: "post",
                url: URL + "/message/set",
                withCredentials: true,
                data: bodyFormData,
            }).then((response) => {
                console.log(response);
                socket?.emit("sendMessage", {
                    senderId: bodyFormData.senderId,
                    receiverId: props.currentChatDetails.receiverId,
                    message: bodyFormData.message,
                    conversationId: bodyFormData.conversationId,
                });
            });
            setChatText((prev) => "");
            setShowEmojis((prev) => false);
        }
    }
    const divs = messages?.map(({ message, senderId }, index) => {
        if (senderId === localStorage.getItem("userId"))
            return (
                <div className="receiverMessage" key={index}>
                    <div className="innerText">{message}</div>
                    <img
                        src={process.env.PUBLIC_URL + "/images/avatar.jpg"}
                        alt="avatar"
                    />
                </div>
            );
        else if(senderId === props.currentChatDetails.receiverId)
            return (
                <div className="senderMessage" key={index}>
                    <img
                        src={process.env.PUBLIC_URL + "/images/demoImg.jpeg"}
                        alt="avatar"
                    />
                    <div className="innerText">{message}</div>
                </div>
            );
        else {
            return (
                ""
            );
        }
    });
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    

    return (
        <div className="middlepane">
            <div className="middlepaneHeader">
                <div className="headerDetails">
                    <img
                        src={process.env.PUBLIC_URL + "/images/demoImg.jpeg"}
                        alt="img"
                    />
                    <div className="userDetails">
                        <span className="userName">
                            {props.currentChatDetails.name}
                        </span>
                        {props.currentChatDetails.name !== "" && (
                            <span className="userStatus">{ online ? "Online" : "Offline" }</span>
                        )}
                    </div>
                </div>
                <div style={{ display: "flex" }}>
                    <button className="settingsBtn" onClick={rightPaneToggle}>
                        <IonIcon
                            icon={settingsOutline}
                            className="settingsIcon"
                        />
                    </button>
                    <button
                        className="settingsBtn"
                        onClick={props.handleLogout}
                    >
                        <IonIcon
                            icon={logOutOutline}
                            className="settingsIcon"
                        />
                    </button>
                </div>
            </div>
            <div className="middlepaneBody">
                {divs ? (
                    divs
                ) : ""}
                <div ref={messagesEndRef} />
            </div>
            <div className="middlepaneFooter">
                <input
                    type="text"
                    name="chatText"
                    placeholder="Type your message here"
                    className="chatText"
                    value={chatText}
                    onChange={handleChange}
                    ref={ref}
                    onClick={() => setShowEmojis(false)}
                    onKeyDown={(e) => {
                        if (e.key !== "Enter") return;
                        handleSend();
                    }}
                />
                <button className="emoBtn" onClick={handleShow}>
                    <IonIcon className="emoIcon" icon={happyOutline} />
                </button>
                <button className="emoBtn" onClick={handleSend}>
                    <IonIcon className="emoIcon" icon={sendSharp} />
                </button>
                {showEmojis && (
                    <div className="emoPanel">
                        <EmojiPicker
                            className="emoPanel"
                            onEmojiClick={onEmojiClick}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
