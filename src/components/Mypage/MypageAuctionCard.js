import React from 'react'
import '../../css/Mypage/Mypage.css';
import MypageAuctionProcessLine from './MypageAuctionProcessLine';
import axios from 'axios';

const MypageAuctionCard = ({auction}) => {

  const bucketName = process.env.REACT_APP_BUCKET_NAME;

  const thumbnailImage = auction.auctionImageDtoList.find((image) => image.thumbnail === true);

  const imageSrc = thumbnailImage
    ? `https://kr.object.ncloudstorage.com/${bucketName}/${thumbnailImage.filepath}${thumbnailImage.filename}`
    : '/images/defaultFileImg.png';


  const lastBidAmount = auction.auctionInfoDtoList && auction.auctionInfoDtoList.length > 0
    ? auction.auctionInfoDtoList[auction.auctionInfoDtoList.length - 1].bidAmount
    : 0;

     // 구매 확정 처리 함수
  const handleConfirmPurchase = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_SERVER}/account/confirm`, // API 경로
        auction, // auction 객체 전송
        { withCredentials: true } // 인증 정보 포함
      );
      if (response.status === 200) {
        alert('구매가 성공적으로 확정되었습니다.');
      }
    } catch (error) {
      console.error('구매 확정 중 오류가 발생했습니다:', error);
      alert('구매 확정 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className='Mypage_AuctionCard'>
      <div className='Mypage_AuctionProcess'>
        <div className='Mypage_AuctionCardType'>{auction.auctionType}</div>
        <MypageAuctionProcessLine auctionStatus={auction.auctionStatus}/>
        <div className='Mypage_AuctionCardBtnCategory'>
            <div className='Mypage_AuctionCardBtn'>배송 조회</div>
        </div>
      </div>
      <div className='Mypage_AuctionContentBox'>
        <div className='Mypage_AuctionContentImgBox'>
          <img
              src={imageSrc}
              alt="Auction Thumbnail"
              className="Mypage_AuctionManagementCardImg"
            />
        </div>
        <div className='Mypage_AuctionContentDetail'>
            <div className='Mypage_AuctionContentDetailTitle'> 물품 이름 {auction.productName}</div>
            <div className='Mypage_AuctionContentDetailContainer'>
                <div className='Mypage_AuctionContentPrice'>
                    <div className='Mypage_AuctionContenttitle'>구매금액</div>
                    <div className='Mypage_AuctionContenttext'>{lastBidAmount.toLocaleString()} 원</div>
                </div>  
                <div className='Mypage_AuctionContentNumber'>
                    <div className='Mypage_AuctionContenttitle'>경매번호</div>
                    <div className='Mypage_AuctionContenttext'>{auction.auctionIndex}</div>
                </div>
                <div className='Mypage_AuctionContentSeller'>
                    <div className='Mypage_AuctionContenttitle'>판매자명</div>
                    <div className='Mypage_AuctionContenttext'>{auction.memberNickname} 님</div>
                </div>
            </div>
        </div>
        <div className='Mypage_AuctionContentBtnCategory'>
            <div className='Mypage_AuctionContentBtnBox'>
                <div className='Mypage_AuctionCardBtn' onClick = {handleConfirmPurchase}>구매 확정</div>
                <div className='Mypage_AuctionCardBtn'>거래 취소</div>
            </div>
        </div>
      </div>
      <div className='Mypage_AuctionAlert'>
        <div>*물품수령 후 의도적으로 수취완료를 누르지 않으면 형사처벌의 대상이 될 수 있습니다.*</div>
      </div>
    </div>
  )
}

export default MypageAuctionCard