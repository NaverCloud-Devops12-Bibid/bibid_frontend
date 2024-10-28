import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../../css/Mypage/Mypage.css';
import { useNavigate } from 'react-router-dom';

const MypageSideBar = ({ memberInfo }) => {
  const memberIndex = useSelector((state) => state.memberSlice.memberIndex); 

  const navi = useNavigate();

  const handleProfileClick =() => {
    navi('/mypage/userInfo');
  }

  const handleAuctionClick =() => {
    navi('/mypage/auctionInfo');
  }

  const handleWalletClick =() => {
    navi('/mypage/wallet');
  }

  const handleQnaClick =() => {
    navi('/mypage/qna');
  }

  const handleSellerClick =() => {
    navi('/mypage/sellerInfo');
  }

  return (
    <div className='Mypage_SideBarContainer'>
        <div className='Mypage_SideBarProfile'>
            <div className='Mypage_ProfileImg' src='{profileImg}'>
              <div className='Mypage_ProfileImgModifyBtn'></div>
            </div>
            <div className='Mypage_ProfileUserName'>
        </div>
        </div>
        <div className='Mypage_SideBarCategory'>
            <div onClick={handleProfileClick} style={{ cursor: 'pointer' }} >내 프로필</div>
            <div onClick={handleAuctionClick} style={{ cursor: 'pointer' }} >경매 내역</div>
            <div onClick={handleWalletClick} style={{ cursor: 'pointer' }} >지갑 관리</div>
            <div onClick={handleQnaClick} style={{ cursor: 'pointer' }} >문의 내역</div>
            <div onClick={handleSellerClick} style={{ cursor: 'pointer' }} >판매자 정보 등록</div>
        </div>
    </div>
  )
}

export default MypageSideBar