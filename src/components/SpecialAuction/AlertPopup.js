import React from 'react';

function AlertPopup({ auction, handleClosePopup, handleAlertRegisterButtonClick }) {

  return (
    <div className="SAalertOverlay">
      <div className="SAalertPopup">
        <h2>알림신청</h2>
        <div className='SAalertContents'>
          <p>
            <strong>{auction.productName}</strong>의 실시간 경매 알림을 신청하시겠습니까?
          </p>
          <p>알림신청 취소는 <span>마이페이지</span>에서 가능합니다.</p>
        </div>
        <p>
          <small>* 경매 시작 1일 전과 30분 전에 이메일과 해당 사이트 알림을 통해서 전달됩니다.</small>
        </p>
        <button onClick={ () => {
            handleClosePopup();
            handleAlertRegisterButtonClick(auction);
          }
        }>확인</button>
      </div>
    </div>
  );
}

export default AlertPopup;
