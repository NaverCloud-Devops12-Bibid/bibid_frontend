import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useRecoilState} from "recoil";
import {userInfoState} from './userInfoState';
import "./KakaoLogin.css"
import {useDispatch, useSelector} from "react-redux";
import {kakaoJwtToken} from "../../apis/member/memberApis";
import styled from "styled-components";

const CenteredContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`

function KakaoLogin() {

    const dispatch = useDispatch();
    const navi = useNavigate();

    // Access Token 받아오기
    useEffect(() => {
        // URL에서 'code' 파라미터를 추출
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        const fetchData = async() => {
            if (code) {
                // 백엔드로 인가 코드 전송
                await dispatch(kakaoJwtToken(code));
                navi("/");
            }
        }

        fetchData();

    }, [dispatch, navi]);

    return (
        <CenteredContainer>
            <div className="loader"></div>
        </CenteredContainer>
    )
}

export default KakaoLogin;