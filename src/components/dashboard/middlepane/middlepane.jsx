import React, { useState, useRef, useEffect, useContext } from "react";
import EmojiPicker from "emoji-picker-react";
import { IonIcon } from "@ionic/react";
import { happyOutline, sendSharp, settingsOutline } from "ionicons/icons";
import "./middlepane.css";
import { Axios, URL } from "../../../api/axios";
import { Context } from "../../../context/AppProvider";

export default function Middlepane(props) {
    const [chatText, setChatText] = useState("");
    const [showEmojis, setShowEmojis] = useState(false);
    const [messages, setMessages] = useState([]);
    const ref = useRef(null);
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const { rightPaneStyle, rightPaneToggle } = useContext(Context);

    useEffect(() => {
        const conId = props.currentChatDetails.conversationId;
        if (conId !== "") {
            Axios.get(URL + "/api/message/get/" + conId)
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
            const conversationId = localStorage.getItem("conversationId");
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
                url: URL + "/api/message/set",
                withCredentials: true,
                data: bodyFormData,
            }).then((response) => console.log(response));
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
        else
            return (
                <div className="senderMessage" key={index}>
                    <img
                        src={process.env.PUBLIC_URL + "/images/demoImg.jpeg"}
                        alt="avatar"
                    />
                    <div className="innerText">{message}</div>
                </div>
            );
    });
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
                            <span className="userStatus">Online</span>
                        )}
                    </div>
                </div>
                <button
                    className="settingsBtn"
                    onClick={rightPaneToggle}
                >
                    <IonIcon icon={settingsOutline} className="settingsIcon" />
                </button>
            </div>
            <div className="middlepaneBody">
                {divs ? divs : ""}
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
