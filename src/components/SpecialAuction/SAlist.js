  import React, { useState, useEffect } from 'react';
  import { useSelector, useDispatch } from 'react-redux';
  import { getAuctionData } from '../../apis/SpecialAuction/SAapis';
  import {   formatDateTime , formatAuctionTimeRange  } from '../../util/utils';
  import useWebSocket from '../../customHooks/useAuctionWebSocket';
  import '../../css/SpecialAuction/SAlist.css';

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
    }, [dispatch]);

    const { liveAuctionList, blindAuctionList } = useSelector((state) => state.specialAuctionSlice);
    const loginMemberNickname = useSelector((state) => state.memberSlice.nickname);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [remainingTime, setRemainingTime] = useState('');
    const [hasAuctionEnded, setHasAuctionEnded] = useState(false);
    const [isChatClosed, setIsChatClosed] = useState(true);

    const webSocketProps = useAuctionWebSocket(selectedAuction?.auctionIndex, isChatClosed, setIsChatClosed);
    const {disconnectWebSocket} = webSocketProps;

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
        <div className="SAauctionList">
          {auctionList.map((auction, index) => {
            const thumbnailImage = auction.auctionImageDtoList.find((image) => image.thumbnail === true);
            const imageSrc = thumbnailImage
              ? `https://kr.object.ncloudstorage.com/${bucketName}/${thumbnailImage.filepath}${thumbnailImage.filename}`
              : '/images/defaultFileImg.png';

            return (
              <SAitem
                key={index}
                imageSrc={imageSrc}
                title={auction.productName}
                linkText={auction.auctionStatus}
                auctionDate={formatDateTime(auction.startingLocalDateTime)}
                auctionTime={formatAuctionTimeRange(auction.startingLocalDateTime, auction.endingLocalDateTime)}
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


    const handleGoButtonClick = (auction) => {
      setSelectedAuction(auction);
      console.log("Selected Auction: ", auction);
      setIsChatClosed(false);

      // currentPrices에 값이 없을 때만 시작 가격 설정
      webSocketProps.setCurrentPrices((prev) => ({
        ...prev,
        [auction.auctionIndex]: prev[auction.auctionIndex] ||
          (auction.auctionInfoDtoList?.length > 0
            ? auction.auctionInfoDtoList[auction.auctionInfoDtoList.length - 1].bidAmount
            : auction.startingPrice)
      }));
      // bidAmounts에 값이 없을 때만 시작 가격 설정
      webSocketProps.setBidAmounts((prev) => ({
        ...prev,
        [auction.auctionIndex]: prev[auction.auctionIndex] ||
          (auction.auctionInfoDtoList?.length > 0
            ? auction.auctionInfoDtoList[auction.auctionInfoDtoList.length - 1].bidAmount
            : auction.startingPrice)
      }));

      const now = new Date();
      const auctionStartTime = new Date(auction.startingLocalDateTime);
      const auctionEndTime = new Date(auction.endingLocalDateTime);
      const userIsSeller = auction.memberNickname === loginMemberNickname;
    
      // 경매 종료 여부 확인 후 상태 업데이트
      if (now > auctionEndTime) {
        setHasAuctionEnded(true);
        togglePopup('showEndPopup', true); // 경매 종료 팝업
        return;
      }
      setHasAuctionEnded(false); // 경매가 아직 종료되지 않았으므로 false로 설정

      console.log("auction.memberNickname: ", auction.memberNickname);
      console.log("loginMemberNickname: ", loginMemberNickname);

      if (userIsSeller) {
        togglePopup('showSellerAuctionScreen', true); // 판매자 경매 화면 열기
      } else {
        if (now < auctionStartTime) {
          togglePopup('showBuyerPopup', true); // 구매자 대기 팝업
        } else {
          togglePopup('showBuyerAuctionScreen', true); // 구매자 경매 화면 열기
        }
      }
    };

    const handleAlertButtonClick = (auction) => {
      setSelectedAuction(auction);
    };

    useEffect(() => {
      if (selectedAuction) {
        const interval = setInterval(() => {
          const now = new Date();
          const auctionStartTime = new Date(selectedAuction.startingLocalDateTime);
          const auctionEndTime = new Date(selectedAuction.endingLocalDateTime);
    
          let timeDifference;

          if (now < auctionStartTime) {
            // 경매 시작 전
            timeDifference = auctionStartTime - now;
            setRemainingTime(timeDifference);
          } else if (now >= auctionStartTime && now < auctionEndTime) {
            // 경매 진행 중
            timeDifference = auctionEndTime - now;
            setRemainingTime(timeDifference);

             // 경매가 시작되면 BuyerWaitPopup을 닫고 BuyerAuctionScreen으로 전환
              if (!popupState.showBuyerAuctionScreen && popupState.showBuyerPopup) {
                togglePopup('showBuyerPopup', false); // BuyerWaitPopup 닫기
                togglePopup('showBuyerAuctionScreen', true); // BuyerAuctionScreen 열기
              }
          } else {
            // 경매 종료 후
            timeDifference = -1;
            setRemainingTime(timeDifference);
            setHasAuctionEnded(true);
            clearInterval(interval); // 경매 종료 후 타이머 정리
          }
        }, 1000);
    
        return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
      }
    }, [selectedAuction]);
  

    // 구매자 팝업 닫기 + 웹 소켓 연결 해제
    const closeBuyerPopupAnddisconnectWebSocket = ()  => {
      togglePopup('showBuyerAuctionScreen', false);
      setIsChatClosed(true);
      disconnectWebSocket();
    }

    // 판매자 팝업 닫기 + 웹 소켓 연결 해제
    const closeSellerPopupAnddisconnectWebSocket = ()  => {
      togglePopup('showSellerAuctionScreen', false);
      setIsChatClosed(true);
      disconnectWebSocket();
    }

    return (
      <div className="SAauctionList">
        {renderAuctions()}
        {/* 팝업 컴포넌트들 */}
        {popupState.showAlertPopup && selectedAuction && <AlertPopup auction={selectedAuction} handleClosePopup={() => togglePopup('showAlertPopup', false)} />}
        {popupState.showBuyerPopup && !popupState.showBuyerAuctionScreen && <BuyerWaitPopup handleClosePopup={() => togglePopup('showBuyerPopup', false)} />}
        {popupState.showBuyerAuctionScreen && <BuyerAuctionScreen  webSocketProps = {webSocketProps} auction={selectedAuction} remainingTime={remainingTime} handleShowSellerInfo={() => togglePopup('showSellerInfoPopup', true) } openBidConfirmPopup={ () => togglePopup('showBidConfirmationPopup', true) } closeBuyerPopup={closeBuyerPopupAnddisconnectWebSocket} />}
        {popupState.showSellerAuctionScreen && <SellerAuctionScreen  webSocketProps = {webSocketProps} auction={selectedAuction} remainingTime={remainingTime} closeSellerPage={closeSellerPopupAnddisconnectWebSocket} />}
        {popupState.showSellerInfoPopup && <SellerInfoPopup auction={selectedAuction} handleClosePopup={() => togglePopup('showSellerInfoPopup', false)} />}
        {popupState.showBidConfirmationPopup && <BidConfirmationPopup auction={selectedAuction} webSocketProps = {webSocketProps} handleClosePopup={() => togglePopup('showBidConfirmationPopup', false)} />}
        {popupState.showEndPopup && <AuctionEndPopup auction={selectedAuction} handleClosePopup={() => togglePopup('showEndPopup', false) } />}
      </div>
    );
  }

  export default SAlist;
