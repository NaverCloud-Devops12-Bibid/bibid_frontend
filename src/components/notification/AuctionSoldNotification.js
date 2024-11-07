import React from 'react';

const AuctionSoldNotification = ({ notification }) => {
  const handleClick = () => {
    window.location.href = `${process.env.REACT_APP_FRONT_SERVER}/category-itemdetail/${notification.referenceIndex}`;
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      <p className="ALnotificationTitle" style={{ color: 'red' }}>
        {notification.title}
      </p>
      <p>
        {notification.auctionType} {notification.productName} 이/(가) 낙찰 되었습니다.
      </p>
      <p>낙찰자: {notification.winnerNickname} </p>
      <p>낙찰 금액: {notification.winningBid} 원</p>
      <p>{notification.timestamp}</p>
    </div>
  );
};

export default AuctionSoldNotification;
