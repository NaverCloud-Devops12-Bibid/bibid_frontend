import React, { useState } from 'react';
import axios from 'axios';

const TestApi3 = () => {
  const [memberIndex, setMemberIndex] = useState('');
  const [auctionIndex, setAuctionIndex] = useState('');
  const [senderIndex, setSenderIndex] = useState('');
  const [receiverIndex, setReceiverIndex] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const sendNotification = async (endpoint, data) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_SERVER}/api/notifications/${endpoint}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      setResponse(response.data);
      setError(null);
      console.log(`${endpoint} 알림 성공:`, response.data);
    } catch (err) {
      console.error(`${endpoint} 알림 실패:`, err);
      setError(`${endpoint} 알림 전송 실패`);
      setResponse(null);
    }
  };

  return (
    <div>
      <h1>Notification API Test</h1>
      
      <div>
        <label>Member Index: </label>
        <input
          type="number"
          value={memberIndex}
          onChange={(e) => setMemberIndex(e.target.value)}
          placeholder="멤버 인덱스 입력"
        />
      </div>
      <div>
        <label>Auction Index: </label>
        <input
          type="number"
          value={auctionIndex}
          onChange={(e) => setAuctionIndex(e.target.value)}
          placeholder="경매 인덱스 입력"
        />
      </div>
      <div>
        <label>Sender Index: </label>
        <input
          type="number"
          value={senderIndex}
          onChange={(e) => setSenderIndex(e.target.value)}
          placeholder="보낸 사람 인덱스 입력"
        />
      </div>
      <div>
        <label>Receiver Index: </label>
        <input
          type="number"
          value={receiverIndex}
          onChange={(e) => setReceiverIndex(e.target.value)}
          placeholder="받는 사람 인덱스 입력"
        />
      </div>
      <div>
        <label>Title: </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목 입력"
        />
      </div>
      <div>
        <label>Content: </label>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용 입력"
        />
      </div>

      <button onClick={() => sendNotification('auctionStart', { memberIndex: Number(memberIndex), auctionIndex: Number(auctionIndex) })}>
        경매 시작 알림
      </button>
      <button onClick={() => sendNotification('auctionWin', { memberIndex: Number(memberIndex), auctionIndex: Number(auctionIndex) })}>
        경매 낙찰 알림
      </button>
      <button onClick={() => sendNotification('auctionSold', { memberIndex: Number(memberIndex), auctionIndex: Number(auctionIndex) })}>
        경매 판매 확인 알림
      </button>
      <button onClick={() => sendNotification('higherBid', { memberIndex: Number(memberIndex), auctionIndex: Number(auctionIndex) })}>
        상위 입찰자 알림
      </button>
      <button onClick={() => sendNotification('serverMaintenance', { title, content })}>
        서버 점검 알림
      </button>
      <button onClick={() => sendNotification('deliveryConfirmation', { senderIndex: Number(senderIndex), receiverIndex: Number(receiverIndex), auctionIndex: Number(auctionIndex) })}>
        배송 확인 알림
      </button>
      <button onClick={() => sendNotification('exchange', { memberIndex: Number(memberIndex), title, content })}>
        환전 알림
      </button>
      <button onClick={() => sendNotification('deposit', { memberIndex: Number(memberIndex), title, content })}>
        입금 알림
      </button>
      <button onClick={() => sendNotification('directMessage', { senderIndex: Number(senderIndex), receiverIndex: Number(receiverIndex), content, auctionIndex: Number(auctionIndex) })}>
        직접 메시지 알림
      </button>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestApi3;
