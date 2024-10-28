import React, { useState, useEffect, useRef } from 'react';
import { getFormattedRemainingTime } from '../../util/utils';
import axios from 'axios';
import VideoSection from './VideoSection';
import Draggable from 'react-draggable'; // react-draggable import

function BuyerAuctionScreen({ 
  webSocketProps, auction, remainingTime, closeBuyerPopup, handleShowSellerInfo, openBidConfirmPopup
}) {

  const [streamingUrl, setStreamingUrl] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [isBidDisabled, setIsBidDisabled] = useState(false); // 입찰 버튼 비활성화 상태 관리

  useEffect(() => {
    if (auction.auctionStatus === '방송중') {
      setIsBidDisabled(false);
    } else {
      setIsBidDisabled(true);
    }
  }, [auction]);

  useEffect(() => {
    const fetchChannelInfo = async () => {
      try {

        const response = await axios.get(`http://localhost:8080/specialAuction/channelInfo/${auction.auctionIndex}`, { withCredentials: true });
        const channelInfoDto = response.data.item; 

        setStreamingUrl(channelInfoDto.serviceUrlList);

      } catch (error) {
        console.error('Error fetching streaming info:', error);
      }
    };
   
    fetchChannelInfo();
  }, [auction.auctionIndex]);



  const [isSoundOn, setIsSoundOn] = useState(true); // 사운드 상태 관리
  const [showAuctionInfo, setShowAuctionInfo] = useState(false);
  const [showSellerInfo, setShowSellerInfo] = useState(false);
  const [showChatContainer, setShowChatContainer] = useState(false);

  const { messages, inputMessage, setInputMessage, sendMessage, currentPrices, bidAmounts, setBidAmounts, handleBidSubmits, participantCount } = webSocketProps;
  
  const messagesEndRef = useRef(null);

  const formattedCurrentPrice = (currentPrices[auction?.auctionIndex] || auction.startingPrice)?.toLocaleString();

  const auctionEndTime = new Date(auction.endingLocalDateTime);
  const formattedAuctionEndTime = auctionEndTime.toLocaleString('ko-KR'); // 한국어 로케일 적용

  const formattedBidAmount = (bidAmounts[auction?.auctionIndex] || auction.startingPrice)?.toLocaleString();
  const formattedBidIncrement = auction.bidIncrement?.toLocaleString() || '0'; // 입찰 단위 기본값 처리

  // 구매수수료 계산 (10% 후 1,000단위 내림)
  const calculateFee = (price) => Math.floor((price * 0.1) / 1000) * 1000;

  // 예상 구매가 계산
  const purchaseFee = calculateFee(currentPrices[auction?.auctionIndex] || auction.startingPrice);
  const expectedPurchasePrice = (currentPrices[auction?.auctionIndex] || auction.startingPrice) + purchaseFee;

  const formattedExpectedPurchasePrice = expectedPurchasePrice?.toLocaleString() || '0';
  const formattedPurchaseFee = purchaseFee?.toLocaleString() || '0';

  // 특정 auctionIndex의 참여자 수 렌더링 예시
  const formattedParticipantCount = participantCount[auction.auctionIndex] || 0; // 경매 ID에 해당하는 참여자 수를 가져옴, 없으면 0

  // 입찰가 증가 함수
  const handleBidIncrease = () => {
    webSocketProps.setBidAmounts((prev) => ({
      ...prev,
      [auction.auctionIndex]: (prev[auction.auctionIndex] || auction.startingPrice) + auction.bidIncrement,
    }));
  }
  
  // 입찰가 감소 함수
  const handleBidDecrease = () => {
    webSocketProps.setBidAmounts((prev) => ({
      ...prev,
      [auction.auctionIndex]: Math.max((prev[auction.auctionIndex] || auction.startingPrice) - auction.bidIncrement, auction.startingPrice),
    }));
  };

  const formattedRemainingTime = getFormattedRemainingTime(remainingTime);

  // 메시지를 전송하는 핸들러
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };
  
  // 메시지 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 사운드 아이콘 클릭 핸들러
  const handleSoundToggle = () => {
    setIsSoundOn((prev) => !prev); // 사운드 상태를 토글
  };

  // 각 섹션의 가시성 토글 함수
  const toggleAuctionInfo = () => setShowAuctionInfo((prev) => !prev);
  const toggleSellerInfo = () => setShowSellerInfo((prev) => !prev);
  const toggleChatContainer = () => setShowChatContainer((prev) => !prev);

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

  return (
    <div className="SAoverlay">
      <div className='SAtotalPopup'>
        <div className="SAbuyerPopup">
          <div className="SAliveAuctionHeader">
            <h3>{isLive ? 'Live On' : 'Live Off'}</h3>
            <h1>구매자</h1>
            <div className="SAviewerCount">
              <img src='/images/people_icon.svg' alt="Viewer Count" />
              {/* <p>{viewerCount.toLocaleString()}</p>  */}
              <p>{formattedParticipantCount}</p> {/* 참여자 수 표시 */}
            </div>
          </div>
          <div className='SAauctionContainer'>
            <div className="SAauctioncontentBox">
              {/* Product Image Section */}
              <div className="SAproductSection">
                <div className='SAliveStreamingHeader'>
                  <div className='SAliveStreamingButtonBox'>
                    <div className='SAliveStreamingButton' onClick={toggleAuctionInfo}>
                      <img src='/images/SA_bid_icon.svg'></img>
                    </div>
                    <div className='SAliveStreamingButton' onClick={toggleSellerInfo}>
                      <img src='/images/SA_seller_info_icon.svg'></img>
                    </div>
                    <div className='SAliveStreamingButton' onClick={toggleChatContainer}>
                      <img src='/images/SA_live_chat_icon.svg'></img>
                    </div>
                  </div>
                  <div className='SAproductTitle'>
                    <h2>{auction.productName}</h2>
                  </div>
                </div>
                {/*streaming div*/}
                <div>
                  {/* <img src="/images/streaming_img.png" alt="Product" className="SAsellerProductImage" /> */}
                  <VideoSection streamingUrl = {streamingUrl}></VideoSection>
                </div>
              </div>

              {/* Product Information Section */}
              <div className="SAproductInfo">
              {showAuctionInfo && (
                <Draggable defaultPosition={{x: 0, y: 0}} bounds="body">
                  <div className="SAauctionInfoBox">
                    <div className='SAminiminzeButtonBox'>
                      <button className='SAminiminzeButton' onClick={toggleAuctionInfo}>
                        <img src='/images/minimize_icon.svg'></img>
                      </button>
                    </div>
                    <div className="SAauctionInfo">
                      <div className='SAauctionInfoTitle'>
                        <h3>현재가:</h3>
                        <p>남은시간:</p>
                        <p>경매번호:</p>
                        <p>입찰단위:</p>
                        <p>희망 입찰가:</p>
                        <p>예상 구매가:</p>
                      </div>
                      <div className='SAauctionInfoContents'>
                        <h3>{formattedCurrentPrice}원</h3>
                        <div className='SAremainingTime'>
                          <p>{formattedRemainingTime}</p>
                          <p id='SArealEndTime'>({formattedAuctionEndTime})</p>
                        </div>
                        <p>{auction.auctionIndex}</p>
                        <p>{formattedBidIncrement}원</p>
                        <div className='SAbidBox'>
                          <input type="text" id="SAbidInput" value={formattedBidAmount} readOnly /> <p>원</p>
                          <div className='SAbidButtonBox'>
                            <button onClick={handleBidIncrease} className="SAbidButton">+</button>
                            <button onClick={handleBidDecrease} className="SAbidButton">-</button>
                          </div>
                        </div>
                        <div className='SAexpectedPurchase'>
                          <p>{formattedExpectedPurchasePrice}원</p>
                          <p id='SAexpectedPurchaseCalc'>({formattedCurrentPrice}원 + 구매수수료 {formattedPurchaseFee}원)</p>
                        </div>
                      </div>
                    </div>
                    <div className='SAbidSubmitButtonBox'>
                      {/* <button className="SAbidSubmitButton" onClick={openBidConfirmPopup} disabled={isBidDisabled}>입찰하기</button> */}
                      <button className="SAbidSubmitButton" onClick={openBidConfirmPopup}>입찰하기</button>
                    </div>
                  </div>
                </Draggable>
              )}

              {showSellerInfo && (
                <Draggable defaultPosition={{x: 0, y: 0}} bounds="body">
                  <div className="SAsellerInfo">
                    <div className='SAminiminzeButtonBox'>
                      <button className='SAminiminzeButton' onClick={toggleSellerInfo}>
                        <img src='/images/minimize_icon.svg'></img>
                      </button>
                    </div>
                    <div className='SAsellerProfile'>
                      <img src='/images/seller_img.svg' alt="Seller Profile" />
                      <div>
                        <h3>{auction.memberNickname}</h3>
                        <p>Seller</p>
                      </div>
                    </div>
                    <div className='SAsellerMainInfo'>
                      <div>
                        <p>판매 건수</p>
                        <p>186</p>
                      </div>
                      <div>
                        <p>총 평가 점수</p>
                        <p>4.9</p>
                      </div>
                      <div>
                        <p>주 판매 목록</p>
                        <p>신발</p>
                      </div>
                    </div>
                    <div className='SAsellerEvaluation'>
                      <div className='SAsellerEvaluationDetail'>
                        <p>상품 설명</p>
                        <p>배송 속도</p>
                        <p>응답 속도</p>
                        <p>친절도</p>
                      </div>
                      <div className='SAsellerEvaluationDetail'>
                        <progress className='SAprogress' value="100" min="0" max="100"></progress>
                        <progress className='SAprogress' value="90" min="0" max="100"></progress>
                        <progress className='SAprogress' value="100" min="0" max="100"></progress>
                        <progress className='SAprogress' value="100" min="0" max="100"></progress>
                      </div>
                      <div className='SAsellerEvaluationDetail'>
                        <p>5.0</p>
                        <p>4.8</p>
                        <p>5.0</p>
                        <p>5.0</p>
                      </div>
                    </div>
                    <div className='SAmoreInfoButtonBox'>
                      <button className="SAmoreInfoButton" onClick={handleShowSellerInfo}>판매자 정보 더보기</button>
                    </div>
                  </div>
                </Draggable>
              )}

              </div>
            </div>

            {/* Chat Section */}
            {showChatContainer && (
              <Draggable defaultPosition={{x: 0, y: 0}} bounds="body">
                <div className="SAbuyerChatContainer">
                  <div className='SAchatMiniminzeButtonBox'>
                      <button className='SAminiminzeButton' onClick={toggleChatContainer}>
                        <img src='/images/minimize_icon.svg'></img>
                      </button>
                  </div>
                  <div className="SAbuyerChatSection">
                    <div>
                      <ul>
                        {webSocketProps.messages[auction?.auctionIndex]?.map((msg, index) => (
                          <li key={index}>
                            <em>{formatTime(msg.sendTime)}</em> <strong style={{ color: msg.color }}>{msg.senderNickname}:</strong> {msg.chatMessage}</li>
                        )) || <li>메시지가 없습니다.</li>}
                        <div ref={messagesEndRef} />
                      </ul>
                    </div>
                  </div>
                  <div className='SAbuyerChatInputBox'>
                    <input
                      className='SAbuyerChatInput'
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="메시지를 입력하세요..."
                    />
                  </div>
                </div>
              </Draggable>
            )}

          </div>    
        </div>
        <button className="SAbuyerTotalBoxCloseButton" onClick={closeBuyerPopup}>
          <img src='/images/white_close_button_icon.svg' alt="close button" />
        </button>
      </div>
    </div>
  );
}

export default BuyerAuctionScreen;
