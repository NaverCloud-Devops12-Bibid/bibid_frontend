import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import EmojiSection from "./EmojiSection";
import ExpandCircleDownRoundedIcon from "@mui/icons-material/ExpandCircleDownRounded";
import { useNavigate } from "react-router-dom";
import Hls from "hls.js";
import axios from "axios";
import ViewerList from "./ViewerList";
import Cookies from "js-cookie";

const VideoEmojiWrapper = styled.div`
  width: 75%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const VideoContainer = styled.div`
  width: 100%;
  height: 75%;
  background: #323232;
`;

const VideoPlayer = styled.video`
  width: 100%;
  height: 100%;
`;

const EmojiContainer = styled.div`
  width: 100%;
  height: 25%;
  background: #5ac467;
  display: flex;
  justify-content: space-around;
`;

const StyledButton = styled.button`
  margin: 10px;
  padding: 10px 20px;
  font-size: 20px;
  cursor: pointer;
  color: #fff;
  background: red;
  border-radius: 10px;
`;

const VideoSectionOriginal = ({
  addEmojiMessage,
  streamingUrl,
  userType,
  chatLog,
  stompClient,
  lectureId,
  userList,
  navigate,
}) => {
  const 응원하기 = ["🍊", "🍎", "🥝", "🍈"];
  const 반응하기 = ["🎉", "😂", "👍🏻", "✋🏻"];

  const videoRef = useRef(null);
  // const navigate = useNavigate();

  console.log(`streamingUrl 배열 ${JSON.stringify(streamingUrl)}`);

  useEffect(() => {
    if (streamingUrl && streamingUrl.length > 0) {
      const video = videoRef.current;
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(streamingUrl[0].url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamingUrl[0].url;
        video.addEventListener("loadedmetadata", function () {
          video.play();
        });
      }
    }
  }, [streamingUrl]);

  useEffect(() => {
    // 컴포넌트가 언마운트될 때 실행되는 로직
    return () => {
      if (stompClient && stompClient.connected) {
        console.log(stompClient);
        const token = Cookies.get('ACCESS_TOKEN');
        stompClient.send(`/app/sendMsg/${lectureId}/leave`, {
          Authorization: "Bearer " + token,
        });
        stompClient.disconnect();
      }
    };
  }, [stompClient]);

  const handleEmojiClick = (emoji, type) => {
    addEmojiMessage(emoji, type);
  };

  const deleteChannel = async () => {
    const channelInfoFromSession = JSON.parse(
      sessionStorage.getItem("channelInfo")
    );
    const channelId = channelInfoFromSession.channelId;

    try {
      const token = Cookies.get('ACCESS_TOKEN');
      stompClient.send(`/app/sendMsg/${lectureId}/exit`, {
        Authorization: "Bearer " + token,
      });

      const response = await axios.delete(
        `https://eduventure.site:5443/lecture/lecture/${channelId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
          },
        }
      );
      console.log(response.data.item);
      sessionStorage.removeItem("channelInfo");
      alert("방송이 정상적으로 종료되었습니다.");
      setTimeout(() => {
        navigate("/admin/streaming");
      }, 1000);
    } catch (error) {
      console.log(error);
      alert("OBS인코더에서 방송 중지를 먼저 해주세요.");
    }
  };

  return (
    <VideoEmojiWrapper>
      <VideoContainer>
        {userType === "teacher" ? (
          <StyledButton onClick={deleteChannel}>방송종료</StyledButton>
        ) : (
          <ExpandCircleDownRoundedIcon
            onClick={() => navigate(-1)}
            sx={{
              margin: "10px 0 0 10px",
              fontSize: "50px",
              color: "#ffffff",
              cursor: "pointer",
              transform: "rotate(90deg)",
            }}
          />
        )}
        {streamingUrl && streamingUrl.length > 0 ? (
          <VideoPlayer controls ref={videoRef} muted>
            <source src={streamingUrl[0].url} type="application/x-mpegURL" />
          </VideoPlayer>
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
      </VideoContainer>
      <EmojiContainer>
        {userType === "teacher" || userType === "admin" ? (
          <ViewerList chatLog={chatLog} userList={userList} />
        ) : (
          <>
            <EmojiSection
              title="응 원 하 기"
              emojis={응원하기}
              onEmojiClick={(emoji) => handleEmojiClick(emoji, "응원하기")}
            />
            <EmojiSection
              title="반 응 하 기"
              emojis={반응하기}
              onEmojiClick={(emoji) => handleEmojiClick(emoji, "반응하기")}
            />
          </>
        )}
      </EmojiContainer>
    </VideoEmojiWrapper>
  );
};

export default VideoSectionOriginal;