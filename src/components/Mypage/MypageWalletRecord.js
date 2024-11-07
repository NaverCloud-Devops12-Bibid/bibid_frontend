import React from 'react';
import '../../css/Mypage/Mypage.css';

// useType에 따른 아이콘 경로 설정
const iconMap = {
    '충전': '/images/chargeIcon.svg',
    '환전': '/images/exchangeIcon.svg',
    '판매': '/images/sellIcon.svg',
    '구매': '/images/buyIcon.svg',
    '입찰': '/images/bid_icon.svg',
    '반환': '/images/refund_icon.svg',
    '낙찰': '/images/success_auction_icon.svg'
  };

export const MypageWalletRecord = ({ record }) => {

  const iconSrc = iconMap[record.useType];  

  const isCharge = record.useType === '충전';
  const isExchange = record.useType === '환전';
  const isSale = record.useType === '판매';
  const isPurchase = record.useType === '구매';
  const isBid = record.useType === '입찰';
  const isRefund = record.useType === '반환';
  const isWinningBid = record.useType === '낙찰';

  const formatNumber = (number) => {
    return Number(number).toLocaleString();
  };

  // // 메시지 및 스타일
  // const message = isCharge
  //   ? `요청하신 ${formatNumber(record.changeAccount)}원 충전 처리가 완료되었습니다.`
  //   : isExchange
  //   ? `요청하신 ${formatNumber(record.changeAccount)}원 환전 처리가 완료되었습니다.`
  //   : isSale
  //   // ? `등록하신 "${record.productName} ${record.auctionType}" 상품이 판매 및 배송 처리가 완료되었습니다.`
  //   // : `"${record.productName}" 상품을 "${record.auctionType}"로 구매 및 배송 처리가 완료되었습니다.`;
  //   ? `등록하신 "${record.auctionType} ${record.auctionType}" 상품이 판매 및 배송 처리가 완료되었습니다.`
  //   : `${record.auctionType} - '${record.productName}'상품의 입찰이 완료되었습니다.`;

  const message = isCharge
  ? `요청하신 ${formatNumber(record.changeAccount)}원 충전 처리가 완료되었습니다.`
  : isExchange
  ? `요청하신 ${formatNumber(record.changeAccount)}원 환전 처리가 완료되었습니다.`
  : isSale
  ? `등록하신 "${record.productName} ${record.auctionType}" 상품이 판매 및 배송 처리가 완료되었습니다.`
  : isBid
  ? `${record.auctionType} - '${record.productName}' 상품의 입찰이 완료되었습니다.`
  : isRefund
  ? `'${record.productName}' 상품의 입찰 반환 처리가 완료되었습니다.`
  : isWinningBid
  ? `'${record.productName}' 상품의 낙찰이 완료되었습니다.`
  : `알 수 없는 거래 유형입니다.`;

    // const changeAmountColor = isCharge
    // ? 'blue'
    // : isExchange
    // ? 'red'
    // : isSale
    // ? 'blue'
    // : 'red';

    const changeAmountColor = isCharge
  ? 'blue'
  : isExchange
  ? 'red'
  : isSale
  ? 'blue'
  : isBid || isWinningBid
  ? 'red'
  : isRefund
  ? 'blue'
  : 'red';

  const balanceLabel = isCharge || isSale || isRefund ? '총 잔액' : '나머지 금액';
  const balanceDisplay = `₩ ${formatNumber(record.afterBalance)}`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  return (
    <div className='Mypage_WalletCard'>
      <div className='Mypage_WalletCardLeft'>
        <img src={iconSrc} alt={`${record.useType} icon`} className='wallet-icon' />
      </div>
      <div className='Mypage_WalletCardRight'>
        <div className='Mypage_WalletLine'>
          <div className='Mypage_WalletCardLine1'>
            <div>
              <h3>{record.useType}</h3>
            </div>
            <div>{formatDate(record.createdTime)}</div>
          </div>
          <div className='Mypage_WalletCardLine2'>
            <div className='Mypage_WalletCardText'>{message}</div>
          </div>
          <div className='Mypage_WalletCardLine3'>
            <div>
              총 {formatNumber(record.beforeBalance)} 원에서{" "}
              <span style={{ color: changeAmountColor, fontWeight: "bold" }}>
                {formatNumber(record.changeAccount)} 원 {isCharge || isSale ? "추가" : "감소"}
              </span>
            </div>
            <div style={{ fontWeight: 'bold', marginTop: '5px' }}>
              {balanceLabel}: {balanceDisplay}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
