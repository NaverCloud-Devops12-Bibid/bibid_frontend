import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAuctionData } from '../../apis/SpecialAuction/SAapis';
import { formatDateTime, formatAuctionTimeRange } from '../../util/utils';
import '../../css/SpecialAuction/SAlist.css';
import axios from 'axios';

// 팝업 및 화면 컴포넌트
import AlertPopup from './AlertPopup';
import BuyerWaitPopup from './BuyerWaitPopup';
import BuyerAuctionScreen from './BuyerAuctionScreen';
import SellerAuctionScreen from './SellerAuctionScreen';
import SellerInfoPopup from './SellerInfoPopup';
import BidConfirmationPopup from './BidConfirmationPopup';
import AuctionEndPopup from './AuctionEndPopup';
import SAitem from './SAitem';
import useAuctionWebSocket from '../../customHooks/useAuctionWebSocket';

function SAlist({ activeTab }) {
  const bucketName = process.env.REACT_APP_BUCKET_NAME;
  const dispatch = useDispatch();

  // 경매 데이터를 가져오는 디스패치 호출
  useEffect(() => {
    dispatch(getAuctionData(activeTab));
  }, [dispatch, activeTab]);

  const { liveAuctionList, blindAuctionList } = useSelector((state) => state.specialAuctionSlice);
  const loginMemberNickname = useSelector((state) => state.memberSlice.nickname);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [remainingTime, setRemainingTime] = useState('');
  const [hasAuctionEnded, setHasAuctionEnded] = useState(false);
  const [isChatClosed, setIsChatClosed] = useState(true);

  const webSocketProps = useAuctionWebSocket(selectedAuction?.auctionIndex, isChatClosed, setIsChatClosed);

  const {setCurrentPrices, setBidAmounts, disconnectWebSocket, participantCounts} = webSocketProps;

  const [popupState, setPopupState] = useState({
    showBuyerPopup: false,
    showSellerInfoPopup: false,
    showBidConfirmationPopup: false,
    showEndPopup: false,
    showBuyerAuctionScreen: false,
    showSellerAuctionScreen: false,
    showAlertPopup: false,
  });

  // 팝업 열기/닫기 함수
  const togglePopup = (popupName, value) => setPopupState((prev) => ({ ...prev, [popupName]: value }));

  // 옥션 리스트 렌더링 함수
  const renderAuctions = () => {
    const auctionList = activeTab === 'realtime' ? liveAuctionList : blindAuctionList;
    const auctionType = activeTab === 'realtime' ? '실시간 경매' : '블라인드 경매';

    return auctionList.length > 0 ? (
      <div className={`SAauctionList ${liveAuctionList.length >= 4 ? 'overflow' : ''}`}>
        {auctionList.map((auction, index) => {
          const thumbnailImage = auction.auctionImageDtoList.find((image) => image.thumbnail === true);
          const imageSrc = thumbnailImage
            ? `https://kr.object.ncloudstorage.com/${bucketName}/${thumbnailImage.filepath}${thumbnailImage.filename}`
            : '/images/defaultFileImg.png';

          return (
            <SAitem
              key={index}
              imageSrc={imageSrc}
              price={auction.startingPrice}
              title={auction.productName}
              auctionDate={formatDateTime(auction.startingLocalDateTime)}
              auctionTime={formatAuctionTimeRange(auction.startingLocalDateTime, auction.endingLocalDateTime)}
              linkText="바로가기"
              alertText="* 알림은 경매 시작 30분 전에 발송됩니다."
              handleGoButtonClick={() => handleGoButtonClick(auction)}
              handleAlertButtonClick={() => { togglePopup('showAlertPopup', true); handleAlertButtonClick(auction); }}
            />
          );
        })}
      </div>
    ) : (
      <div className="SAnoAuction">
        <p>현재 진행중인 {auctionType}가 없습니다.</p>
        <p>추후 진행하게 될 {auctionType}에서 만나요!</p>
      </div>
    );
  };

  // 경매 아이템 클릭 시 처리
  const handleGoButtonClick = (auction) => {
    setSelectedAuction(auction);
    setIsChatClosed(false);

    // 시작 가격 설정 (currentPrices와 bidAmounts 초기화)
    setCurrentPrices((prev) => ({
      ...prev,
      [auction.auctionIndex]: prev[auction.auctionIndex] || auction.startingPrice,
    }));
    setBidAmounts((prev) => ({
      ...prev,
      [auction.auctionIndex]: prev[auction.auctionIndex] || auction.startingPrice,
    }));

    const now = new Date();
    const auctionEndTime = new Date(auction.endingLocalDateTime);
    const userIsSeller = auction.memberNickname === loginMemberNickname;

    if (now > auctionEndTime) {
      setHasAuctionEnded(true);
      togglePopup('showEndPopup', true);
      return;
    }
    setHasAuctionEnded(false);

    if (userIsSeller) {
      togglePopup('showSellerAuctionScreen', true);
    } else {
      togglePopup(now < new Date(auction.startingLocalDateTime) ? 'showBuyerPopup' : 'showBuyerAuctionScreen', true);
    }
  };

  // 알림 신청 처리
  const handleAlertButtonClick = async (auction) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/specialAuction/registerAlarm/${auction.auctionIndex}`,
        {},
        { withCredentials: true }
      );

      alert(response.status === 200 ? "알림 신청이 완료되었습니다." : "알림 신청에 실패했습니다.");
    } catch (error) {
      alert(error.response?.status === 409 ? "이미 알림이 등록되어 있습니다." : "알림 신청에 실패했습니다.");
    }
  };

  // 경매 시간 확인 및 종료 처리
  useEffect(() => {
    if (selectedAuction) {
      const interval = setInterval(() => {
        const now = new Date();
        const auctionEndTime = new Date(selectedAuction.endingLocalDateTime);
        const timeDifference = auctionEndTime - now;

        setRemainingTime(timeDifference > 0 ? timeDifference : '');
        if (timeDifference <= 0) {
          setHasAuctionEnded(true);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [selectedAuction, hasAuctionEnded]);

  // 구매자 팝업 닫기 + 웹 소켓 연결 해제
  const closeBuyerPopupAndDisconnectWebSocket = () => {
    togglePopup('showBuyerAuctionScreen', false);
    setIsChatClosed(true);
    disconnectWebSocket();
  };

  // 판매자 팝업 닫기 + 웹 소켓 연결 해제
  const closeSellerPopupAndDisconnectWebSocket = () => {
    togglePopup('showSellerAuctionScreen', false);
    setIsChatClosed(true);
    disconnectWebSocket();
  };

  return (
    <div className="SAauctionList">
      {renderAuctions()}
      {/* 팝업 컴포넌트들 */}
      {popupState.showAlertPopup && selectedAuction && <AlertPopup auction={selectedAuction} handleClosePopup={() => togglePopup('showAlertPopup', false)} />}
      {popupState.showBuyerPopup && !popupState.showBuyerAuctionScreen && (
        <BuyerWaitPopup
          handleClosePopup={() => togglePopup('showBuyerPopup', false)}
          formattedParticipantCount={participantCounts[selectedAuction?.auctionIndex] || 0}
        />
      )}
      {popupState.showBuyerAuctionScreen && (
        <BuyerAuctionScreen
          webSocketProps={{ ...webSocketProps }}
          auction={selectedAuction}
          remainingTime={remainingTime}
          handleShowSellerInfo={() => togglePopup('showSellerInfoPopup', true)}
          openBidConfirmPopup={() => togglePopup('showBidConfirmationPopup', true)}
          closeBuyerPopup={closeBuyerPopupAndDisconnectWebSocket}
        />
      )}
      {popupState.showSellerAuctionScreen && (
        <SellerAuctionScreen
          webSocketProps={{ ...webSocketProps }}
          auction={selectedAuction}
          remainingTime={remainingTime}
          closeSellerPage={closeSellerPopupAndDisconnectWebSocket}
        />
      )}
      {popupState.showSellerInfoPopup && <SellerInfoPopup auction={selectedAuction} handleClosePopup={() => togglePopup('showSellerInfoPopup', false)} />}
      {popupState.showBidConfirmationPopup && (
        <BidConfirmationPopup auction={selectedAuction} webSocketProps={{ ...webSocketProps }} handleClosePopup={() => togglePopup('showBidConfirmationPopup', false)} />
      )}
      {popupState.showEndPopup && <AuctionEndPopup auction={selectedAuction} handleClosePopup={() => togglePopup('showEndPopup', false)} />}
    </div>
  );
}

export default SAlist;
