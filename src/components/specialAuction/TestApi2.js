import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { chargeAccount, exchangeAccount, buyAuction, sellAuction } from '../../apis/member/memberApis'

const TestApi2 = () => {
  const dispatch = useDispatch();
  const [response, setResponse] = useState(null);

  // API 호출 함수들
  const handleChargeAccount = async () => {
    const dummyData = {
      changeAccount: '5000', // 충전 금액
      useType: '충전'
    };

    // dispatch로 chargeAccount 액션 호출
    const resultAction = await dispatch(chargeAccount(dummyData));
    if (chargeAccount.fulfilled.match(resultAction)) {
      setResponse(resultAction.payload);
      console.log('Charge Account 성공:', resultAction.payload);
    } else {
      setResponse(`Error: ${resultAction.error.message}`);
    }
  };

  const handleExchangeAccount = async () => {
    const dummyData = {
      changeAccount: '2000', // 환전 금액
      useType: '환전'
    };

    const resultAction = await dispatch(exchangeAccount(dummyData));
    if (exchangeAccount.fulfilled.match(resultAction)) {
      setResponse(resultAction.payload);
      console.log('Exchange Account 성공:', resultAction.payload);
    } else {
      setResponse(`Error: ${resultAction.error.message}`);
    }
  };

  const handleBuyAuction = async () => {
    const dummyData = {
      changeAccount: '3000', // 구매 금액
      auctionIndex: 1, // 구매할 경매의 ID
      useType: '구매'
    };

    const resultAction = await dispatch(buyAuction(dummyData));
    if (buyAuction.fulfilled.match(resultAction)) {
      setResponse(resultAction.payload);
      console.log('Buy Auction 성공:', resultAction.payload);
    } else {
      setResponse(`Error: ${resultAction.error.message}`);
    }
  };

  const handleSellAuction = async () => {
    const dummyData = {
      changeAccount: '1500', // 판매 금액
      auctionIndex: 1, // 판매할 경매의 ID
      useType: '판매'
    };

    const resultAction = await dispatch(sellAuction(dummyData));
    if (sellAuction.fulfilled.match(resultAction)) {
      setResponse(resultAction.payload);
      console.log('Sell Auction 성공:', resultAction.payload);
    } else {
      setResponse(`Error: ${resultAction.error.message}`);
    }
  };

  return (
    <div>
      <h1>Account API Test</h1>
      <button onClick={handleChargeAccount}>Charge Account</button>
      <button onClick={handleExchangeAccount}>Exchange Account</button>
      <button onClick={handleBuyAuction}>Buy Auction</button>
      <button onClick={handleSellAuction}>Sell Auction</button>

      {response && <div><h3>Response:</h3><pre>{JSON.stringify(response, null, 2)}</pre></div>}
    </div>
  );
};

export default TestApi2;
