import React, { useEffect, useState } from 'react';
import '../../css/Mypage/Mypage.css';
import MypageMyAuctionCard from './MypageMyAuctionCard';
import axios from 'axios';

const MypageAuctionManagement = () => {
  const [myAuctions, setMyAuctions] = useState([]);
  const [selectedAuctionType, setSelectedAuctionType] = useState("일반 경매");

  // 내가 등록한 경매 목록 가져오기
  useEffect(() => {
    const fetchMyAuctions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_SERVER}/mypage/my-auctions`, {
          withCredentials: true
        });
        console.log(response.data.items);
        // 서버에서 가져온 경매 리스트를 startingLocalDateTime 기준으로 정렬
        const sortedAuctions = response.data.items.sort((a, b) => {
          return new Date(a.startingLocalDateTime) - new Date(b.startingLocalDateTime);
        });
        setMyAuctions(sortedAuctions); // 정렬된 경매 리스트 설정
      } catch (error) {
        console.error("Failed to fetch my auctions:", error);
      }
    };

    fetchMyAuctions();
  }, []);

  // 선택된 경매 타입에 따른 필터링된 경매 리스트
  const filteredAuctions = myAuctions.filter(
    auction => auction.auctionType === selectedAuctionType
  );

  const handleAuctionDelete = (auctionIndex) => {
    setMyAuctions(myAuctions.filter(auction => auction.auctionIndex !== auctionIndex));
  };

  return (
    <div className='Mypage_AuctionBoxContainer'>
      <div className='Mypage_UserInfoTitle'>내가 등록한 경매</div>
      <div className='Mypage_AuctionMainContainer'>
        <div className='Mypage_AuctionInfoContainer'>
          <div className='Mypage_AuctionCategory'>
            <div>카테고리 선택</div>
          </div>
          <div className='Mypage_AuctionCategoryBtnContainer'>
            <div
              className={`Mypage_AuctionCategoryBtn ${selectedAuctionType === "일반 경매" ? 'active' : ''}`}
              onClick={() => setSelectedAuctionType("일반 경매")}
            >
              일반 경매
            </div>
            <div
              className={`Mypage_AuctionCategoryBtn ${selectedAuctionType === "실시간 경매" ? 'active' : ''}`}
              onClick={() => setSelectedAuctionType("실시간 경매")}
            >
              실시간 경매
            </div>
          </div>
        </div>
        <div className='Mypage_blank' />
        <div className='Mypage_AuctionManagementBar'>
          <div className='Mypage_AuctionManagementImg'>대표사진</div>
          <div className='Mypage_AuctionManagementTitle'>제목</div>
          <div className='Mypage_AuctionManagementPrice'>현재가</div>
          <div className='Mypage_AuctionManagementBid'>입찰 단위</div>
          <div className='Mypage_AuctionManagementPeriod'>경매 기간</div>
          <div className='Mypage_AuctionManagementDeleteBtn'></div>
        </div>
        <div className='Mypage_AuctionManagementContinaer'>
          {filteredAuctions.length > 0 ? (
            filteredAuctions.map((auction) => (
              <MypageMyAuctionCard
                key={auction.auctionIndex}
                auction={auction}
                onDelete={handleAuctionDelete} // 삭제 핸들러 추가
              />
            ))
          ) : (
            <div className='Mypage_NoAuctionsMessage'>등록된 {selectedAuctionType}가 없습니다</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MypageAuctionManagement;