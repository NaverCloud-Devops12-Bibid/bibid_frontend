import React from 'react'
import { useSelector } from 'react-redux';

const MypageProfileBox = ({ memberInfo }) => {
  const memberIndex = useSelector((state) => state.memberSlice.memberIndex); 
  
  return (
    <div className='Mypage_ProfileBoxContainer'>
      <div className='Mypage_TitleContainer'>
        <div className='Mypage_UserInfoTitle'>회원정보 수정</div>
      </div>
        <div className='Mypage_UserInfoContainer'>
          <div className='Mypage_UserInfoDetail3'>
            <div>이름</div>
            <div className='rightOne'>{memberInfo.name}</div>
          </div>
          <div className='Mypage_UserInfoDetail'>
            <div>아이디</div>
            <div className='rightOne'>{memberInfo.memberId}</div>
          </div>
          <div className='Mypage_UserInfoDetail'>
            <div>비밀번호</div>
            <div className='rightOne'>비밀번호는 표시되지 않습니다.</div>
          </div>
          <div className='Mypage_UserInfoDetail'>
            <div>닉네임</div>
            <div className='rightOne'>{memberInfo.nickname}</div>
          </div>
          <div className='Mypage_UserInfoDetail'>
            <div>휴대폰</div>
            <div className='rightOne'>{memberInfo.memberPnum}</div>
          </div>
          <div className='Mypage_UserInfoDetail'>
            <div>이메일</div>
            <div className='rightOne'>{memberInfo.email}</div>
          </div>
          <div className='Mypage_UserInfoDetail2'>
            <div className='left-coulmn'>주소</div>
            <div className='right-coulmn'>
              <div className='rightOne'>{memberInfo.memberAddress}</div>
              <div className='rightTwo'>{memberInfo.addressDetail}</div>
            </div>
          </div>
        </div>
        <div className='Mypage_ModifyBtnContainer'>
          <div className='Mypage_UserInfoModifyBtn'> 수정 </div>
        </div>
    </div>
  )
}

export default MypageProfileBox