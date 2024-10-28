import React from 'react'
import '../../css/Mypage/Mypage.css';

export const MypageWalletRecord = () => {
  return (
    <>
        <div className='Mypage_WalletCard'>
            <div className='Mypage_WalletCardLeft'>아이콘 자리</div>
            <div className='Mypage_WalletCardRight'>
                <div className='Mypage_WalletLine'>
                    <div className='Mypage_WalletCardLine1'>
                        <div>[기록 타입]</div>
                        <div>[기록 시간]</div>
                    </div>
                    <div className='Mypage_WalletCardLine2'>
                        <div>[기록 메시지]</div>
                    </div>
                    <div className='Mypage_WalletCardLine3'>
                        <div>[크레딧 변동 기록]</div>
                        <div>[완료 후 크레딧]</div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
