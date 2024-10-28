import React, { useState } from 'react';
import '../../css/CategoryItemDetail.css';
import CatItDetTab from './CatItDetTab';

const CatItDetInfo = ({ auctionNumber, auctionItem, auctionImages }) => {

  console.log("== CatItDetInfo 실행 ==")
  
  const bucketName = process.env.REACT_APP_BUCKET_NAME;
  const formattedBucketName = bucketName.slice(0, 7) + '-' + bucketName.slice(7);
  const prePath = "https://kr.object.ncloudstorage.com/" + formattedBucketName;
  
  if (!auctionItem) {
    return <div>Loading...</div>; // auctionItem + auctionImg 가 없을 때 로딩 메시지를 출력
  }

  const startingLocalDateTime = (auctionItem.startingLocalDateTime);
  const endingLocalDateTime = (auctionItem.endingLocalDateTime);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-11을 1-12로 변환
    const day = String(date.getDate()).padStart(2, '0');
    const minute = String(date.getMinutes());
    return `${year}년 ${month}월 ${day}일 ${minute}분`;
  };

  return (
    <div className="CID-item-info" id='CID-item-info'>
      <CatItDetTab/>
      <div className="CID-info-box">
        <h3>상품 설명</h3>
        <p> {auctionItem.productDescription}</p>
        <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
          <br/>
          <li>경매 시작 예정일 : {formatDate(startingLocalDateTime)} 시작</li>
          <br/>
          <li>경매 마감 예정일 : {formatDate(endingLocalDateTime)} 종료</li>
          <br/>
          <li style={{ listStyle: 'square', color: '#007bff' }}>연령제한 주의</li>
        </ul>
        <div className="CID-item-img-container">
          {auctionImages.map((imageUrl, index) => (
                <img key={index} src={prePath + imageUrl} alt={`Item ${index}`}/>
                ))}
        </div>
      </div>
    </div>
  );

};

export default CatItDetInfo;
