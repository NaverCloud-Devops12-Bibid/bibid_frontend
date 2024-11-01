import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../css/Mypage/Mypage.css';
import MypageSideBar from '../../components/Mypage/MypageSideBar';
import MypageProfileModifyBox from '../../components/Mypage/MypageProfileModifyBox';

const Mypage_UserInfoModify = () => {

    const [memberInfo, setMemberInfo] = useState(null);
    const memberIndex = useSelector((state) => state.memberSlice.memberIndex); 

  useEffect(() => {
    // API 호출 함수
    const fetchMemberInfo = async () => {
      try {
        console.log(memberIndex);
        const response = await axios.get(`${process.env.REACT_APP_BACK_SERVER}/mypage/userInfo/${memberIndex}`);
        console.log("Fetched member info:", response.data.item);
        setMemberInfo(response.data.item); // 응답에서 멤버 정보 저장
      } catch (error) {
        console.error("Error fetching member info:", error); // 오류 처리
      }
    };

    if (memberIndex) {
      fetchMemberInfo(); // memberIndex가 있을 때만 호출
    }
  }, [memberIndex]);
  
	return (
        <div className='Mypage_Container'>
            {memberInfo ? (
            <>
                <MypageSideBar memberInfo={memberInfo} />
                <MypageProfileModifyBox memberInfo={memberInfo} />
            </>
            ) : (
            <p>로딩 중...</p> // 데이터가 로딩 중일 때 표시할 메시지
            )}
        </div>
	);
};

export default Mypage_UserInfoModify;