import React, { useEffect, useState } from 'react'
import '../../css/Mypage/Mypage.css';
import MypageAuctionCard from './MypageAuctionCard';
import axios from 'axios';

const MypageProfileBox = () => {

  const [biddedAuctions, setBiddedAuctions] = useState([]);
  const [selectedAuctionType, setSelectedAuctionType] = useState("일반 경매"); // 기본값: 일반 경매


  // API 호출
  useEffect(() => {
    const fetchBiddedAuctions = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_SERVER}/mypage/bidded-auctions`, {
                withCredentials: true // withCredentials 설정
            });
            setBiddedAuctions(response.data.items); // 서버에서 가져온 입찰 경매 리스트 설정
            console.log(response.data.items);
        } catch (error) {
            console.error("Failed to fetch bidded auctions:", error);
        }
    };
    
    fetchBiddedAuctions();
  }, []);

  // 선택된 경매 타입에 따라 필터링된 경매 리스트
  const filteredAuctions = biddedAuctions.filter(
    auction => auction.auctionType === selectedAuctionType
  );

  return (
    <div className='Mypage_AuctionBoxContainer'>
      <div className='Mypage_UserInfoTitle'>참여중인 경매</div>
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
          <div className='Mypage_blank'/>
          <div className='Mypage_AuctionCardContinaer'>
            {filteredAuctions.length > 0 ? (
              filteredAuctions.map((auction) => (
                <MypageAuctionCard
                  key={auction.auctionIndex}
                  auction={auction}
                />
              ))
            ) : (
              <div className='Mypage_NoAuctionsMessage'>입찰 중인 {selectedAuctionType}가 없습니다</div>
            )}
            </div>
        </div>
    </div>
  )
}

export default MypageProfileBox