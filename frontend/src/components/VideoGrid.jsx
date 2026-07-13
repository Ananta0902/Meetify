import React from "react";
import styles from "../styles/VideoComponent.module.css";
import Participant from "./Participant";

export default function VideoGrid({
    localStream,
    remoteStreams,
    username
}) {
    return (
        <div className={styles.conferenceView}>
            {localStream && (
                <Participant
                    stream={localStream}
                    name={username}
                    isLocal={true}
                />
            )}

            {remoteStreams.map((user) => (
                <Participant
                    key={user.socketId}
                    stream={user.stream}
                    name={user.name}
                />
            ))}
        </div>
    );
}