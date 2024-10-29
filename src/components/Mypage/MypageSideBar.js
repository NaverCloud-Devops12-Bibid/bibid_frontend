import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadProfileImage } from '../../apis/etc2_memberapis/memberApis';
import '../../css/Mypage/Mypage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MypageSideBar = ({ memberInfo }) => {

  const bucketName = process.env.REACT_APP_BUCKET_NAME;
  const member = useSelector((state) => state.memberSlice);
  const dispatch = useDispatch(); // dispatch 함수 추가
  const [profileImage, setProfileImage] = useState(member.profileImage || { filepath: '/default_profile.png', filename: '' });
  const [loading, setLoading] = useState(false);
  const navi = useNavigate();

  const imageSrc = profileImage.filepath && profileImage.filename
  ? `https://kr.object.ncloudstorage.com/${bucketName}/${profileImage.filepath}${profileImage.filename}`
  : '/images/defaultFileImg.png';

  useEffect(() => {
    setProfileImage(member.profileImage || { filepath: '', filename: '/default_profile.png' });
  }, [member.profileImage]);


  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profileImage', file);
      formData.append('memberIndex', member.memberIndex);
  
      try {
        setLoading(true);
        // uploadProfileImage 액션을 디스패치하여 이미지 업로드
        const actionResult = await dispatch(uploadProfileImage(formData));
  
        // 성공적으로 업로드되었는지 확인
        if (uploadProfileImage.fulfilled.match(actionResult)) {
          setProfileImage(actionResult.payload); // local state 업데이트
        } else {
          console.error('프로필 이미지 업로드 오류:', actionResult.payload);
        }
      } catch (error) {
        console.error('Failed to upload profile image:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleProfileImageClick = () => document.getElementById('profileImageInput').click();

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
            <div className='Mypage_ProfileImgContainer' onClick={handleProfileImageClick}>
              <img className='Mypage_ProfileImg' src={imageSrc} alt="Profile" />
              <div className='Mypage_ProfileImgModifyBtn'>{loading ? "수정 중..." : "수정"}</div>
              <input
                type="file"
                id="profileImageInput"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className='Mypage_ProfileUserName'>
        </div>
        </div>
        <div className='Mypage_SideBarCategory'>
            <div onClick={handleProfileClick} style={{ cursor: 'pointer' }} >내 프로필</div>
            <div onClick={handleAuctionClick} style={{ cursor: 'pointer' }} >경매 진행 현황</div>
            <div onClick={handleWalletClick} style={{ cursor: 'pointer' }} >지갑 관리</div>
            <div onClick={handleQnaClick} style={{ cursor: 'pointer' }} >문의 내역</div>
            <div onClick={handleSellerClick} style={{ cursor: 'pointer' }} >판매자 정보 등록</div>
        </div>
    </div>
  )
}

export default MypageSideBar