import React from 'react'
import '../../css/Mypage/Mypage.css';
import MypageAuctionProcessLine from './MypageAuctionProcessLine';

const MypageAuctionCard = ({auction}) => {

  const bucketName = process.env.REACT_APP_BUCKET_NAME;

  const thumbnailImage = auction.auctionImageDtoList.find((image) => image.thumbnail === true);

  const imageSrc = thumbnailImage
    ? `https://kr.object.ncloudstorage.com/${bucketName}/${thumbnailImage.filepath}${thumbnailImage.filename}`
    : '/images/defaultFileImg.png';


  const lastBidAmount = auction.auctionInfoDtoList && auction.auctionInfoDtoList.length > 0
    ? auction.auctionInfoDtoList[auction.auctionInfoDtoList.length - 1].bidAmount
    : 0;

  return (
    <div className='Mypage_AuctionCard'>
      <div className='Mypage_AuctionProcess'>
        <div className='Mypage_AuctionCardType'>
          <p>{auction.auctionType}</p>
        </div>
        <MypageAuctionProcessLine auctionStatus={auction.auctionStatus}/>
        <div className='Mypage_AuctionCardBtnCategory'>
            <button className='Mypage_AuctionCardBtn'>
              <p>배송 조회</p>
            </button>
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
            <div className='Mypage_AuctionContentDetailTitle'>
              <h3>경매 제목 : {auction.productName}</h3>
            </div>
            <div className='Mypage_AuctionContentDetailContainer'>
              <div className='Mypage_AuctionContentPrice'>
                  <div className='Mypage_AuctionContenttitle'>
                    <p>구매금액</p>
                  </div>
                  <div className='Mypage_AuctionContenttext'>
                    <p>{lastBidAmount.toLocaleString()} 원</p>
                  </div>
              </div>  
              <div className='Mypage_AuctionContentNumber'>
                  <div className='Mypage_AuctionContenttitle'>
                    <p>경매번호</p>
                  </div>
                  <div className='Mypage_AuctionContenttext'>
                    <p>{auction.auctionIndex}</p>
                  </div>
              </div>
              <div className='Mypage_AuctionContentSeller'>
                  <div className='Mypage_AuctionContenttitle'>
                    <p>판매자명</p>
                  </div>
                  <div className='Mypage_AuctionContenttext'>
                    <p>{auction.memberNickname} 님</p>
                  </div>
              </div>
            </div>
        </div>
        <div className='Mypage_AuctionContentBtnCategory'>
          <div className='Mypage_AuctionContentBtnBox'>
            <button className='Mypage_AuctionCardBtn'>
              <p>구매 확정</p>
            </button>
            <button className='Mypage_AuctionCardBtn'>
              <p>거래 취소</p>
            </button>
          </div>
        </div>
      </div>
      <div className='Mypage_AuctionAlert'>
        <div>
          <p>*물품수령 후 의도적으로 수취완료를 누르지 않으면 형사처벌의 대상이 될 수 있습니다.</p>
        </div>
      </div>
    </div>
  )
}

export default MypageAuctionCard