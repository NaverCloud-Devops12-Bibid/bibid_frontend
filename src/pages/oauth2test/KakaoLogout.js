import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useRecoilState} from "recoil";
import {userInfoState} from './userInfoState';
import "./KakaoLogin.css"
import {useDispatch, useSelector} from "react-redux";
import {kakaoJwtToken} from "../../apis/etc2_memberapis/memberApis";
import styled from "styled-components";

const CenteredContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`

function KakaoLogin() {

    return (
        <CenteredContainer>
            <div className="loader"></div>
        </CenteredContainer>

)
}

export default KakaoLogin;