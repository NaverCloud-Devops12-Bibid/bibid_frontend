import React, {useCallback, useEffect, useState} from 'react';
import '../../css/Layout/Header.css';
import '../../css/Layout/MediaQuery.css';
import '../../css/Layout/Wallet.css';
import Alarm from '../Layout/Alarm';
import logo from '../../images/logo.svg';
import rightArrowIcon from '../../images/right_arrow_icon.svg';
import hamburgerIcon from '../../images/hamburger_icon.svg';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {getAccessToken, getTokenAndType, logout} from "../../apis/etc2_memberapis/memberApis"
import HeaderSearchBar from '../Search/HeaderSearchBar'

const Header = () => {

    const dispatch = useDispatch();
    const navi = useNavigate();

    const [boxHeight, setBoxHeight] = useState('auto'); // 초기 높이 설정
    const [showWalletPopup, setShowWalletPopup] = useState(false); // 지갑 팝업 상태

    const handleMouseOver = (e) => {
        document.querySelector(".HDnavbarMenuDetailBox").style.display = 'block';
    }

    const handleMouseLeave = (e) => {
        document.querySelector(".HDnavbarMenuDetailBox").style.display = 'none';
        document.querySelector(".HDnavbarMenuDetailCategory").style.display = 'none';
        setBoxHeight('auto')
    };

    const handleMouseOverCate = (e) => {
        document.querySelector(".HDarrowIcon").style.opacity = '1';
    }

    const handleMouseLeaveCate = (e) => {
        document.querySelector(".HDarrowIcon").style.opacity = '0';
    }

    const handleMouseOverWallet = () => {
        setShowWalletPopup(true);
    };

    const handleMouseLeaveWallet = () => {
        setShowWalletPopup(false);
    };

    let clickCate = true;

    const handleMouseClick = (e) => {
        if (clickCate) {
            document.querySelector(".HDnavbarMenuDetailCategory").style.display = 'flex'
            setBoxHeight('390px')
            clickCate = false;
        } else {
            document.querySelector(".HDnavbarMenuDetailCategory").style.display = 'none'
            setBoxHeight('auto')
            clickCate = true;
        }
    }

    // 로고 클릭 시 메인 페이지로 이동
    const handleLogoClick = () => {
        navi('/');  // mainpage로 페이지 이동
    };

    // 충전, 환전 클릭 시 마이 페이지로 이동
    const handleChargeBttnClick = () => {
        navi('/mypage/wallet_management');  // mainpage로 페이지 이동
    };

    const handleChargeCategory = () => {
        window.location.href = '/category';  // /category로 이동
    };

    const isLogin = useSelector(state => state.memberSlice.isLogin);
    const jwtToken = useSelector(state => state.memberSlice.token);
    const oauthType = useSelector(state => state.memberSlice.oauthType);

    const [token, setToken] = useState(null);

    useEffect(() => {

        if (isLogin) {
            dispatch(getTokenAndType());
        }

    }, [dispatch, isLogin]);

    useEffect(() => {

        if (isLogin) {
            setToken(true);
        } else {
            setToken(false);
        }

    }, [jwtToken]);


    const handleLogout = useCallback(async () => {

        await dispatch(logout());
        const kakaoLogoutParams = {
            client_id: "29e81fa9fda262c573f312af9934fa5c",
            logout_redirect_uri: "http://localhost:3000/"
        }
        if (oauthType === "Kakao") {
            const url = 'https://kauth.kakao.com/oauth/logout';
            window.location.href = `${url}?client_id=${kakaoLogoutParams.client_id}&logout_redirect_uri=${kakaoLogoutParams.logout_redirect_uri}`;
        }

    }, [dispatch]);

    return (
        <>
            <header>
                <nav className="HDnavbar">
                    <div className="HDnavbarLogo" onClick={handleLogoClick}>
                        <img src={logo} alt="navbarLogo"></img>
                    </div>
                    <div className="HDnavbarMenuWrapper" onMouseOver={handleMouseOver}
                         onMouseLeave={handleMouseLeave}>
                        <ul className="HDnavbarMenu">
                            <li className="HDnavbarMenuItem">
                                <a href='#'>특수경매</a>
                            </li>
                            <li className="HDnavbarMenuItem" onClick={handleChargeCategory}>
                                <a href='#'>일반경매</a>
                            </li>
                            <li className="HDnavbarMenuItem"><a href="/registration">물품등록</a></li>
                        </ul>

                        <div className="HDnavbarMenuDetailBox" onMouseOver={handleMouseOver}
                             onMouseLeave={handleMouseLeave} style={{height: boxHeight}}>
                            <div className='HDnavbarMenuDetailFlex'>
                                <ul className="HDnavbarMenuDetail">
                                    <li><a href="/specialAuction">실시간</a></li>
                                    <li><a href="#">블라인드</a></li>
                                </ul>
                                <ul className="HDnavbarMenuDetail">
                                    <li><a href="#">전체보기</a></li>
                                    <li id='HDnavbarMenuDetailCate' onClick={handleMouseClick}
                                        onMouseOver={handleMouseOverCate} onMouseLeave={handleMouseLeaveCate}><a
                                        href='#'>카테고리</a></li>
                                </ul>
                                <div className='HDarrowIcon'>
                                    <img src={rightArrowIcon}></img>
                                </div>
                                <div className="HDnavbarMenuDetailCategoryBox">
                                    <ul className="HDnavbarMenuDetailCategory">
                                        <li><a href="#">의류/잡화</a></li>
                                        <li><a href="#">취미/수집</a></li>
                                        <li><a href="#">도서</a></li>
                                        <li><a href="#">예술품</a></li>
                                        <li><a href="#">전자제품</a></li>
                                        <li><a href="#">사진</a></li>
                                        <li><a href="#">골동품</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="HDnavbarSearchbar">
                        <input type="text"></input>
                    </div> */}
                    <HeaderSearchBar />
                    {
                        token ?
                            <>
                                <ul className="HDnavbarMember">
                                    <li><a onClick={handleLogout}>로그아웃</a></li>
                                </ul>
                                <div className="HDnavbarAlarm" style={{marginRight: '40px', position: 'relative'}}
                                     onMouseOver={handleMouseOverWallet}
                                     onMouseLeave={handleMouseLeaveWallet}>
                                    <img
                                        src="/images/Ellipse%202.png"
                                        alt="My Page"/>

                                    {showWalletPopup && (
                                        <div className="HDwalletPopup">
                                            <h3>지갑</h3>
                                            <div className="HDwalletAmount">
                                                <p>금액</p>
                                                <p>1,586,500 원</p>
                                            </div>
                                            <div className="HDwalletButtons">
                                                <button onClick={handleChargeBttnClick}>충전</button>
                                                <button onClick={handleChargeBttnClick}>환전</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                            :
                            <>
                                <ul className="HDnavbarMember">
                                    <li><a href="/login">로그인</a></li>
                                    <li><a href="/join">회원가입</a></li>
                                </ul>
                            </>
                    }
                    <Alarm/>
                    <a href="#" className="HDnavbarToggleBtn">
                        <img src={hamburgerIcon} alt="hamburger_icon"></img>
                    </a>
                </nav>
            </header>
        </>
    );
};

export default Header;