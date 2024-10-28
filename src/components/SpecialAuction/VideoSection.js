import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const VideoSection = ({ streamingUrl }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null); // HLS 객체를 useRef로 관리
  const [retryCount, setRetryCount] = useState(0); // 재시도 횟수 관리
  const MAX_RETRIES = 5; // 최대 재시도 횟수
  const RETRY_DELAY = 3000; // 재시도 간격 (밀리초, 3초)

  const tryLoadHLS = () => {
    const video = videoRef.current;

    if (streamingUrl && streamingUrl.length > 0 && video) {
      // HLS.js가 지원되는 경우
      if (Hls.isSupported()) {
        // 기존 hls 객체가 있다면 먼저 해제
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
        
        // 새로운 hls 객체 생성 및 스트림 로드
        const hls = new Hls();
        hlsRef.current = hls; // hls 객체를 ref에 저장
        hls.loadSource(streamingUrl[0]); // streamingUrl[0]에 HLS 스트리밍 URL이 있다고 가정
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(err => console.error("비디오 재생 실패:", err));
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR && retryCount < MAX_RETRIES) {
              console.log(`스트림을 다시 시도합니다... (${retryCount + 1}/${MAX_RETRIES})`);
              setTimeout(() => {
                setRetryCount((prevRetryCount) => prevRetryCount + 1);
                tryLoadHLS(); // 일정 시간 후 재시도
              }, RETRY_DELAY);
            } else {
              console.error("HLS 스트림 로드에 실패했습니다.");
            }
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // HLS를 직접 지원하는 브라우저 (Safari 등)
        video.src = streamingUrl[0];
        video.addEventListener("loadedmetadata", function () {
          video.play().catch(err => console.error("비디오 재생 실패:", err));
        });
      }
    }
  };

  useEffect(() => {
    tryLoadHLS(); // 최초 시도

    // 컴포넌트 언마운트 시 hls 객체 해제
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [streamingUrl]);

  return (
    <div>
      {streamingUrl && streamingUrl.length > 0 ? (
        <video controls ref={videoRef} muted style={{ width: "100%", height: "auto" }}>
          <source src={streamingUrl[0]} type="application/x-mpegURL" />
        </video>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#FFFFFF",
            fontSize: "1.5rem",
          }}
        >
          <div style={{display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "540px",
                      height: "330px",
            }}
          >비디오를 불러오는 중...</div>
        </div>
      )}
    </div>
  );
};

export default VideoSection;
