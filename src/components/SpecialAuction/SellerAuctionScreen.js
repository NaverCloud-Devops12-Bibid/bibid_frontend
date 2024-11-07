import React, { useState, useEffect, useRef } from 'react';
import { getFormattedRemainingTime } from '../../util/utils';
import SAsellerSteamingBox from './SAsellerStreamingBox';
import '../../css/SpecialAuction/SAitem.css';
import axios from 'axios';
import VideoSection from './VideoSection';
import { OBSWebSocket } from 'obs-websocket-js';

function SellerAuctionScreen({
    webSocketProps, 
    auction, 
    remainingTime, 
    closeSellerPage
}) {
    const isDevelopment = process.env.NODE_ENV === 'development';

    // 이미지 경로 설정
    const waitingImagePath = isDevelopment
        ? 'http://localhost:3000/images/SA_wait_image.jpg'  // 개발 환경
        : 'https://bibid.shop/images/SA_wait_image.jpg';    // 배포 환경

    const endingImagePath = isDevelopment
        ? 'http://localhost:3000/images/SA_auction_end_image.jpg'  // 개발 환경
        : 'https://bibid.shop/images/SA_auction_end_image.jpg';    // 배포 환경

    const gifUrl = isDevelopment
        ? 'http://localhost:3000/images/bid_donation.gif'  // 개발 환경
        : 'https://bibid.shop/images/bid_donation.gif';    // 배포 환경

    const obs = useRef(null); // OBS WebSocket 참조

    const [isObsConnected, setIsObsConnected] = useState(false); // OBS 소켓 관리
    const [isStreaming, setIsStreaming] = useState(false); // 스트리밍 상태 관리

    // OBS WebSocket 연결
    const connectOBS = () => {
        obs.current = new OBSWebSocket();
        obs.current.connect('ws://localhost:4455') // OBS WebSocket 서버로 연결
            .then(() => {
                setIsObsConnected(true); // 연결 성공 시 상태 업데이트
                checkStreamingStatus(); // 연결 후 스트리밍 상태 확인
                listenToStreamEvents();
            })
            .catch(err => {
                console.error('OBS WebSocket 연결 실패:', err);
                setIsObsConnected(false); // 연결 실패 시 상태 업데이트
            });
    };

    // OBS의 현재 스트리밍 상태 확인
    const checkStreamingStatus = () => {
        if (obs.current) {
            obs.current.call('GetOutputStatus', { outputName: 'simple_stream' }) // 아웃풋 이름을 'simple_stream'으로 지정
                .then(response => {
                    setIsStreaming(response.outputActive); // 스트리밍 상태 업데이트
                    lastStreamingStatus.current = response.outputActive; 
                })
                .catch(err => {
                    console.error('OBS 스트리밍 상태 확인 실패:', err);
                });
        }
    };

    const lastStreamingStatus = useRef(null); // 이전 상태를 저장

    // 스트리밍 상태 변경 이벤트 리스너
    const listenToStreamEvents = () => {
        if (obs.current) {
            obs.current.on('StreamStateChanged', (data) => {
                const isCurrentlyStreaming = data.outputActive;
                setIsStreaming(isCurrentlyStreaming); // 현재 스트리밍 상태 업데이트
                lastStreamingStatus.current = isCurrentlyStreaming; // 마지막 상태 업데이트
            });
        }
    };

    // 입찰 정보와 이미지를 OBS에 표시
    const displayBidWithImageOnOBS = (bidAmount, bidderNickname) => {
        if (isObsConnected) {
            console.log('OBS에 연결되었습니다.');

            // 이미지 소스 추가
            obs.current.call('CreateInput', {
                sceneName: 'Live Scene',  // OBS에서 사용하는 장면 이름
                inputName: 'Bid Browser Overlay',  // 이미지 소스 이름
                inputKind: 'browser_source',  // 이미지 소스 종류
                inputSettings: {
                    url: gifUrl,  // GIF를 포함한 HTML 페이지 URL
                    width: 500,  // 이미지 가로 크기
                    height: 200  // 이미지 세로 크기
                }
            }).then(() => {
                // 텍스트 소스 추가
                return obs.current.call('CreateInput', {
                    sceneName: 'Live Scene',
                    inputName: 'Bid Text Overlay',
                    inputKind: 'text_ft2_source_v2',
                    inputSettings: {
                        text: `${bidderNickname} 님이 ${bidAmount} 를 입찰하였습니다.`,
                        font: { face: 'Malgun Gothic', size: 48 },
                        color: 0xFFFFFFFF,
                        backgroundColor: 0x000000FF,
                        align: 'center'
                    }
                })
                }).then(() => {
                    // 일정 시간 후 텍스트와 이미지 소스 제거
                    setTimeout(() => {
                        console.log('텍스트 및 이미지 소스를 제거합니다.');
                        obs.current.call('RemoveInput', { inputName: 'Bid Text Overlay' });
                        obs.current.call('RemoveInput', { inputName: 'Bid Browser Overlay' });
                    }, 10000);  // 10초 후 제거
                }).catch(err => {
                    console.error('OBS에 이미지 또는 텍스트 추가 실패:', err);
                });
            } else {
                console.error('OBS에 연결되지 않았습니다.');
            }
        };

    // 채널 정보 상태 관리
    const [channelInfo, setChannelInfo] = useState({
        serverURL: '',
        streamKey: '',
        channelStatus: 'CREATING',
        cdnStatusName: 'CREATING',
        streamingUrl: []
    });

    useEffect(() => {
        const fetchChannelInfo = async () => {
            try {
                // API 호출로 스트리밍 정보 가져오기
                const response = await axios.get(`${process.env.REACT_APP_BACK_SERVER}/specialAuction/channelInfo/${auction.auctionIndex}`, { withCredentials: true });
                const channelInfoDto = response.data.item;

                // 서버와 스트림 키 업데이트
                setChannelInfo({
                    streamKey: channelInfoDto.streamKey,
                    serverURL: channelInfoDto.publishUrl,
                    channelStatus: channelInfoDto.channelStatus,
                    cdnStatusName: channelInfoDto.cdnStatusName,
                    streamingUrl: channelInfoDto.serviceUrlList
                });
            } catch (error) {
                console.error('스트리밍 정보 가져오기 실패:', error);
            }
        };
        fetchChannelInfo();
    }, [auction.auctionIndex]);

    // OBS WebSocket 연결 및 재연결 처리
    useEffect(() => {
        connectOBS(); // 컴포넌트 마운트 시 OBS 연결

        // if (obs.current) {
        //     // StreamStateChanged 이벤트 리스너가 중복 등록되지 않도록 설정
        //     obs.current.removeAllListeners('StreamStateChanged');
        //     listenToStreamEvents();
        // }

        // 컴포넌트 언마운트 시 WebSocket 연결 해제 및 이벤트 리스너 제거
        return () => {
            if (obs.current) {
                obs.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (isObsConnected) {
            checkStreamingStatus(); // 연결 성공 시 스트리밍 상태 확인
        }
    }, [isObsConnected]);

    // OBS 연결 성공 시 장면 세팅
    useEffect(() => {
        if (isObsConnected) {
            setupOBSScenes(); // 장면과 대기화면 소스 설정
        }
    }, [isObsConnected]);

    // 입찰 정보 처리 (WebSocket에서 받은 정보 사용)
    useEffect(() => {
        if (webSocketProps.bidAmounts[auction.auctionIndex]) {
            const bidAmount = webSocketProps.bidAmounts[auction.auctionIndex];
            const bidderNickname = webSocketProps.bidderNicknames[auction.auctionIndex];
            displayBidWithImageOnOBS(bidAmount, bidderNickname);
        }
    }, [webSocketProps.bidAmounts, webSocketProps.bidderNicknames, auction.auctionIndex]);

    const setupOBSScenes = () => {
        if (obs.current && isObsConnected) {
            // OBS에서 장면 목록을 가져와서 확인
            obs.current.call('GetSceneList')
                .then((response) => {
                    const sceneNames = response.scenes.map(scene => scene.name);

                    // Live Scene이 없을 때만 생성
                    if (!sceneNames.includes('Live Scene')) {
                        obs.current.call('CreateScene', { sceneName: 'Live Scene' })
                            .catch((err) => console.error('Live Scene 생성 실패:', err));
                    }

                    // Waiting Scene이 없을 때만 생성
                    if (!sceneNames.includes('Waiting Scene')) {
                        obs.current.call('CreateScene', { sceneName: 'Waiting Scene' })
                            .then(() => {
                                return obs.current.call('CreateInput', {
                                    sceneName: 'Waiting Scene',
                                    inputName: 'Waiting Image',
                                    inputKind: 'image_source',
                                    inputSettings: {
                                        file: waitingImagePath, // public 폴더 이미지 경로
                                    },
                                });
                            })
                            .catch((err) => console.error('Waiting Scene 설정 실패:', err));
                    }

                    // Ending Scene이 없을 때만 생성
                    if (!sceneNames.includes('Ending Scene')) {
                        obs.current.call('CreateScene', { sceneName: 'Ending Scene' })
                            .then(() => {
                                console.log('Ending Scene 생성 완료');
                                // Waiting Scene에 이미지 소스 추가
                                return obs.current.call('CreateInput', {
                                    sceneName: 'Ending Scene',
                                    inputName: 'Ending Image',
                                    inputKind: 'image_source',
                                    inputSettings: {
                                        file: endingImagePath, // public 폴더 이미지 경로
                                    },
                                });
                            })
                            .then(() => {
                                // 낙찰자 정보 텍스트 추가
                                return obs.current.call('CreateInput', {
                                    sceneName: 'Ending Scene',
                                    inputName: 'Winner Info Text',  // 텍스트 소스 이름
                                    inputKind: 'text_ft2_source_v2',  // 텍스트 소스 종류
                                    inputSettings: {
                                        font: { face: 'Malgun Gothic', size: 48 },
                                        color: 0xFFFFFFFF,  // 텍스트 색상 (흰색)
                                        backgroundColor: 0x000000FF,  // 배경 색상 (검은색)
                                        align: 'center',  // 텍스트 정렬
                                    },
                                });
                            })
                            .then(() => console.log('낙찰자 정보 텍스트 추가 완료'))
                            .catch((err) => console.error('Ending Scene 설정 실패:', err));
                    }
                })
                .catch(err => console.error('장면 목록 가져오기 실패:', err));
        }
    };

    const [isLive, setIsLive] = useState(false); // 라이브 상태 관리
    const [remainingText, setRemainingText] = useState("경매 시작까지 남은 시간"); // 남은 시간 텍스트
    const [formattedTimeText, setFormattedTimeText] = useState(""); // 포맷된 시간 텍스트

    const {
        messages,
        inputMessage,
        setInputMessage,
        sendMessage,
        currentPrices,
        participantCounts,
        bidderNicknames,
        auctionDetails
    } = webSocketProps;
    const winnerInfo = auctionDetails[auction.auctionIndex];

    const messagesEndRef = useRef(null);

    const auctionStartTime = new Date(auction.startingLocalDateTime);
    const auctionEndTime = new Date(auction.endingLocalDateTime);
    const formattedAuctionStartTime = auctionStartTime.toLocaleString('ko-KR'); // 한국어 포맷으로 변경
    const formattedAuctionEndTime = auctionEndTime.toLocaleString('ko-KR'); // 종료 시간도 한국어 포맷으로 변경
    const formattedBidIncrement = auction.bidIncrement?.toLocaleString() || '0'; // null/undefined 대비 기본값 처리
    const formattedStartingPrice = auction.startingPrice?.toLocaleString() || '0';
    const formattedCurrentPrice = (currentPrices[auction.auctionIndex] || auction.startingPrice)?.toLocaleString() || '0';

    const formattedParticipantCount = participantCounts[auction.auctionIndex] || 0; // 경매 ID에 해당하는 참여자 수를 가져옴, 없으면 0

    // 메시지 스크롤을 맨 아래로 이동
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // 메시지를 전송하는 핸들러
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    useEffect(() => {
        const now = new Date();

        if (now < auctionStartTime) {
            setRemainingText("경매 시작까지 <br/>남은 시간");
            setFormattedTimeText(`(${formattedAuctionStartTime})`); // 경매 시작 시간으로 표시
        } else if (now >= auctionStartTime && now < auctionEndTime) {
            setRemainingText("경매 종료까지 <br/>남은 시간");
            setFormattedTimeText(`(${formattedAuctionEndTime})`); // 경매 종료 시간으로 표시
        } else {
            setRemainingText("경매 종료까지 <br/>남은 시간");
            setFormattedTimeText(`(${formattedAuctionEndTime})`); // 종료 후에는 시간을 표시하지 않음
        }
    }, [auctionStartTime, auctionEndTime]);

    const formattedRemainingTime = getFormattedRemainingTime(remainingTime);

    // 채팅시 현재시간 변경 포맷
    const formatTime = (sendTime) => {
        if (!sendTime) return '';

        const date = new Date(sendTime);
        return date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    // 방송 시작
    const startStreaming = () => {
        if (obs.current && isObsConnected) {
            // 먼저 Live Scene으로 전환
            obs.current.call('SetCurrentProgramScene', { sceneName: 'Live Scene' })
                .then(() => {
                    // 장면 전환 후 방송 시작
                    return obs.current.call('StartStream');
                })
                .then(() => {
                    setIsStreaming(true); // 방송 시작 상태로 업데이트
                    setIsLive(true); // Live 상태로 업데이트

                    // 방송 시작과 동시에 백엔드에 상태 갱신 요청
                    updateBackendStatusToLive();
                })
                .catch(err => console.error('OBS 스트리밍 시작 실패:', err));
        }
    };

    // 백엔드에 경매 상태 및 채널 상태 갱신 요청 함수
    const updateBackendStatusToLive = () => {
        axios.post(`${process.env.REACT_APP_BACK_SERVER}/specialAuction/startLive/${auction.auctionIndex}`, {}, { withCredentials: true })
            .catch(error => {
                console.error('백엔드 상태 갱신 실패:', error);
            });
    };

    // 방송 일시 정지 - 대기 화면으로 전환
    const pauseStreaming = () => {
        if (obs.current && isObsConnected && isStreaming) {
            obs.current.call('SetCurrentProgramScene', { 'sceneName': 'Waiting Scene' })
                .catch(err => console.error('OBS 대기 화면 전환 실패:', err));
        }
    };

    // 방송 재개 - 원래 장면으로 복귀
    const resumeStreaming = () => {
        if (obs.current && isObsConnected && isStreaming) {
            obs.current.call('SetCurrentProgramScene', { 'sceneName': 'Live Scene' })
                .catch(err => console.error('OBS 방송 장면 전환 실패:', err));
        }
    };

    // 경매 종료
    const stopAuction = () => {
        if (obs.current && isObsConnected && isStreaming) {
            obs.current.call('SetCurrentProgramScene', { 'sceneName': 'Ending Scene' })
                .catch(err => console.error('OBS 대기 화면 전환 실패:', err));
        }
    };

    // 방송 종료
    const stopStreaming = () => {
        if (obs.current && isObsConnected && isStreaming) {
            obs.current.call('StopStream')
                .then(() => {
                    setIsStreaming(false); // 방송 종료 상태로 업데이트
                    setIsLive(false); // Live 상태를 Off로 업데이트

                    // 방송 종료 시 백엔드에 상태 갱신 요청
                    updateBackendStatusToEnd();
                })
                .catch(err => console.error('OBS 스트리밍 종료 실패:', err));
        }
    };

    // 백엔드에 경매 및 채널 상태 종료로 갱신 요청 함수
    const updateBackendStatusToEnd = () => {
        axios.post(`${process.env.REACT_APP_BACK_SERVER}/specialAuction/endLive/${auction.auctionIndex}`, {}, { withCredentials: true })
            .catch(error => {
                console.error('백엔드 종료 상태 갱신 실패:', error);
            });
    };

    return (
        <div className="SAoverlay">
            <div className='SAtotalPopup'>
                <div className="SAsellerPopup">
                    <div className="SAsellerLiveAuctionHeader">
                        <h3>{isLive ? "Live On" : "Live Off"}</h3>
                        <h1>판매자</h1>
                        <div className='SAstreamingBttnBox'>
                            <button onClick={startStreaming}>경매 시작</button>
                            <button onClick={pauseStreaming}>경매 일시 정지</button>
                            <button onClick={resumeStreaming}>경매 재개</button>
                            <button onClick={stopAuction}>경매 종료</button>
                            <button onClick={stopStreaming}>방송 종료</button>
                        </div>
                        {winnerInfo && (
                            <div className='SAstreamingBttnBox'>
                                <button>낙찰자 정보</button>
                                <button>낙찰자: {winnerInfo.winnerNickname}</button>
                                <button>낙찰 금액: {winnerInfo.winningBid}원</button>
                            </div>
                        )}
                    </div>
                    <div className='SAauctionContainer'>
                        <div className='SAsellerTotalBox'>
                            <div className='SAsellerViewBox'>
                                <div className="SAsellerAuctionContentBox">
                                    <div className="SAsellerProductSection">
                                        {/* isStreaming 상태에 따라 UI를 다르게 렌더링 */}
                                        {isStreaming ? (
                                            // OBS 방송이 시작된 경우, HLS 스트리밍을 VideoSection을 통해 재생
                                            <VideoSection streamingUrl={channelInfo.streamingUrl} />
                                        ) : (
                                            // OBS 방송이 시작되지 않은 경우 대기 중 화면을 표시
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    height: '400px',
                                                    color: '#FFFFFF',
                                                    backgroundColor: '#000000',
                                                    fontSize: '1.5rem',
                                                }}
                                            >
                                                방송이 아직 시작되지 않았습니다.
                                            </div>
                                        )}
                                    </div>

                                    <div className="SAsellerAuctionDetails">
                                        <h2>{auction.productName}</h2>
                                        <div className='SAsellerAuctionDetailsBox'>
                                            <div className='SAsellerAuctionContentsTitle'>
                                                <p dangerouslySetInnerHTML={{ __html: remainingText }}></p>
                                                <p>현재가</p>
                                                <p>경매 시작가</p>
                                                <p>입찰단위</p>
                                                <p>대기중인 사용자</p>
                                            </div>
                                            <div className='SAsellerAuctionContentsValue'>
                                                <div>
                                                    <p id='SAsellerAuctionStartRemainTimeDiff'>{formattedRemainingTime}</p>
                                                    <p id='SAsellerAuctionStartRemainTime'>{formattedTimeText}</p>
                                                </div>
                                                <p>{formattedCurrentPrice}원</p>
                                                <p>{formattedStartingPrice}원</p>
                                                <p>{formattedBidIncrement}원</p>
                                                <p>{formattedParticipantCount}</p> {/* 참여자 수 표시 */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="SAsellerStreamingInfo">
                                    <p id='SAsellerStreamingNote'>* 경매 시간이 되면 자동으로 스트리밍을 시작합니다.</p>
                                    <p id='SAsellerStreamingNoteContent'>실시간 스트리밍을 시작하려면 스트리밍 소프트웨어에서 동영상 전송을 시작하세요.</p>
                                </div>
                                <SAsellerSteamingBox channelInfo={channelInfo} />
                            </div>

                            {/* Chat Section */}
                            <div className="SAsellerChatContainer">
                                <div className="SAsellerChatSection">
                                    <div>
                                        <ul>
                                            {webSocketProps.messages[auction?.auctionIndex]?.map((msg, index) => (
                                                <li key={index}>
                                                    <em>{formatTime(msg.sendTime)}</em> <strong
                                                        style={{ color: msg.color }}>{msg.senderNickname}:</strong> {msg.chatMessage}
                                                </li>
                                            )) || <li>메시지가 없습니다.</li>}
                                            <div ref={messagesEndRef} />
                                        </ul>
                                    </div>
                                </div>
                                <div className='SAsellerChatInputBox'>
                                    <input
                                        className='SAsellerChatInput'
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        placeholder="메시지를 입력하세요..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="SAsllerTotalBoxCloseButton" onClick={closeSellerPage}>
                        <img src='/images/white_close_button_icon.svg' alt="close button" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SellerAuctionScreen;
