import {useState, useEffect} from 'react';
import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const ChatMessageType = {
    MESSAGE: "MESSAGE",
};

const useAuctionWebSocket = (auctionIndex, isChatClosed) => {
    const loginMemberNickname = useSelector((state) => state.memberSlice.nickname);

    // 상태 초기화
    const [messages, setMessages] = useState({});
    const [inputMessage, setInputMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [currentPrices, setCurrentPrices] = useState({});
    const [bidAmounts, setBidAmounts] = useState({});
    const [bidderNicknames, setBidderNicknames] = useState({});
    const [participantCounts, setParticipantCounts] = useState({});
    const [auctionDetails, setAuctionDetails] = useState({});

    const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF0',
        '#FFD700', '#DC143C', '#8A2BE2', '#FF8C00', '#00CED1', '#00FA9A',
        '#FF69B4', '#BA55D3', '#8B4513', '#4682B4', '#6A5ACD', '#708090',
        '#FF6347', '#DA70D6', '#20B2AA', '#B22222', '#FF4500', '#2E8B57',
        '#ADFF2F', '#F08080', '#CD5C5C', '#6495ED', '#DB7093', '#AFEEEE'
    ];

    // 닉네임 색상 선택 함수
    const getNicknameColor = (nickname) => {
        if (nickname === '시스템') return '#0A369D';
        let hash = 0;
        for (let i = 0; i < nickname.length; i++) {
            hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    // 1분 내 메시지 불러오기
    const loadLastMinuteMessages = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_SERVER}/api/chat/lastMinute/${auctionIndex}`, {withCredentials: true});
            setMessages((prevMessages) => ({
                ...prevMessages,
                [auctionIndex]: response.data.map(msg => ({
                    chatMessage: msg.chatMessage,
                    senderNickname: msg.senderNickname,
                    sendTime: msg.sendTime,
                    color: getNicknameColor(msg.senderNickname),
                })),
            }));
        } catch (error) {
            console.error("최근 1분 채팅 불러오기 실패:", error);
        }
    };

    // WebSocket 연결 및 초기 메시지 설정
    useEffect(() => {
        if (!auctionIndex || isChatClosed) return;

        const connectAuctionWebSocket = async () => {
            await loadLastMinuteMessages();

            const auctionSocket = new SockJS(`${process.env.REACT_APP_BACK_SERVER}/ws-auctions`, null, {withCredentials: true});
            const auctionClient = new Client({
                webSocketFactory: () => auctionSocket,
                onConnect: () => {
                    setConnected(true);
                    // 채팅 구독
                    auctionClient.subscribe(`/topic/public/${auctionIndex}`, (message) => {
                        const newMessage = JSON.parse(message.body);
                        updateMessages(newMessage);
                    });

                    // 경매 구독
                    auctionClient.subscribe(`/topic/auction/${auctionIndex}`, (message) => {
                        const auctionInfo = JSON.parse(message.body);
                        handleAuctionUpdates(auctionInfo);
                    });

                    // 참가자 수 구독
                    auctionClient.subscribe(`/topic/participants/count/${auctionIndex}`, (message) => {
                        const count = JSON.parse(message.body);
                        setParticipantCounts((prevCounts) => ({
                            ...prevCounts,
                            [auctionIndex]: count,
                        }));
                    });

                    // 입장 메시지 구독
                    auctionClient.subscribe(`/topic/participants/enter/${auctionIndex}`, (message) => {
                        const enterMessage = JSON.parse(message.body);
                        updateMessages(enterMessage);
                        setParticipantCounts((prevCounts) => ({
                            ...prevCounts,
                            [auctionIndex]: enterMessage.participantCount,
                        }));
                    });

                    // 퇴장 메시지 구독
                    auctionClient.subscribe(`/topic/participants/leave/${auctionIndex}`, (message) => {
                        const leaveMessage = JSON.parse(message.body);
                        updateMessages(leaveMessage);
                        setParticipantCounts((prevCounts) => ({
                            ...prevCounts,
                            [auctionIndex]: leaveMessage.participantCount,
                        }));
                    });

                    // 입장 처리
                    handleUserJoin(auctionClient);
                },
                onStompError: (error) => console.error("WebSocket error:", error),
            });

            auctionClient.activate();
            setStompClient(auctionClient);
        };

        connectAuctionWebSocket();

    }, [auctionIndex, isChatClosed]);

    // 입장 처리 함수
    const handleUserJoin = (client) => {
        if (client) {
            client.publish({
                destination: `/app/chatroom/${auctionIndex}/enter`,
                body: loginMemberNickname,
            });
        } else {
            console.warn('WebSocket 클라이언트가 없습니다. 입장 메시지를 전송할 수 없습니다.');
        }
    };

    // 퇴장 처리 함수
    const handleUserLeave = async () => {
        if (stompClient) {
            await stompClient.publish({
                destination: `/app/chatroom/${auctionIndex}/leave`,
                body: loginMemberNickname,
            });
        } else {
            console.warn('WebSocket이 연결되지 않았습니다. 퇴장 메시지를 전송하지 않습니다.');
        }
    };

    // 메시지 업데이트
    const updateMessages = (newMessage) => {
        setMessages((prevMessages) => ({
            ...prevMessages,
            [auctionIndex]: [
                ...(prevMessages[auctionIndex] || []),
                {
                    chatMessage: newMessage.chatMessage,
                    senderNickname: newMessage.senderNickname || '시스템',
                    sendTime: newMessage.sendTime,
                    color: getNicknameColor(newMessage.senderNickname),
                },
            ],
        }));
    };

    // 경매 정보 업데이트
    const handleAuctionUpdates = (auctionInfo) => {
        if (auctionInfo.bidAmount) {
            setCurrentPrices((prev) => ({...prev, [auctionIndex]: auctionInfo.bidAmount}));
            setBidAmounts((prev) => ({...prev, [auctionIndex]: auctionInfo.bidAmount}));
            setBidderNicknames((prev) => ({...prev, [auctionIndex]: auctionInfo.bidderNickname}));
        }
        if (auctionInfo.winnerIndex) {
            setAuctionDetails((prev) => ({
                ...prev,
                [auctionIndex]: {
                    winnerIndex: auctionInfo.winnerIndex,
                    winningBid: auctionInfo.winningBid,
                    winnerNickname : auctionInfo.winnerNickname
                },
            }));
        }
    };

    // 메시지 전송 함수
    const sendMessage = () => {
        if (connected && stompClient) {
            stompClient.publish({
                destination: `/app/chat.sendMessage/${auctionIndex}`,
                body: JSON.stringify({
                    senderNickname: loginMemberNickname,
                    chatMessage: inputMessage,
                    messageType: ChatMessageType.MESSAGE,
                }),
            });
            setInputMessage('');
        }
    };

    // 입찰 처리 함수
    const checkLoginState = useSelector(state => state.memberSlice.checkLoginState);
    const navi = useNavigate();
    const handleBidSubmit = (bidAmount) => {
        if (!checkLoginState) {
            alert("로그인 후 사용하시기 바랍니다.");
            navi("/login");
        } else {
            if (bidAmount > currentPrices[auctionIndex]) {
                setBidAmounts((prev) => ({...prev, [auctionIndex]: bidAmount}));
                stompClient.publish({
                    destination: `/app/auction.bid/${auctionIndex}`,
                    body: JSON.stringify({auctionIndex, bidAmount}),
                });
            } else {
                alert('입찰가는 현재가보다 높아야 합니다.');
            }
        }
    };

    return {
        messages,
        inputMessage,
        setInputMessage,
        sendMessage,
        handleBidSubmit,
        currentPrices,
        bidAmounts,
        participantCounts,
        disconnectWebSocket: async () => {
            if (stompClient && connected) {
                try {
                    await handleUserLeave(); // 퇴장 메시지 전송
                } catch (error) {
                    console.error("Error during handleUserLeave:", error);
                } finally {
                    stompClient.deactivate(); // WebSocket 연결 해제
                    setConnected(false); // 상태 초기화
                }
            }
        },
        bidderNicknames,
        auctionDetails,
        setCurrentPrices,
        setBidAmounts,
    };
};

export default useAuctionWebSocket;
