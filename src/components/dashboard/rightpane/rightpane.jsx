import React, { useContext, useState } from "react";
import "./rightpane.css";
import { IonIcon } from "@ionic/react";
import { closeSharp } from "ionicons/icons";
import { Context } from "../../../context/AppProvider.js";
import { motion } from "framer-motion";

export default function Rightpane(props) {
    //console.log(props.pannelVisibility);
    const { rightPaneStyle, rightPaneToggle } = useContext(Context);

    //console.log(rightPaneStyle);
    return (
        <div className="containerPane" style={rightPaneStyle}>
            <div className="leftOpac"></div>
            <motion.div
                className="rightpane"
                data-visibility={props.pannelVisibility}
                initial={{ transform: "translateX(100%)" }}
                animate={{ transform: "translateX(0%)" }}
                transition={{duration: 1}}
            >
                <button className="closeBtn" onClick={rightPaneToggle}>
                    <IonIcon icon={closeSharp} className="closeIcon" />
                </button>
                <img
                    src={process.env.PUBLIC_URL + "/images/demoImg.jpeg"}
                    alt="userImg"
                    className="userImg"
                />
                <div className="Details">
                    <h1>{props.currentChatDetails.name}</h1>
                    <span>{props.currentChatDetails.email}</span>
                </div>
            </motion.div>
        </div>
    );
}
