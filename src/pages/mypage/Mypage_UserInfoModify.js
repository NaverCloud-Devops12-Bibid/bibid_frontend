import React from 'react';
import '../../css/Mypage/Mypage.css';
import MypageSideBar from '../../components/Mypage/MypageSideBar';
import MypageProfileBox from '../../components/Mypage/MypageProfileBox';

const Mypage_UserInfoModify = () => {
	return (
        <div className='Mypage_Container'>
            <MypageSideBar/>
            <MypageProfileBox/>
        </div>
	);
};

export default Mypage_UserInfoModify;