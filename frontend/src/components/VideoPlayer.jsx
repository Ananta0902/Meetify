import React, { useEffect, useRef } from 'react';

const VideoPlayer = React.memo(({ stream, isMuted, className }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={isMuted}
      className={className || "w-full h-full object-cover rounded-2xl"}
    />
  );
});

// Setting a display name helps with debugging in React DevTools
VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;