import React, { useEffect, useRef } from "react";
import styles from "../styles/VideoComponent.module.css";

export default function Participant({

    stream,

    name,

    isLocal = false

}) {

    const videoRef = useRef(null);

    useEffect(() => {

        if (videoRef.current && stream) {

            videoRef.current.srcObject = stream;

        }

    }, [stream]);

    return (

        <div className={styles.card}>

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isLocal}
                className={styles.video}
            />

            <div className={styles.name}>

                {name}

                {isLocal && " (You)"}

            </div>

        </div>

    );

}