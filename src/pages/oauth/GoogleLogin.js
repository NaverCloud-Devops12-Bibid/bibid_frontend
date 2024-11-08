import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useRecoilState} from "recoil";
import {userInfoState} from './userInfoState';
import "./KakaoLogin.css"
import {useDispatch, useSelector} from "react-redux";
import {googleJwtToken, kakaoJwtToken} from "../../apis/member/memberApis";
import styled from "styled-components";

const CenteredContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`

function GoogleLogin() {

    const dispatch = useDispatch();
    const navi = useNavigate();

    // Access Token 받아오기
    useEffect(() => {
        // URL에서 'code' 파라미터를 추출
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

    }, [dispatch, navi]);

    useEffect(() => {
        const hash = window.location.hash;
        const login = async () => {
            if (hash) {
                const accessToken = new URLSearchParams(hash.slice(1)).get('access_token');
                if (accessToken) {
                    // 여기에 토큰을 처리하는 로직을 추가하세요
                    console.log('Access Token:', accessToken);
                    // 예: API 요청이나 상태 관리에 토큰 저장
                    await dispatch(googleJwtToken(accessToken));
                }
                navi("/");
            }
        };

        login();

    }, [dispatch, navi]);

    return (
        <CenteredContainer>
            <div className="loader"></div>
        </CenteredContainer>
    )
}

export default GoogleLogin;