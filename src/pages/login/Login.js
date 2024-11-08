import React, {useCallback, useEffect, useState} from 'react';
import {
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Grid,
    InputAdornment,
    TextField,
    Typography
} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../apis/member/memberApis';
import {useNavigate} from 'react-router-dom';
import styled from "styled-components";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import '../../css/Login.css';


const LoginBlock = styled.div`
    display: flex;
    width: 25rem;
    border-radius: 10px;
    background-color: #f1f1f1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    border: 1px solid #cdcdcd;
`;

const CenteredContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`

const HeaderTitle = styled.div`
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 30px;
`

const Login = () => {

    const [loginForm, setLoginForm] = useState({
        memberId: '',
        memberPw: '',
        rememberMe: false
    });
    const [showMemberPw, setShowMemberPw] = useState(false);


    const dispatch = useDispatch();
    const navi = useNavigate();

    const checkLoginState = useSelector(state => state.memberSlice.checkLoginState);

    useEffect(() => {

        if(checkLoginState){
            alert("이미 로그인 되어 있습니다.");
            navi("/");
        }

    }, [checkLoginState, loginForm]);

    const changeTextField = useCallback((e) => {
        const { name, value } = e.target;

        setLoginForm((prev) => ({
            ...prev,
            [name]: name === 'rememberMe' ? !prev.rememberMe : value, // 체크박스 반전
        }));
    }, []);

    const handleLogin = useCallback(async (e) => {
        e.preventDefault();

        const resultAction = await dispatch(login(loginForm));

        if (login.fulfilled.match(resultAction)) {
            navi("/");
        } else {
            // 로그인 실패 처리 (예: 에러 메시지 표시 등)
            console.error("로그인 실패:", resultAction.error.message);
        }

    }, [loginForm, dispatch, navi]);


    const toggleShowMemberPw = () => {
        setShowMemberPw((prev) => !prev);
    };


    const kakao_api_key = process.env.REACT_APP_KAKAO_API_KEY //REST API KEY
    const kakao_redirect_uri = process.env.REACT_APP_KAKAO_REDIRECT_URI + `/auth/kakao/callback` //Redirect URI
    // oauth 요청 URL
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=` + kakao_api_key + `&redirect_uri=` + kakao_redirect_uri + `&response_type=code`


    const naver_api_key = process.env.REACT_APP_NAVER_API_KEY //REST API KEY
    const naver_redirect_uri = process.env.REACT_APP_NAVER_REDIRECT_URI + '/auth/naver/callback' //Redirect URI
    const state = 1234;
    const naverURL = `https://nid.naver.com/oauth2.0/authorize?client_id=` + naver_api_key + `&response_type=code&redirect_uri=` + naver_redirect_uri + `&state=${state}`

    const google_api_key = process.env.REACT_APP_GOOGLE_API_KEY
    const google_redirect_uri = process.env.REACT_APP_GOOGLE_REDIRECT_URI + '/auth/google/callback' //Redirect URI
    // const state = 1234;
    const googleURL = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=` + google_api_key +
        `&redirect_uri=` + google_redirect_uri +
        `&response_type=token&` +
        `scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;
    const handleKakaoLogin = () => {
        window.location.href = kakaoURL
    }

    const handleNaverLogin = () => {
        window.location.href = naverURL
    }

    const handleGoogleLogin = () => {
        window.location.href = googleURL
    }




    return (
        <CenteredContainer>
            <LoginBlock>
                <form onSubmit={handleLogin}>
                    <Container maxWidth="sm" sx={{mt: 5}}>
                        <HeaderTitle sx={{ fontFamily: 'IBM Plex Sans KR, sans-serif' }}>로그인</HeaderTitle>
                        <Grid item xs={12} textAlign='right' style={{marginBottom: "15px"}}>
                            <TextField
                                name='memberId'
                                variant='outlined'
                                required
                                id='memberId'
                                label='아이디'
                                autoFocus
                                fullWidth
                                value={loginForm.memberId}
                                onChange={changeTextField}
                                InputLabelProps={{
                                    sx: { fontFamily: 'IBM Plex Sans KR, sans-serif' } // 라벨에 폰트 적용
                                  }}
                                  InputProps={{
                                    sx: { fontFamily: 'IBM Plex Sans KR, sans-serif' } // 입력 텍스트에 폰트 적용
                                  }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name='memberPw'
                                variant='outlined'
                                required
                                id='memberPw'
                                label='비밀번호'
                                fullWidth
                                type={showMemberPw ? "text" : "password"} // 비밀번호 가시성 토글
                                value={loginForm.memberPw}
                                onChange={changeTextField}
                                InputLabelProps={{
                                    sx: { fontFamily: 'IBM Plex Sans KR, sans-serif' } // 라벨에 폰트 적용
                                  }}
                                  InputProps={{
                                    sx: { fontFamily: 'IBM Plex Sans KR, sans-serif' }, // 입력 텍스트에 폰트 적용
                                  }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button onClick={toggleShowMemberPw}>
                                                {showMemberPw ? <VisibilityOff/> : <Visibility/>}
                                            </Button>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={loginForm.rememberMe}
                                        onChange={changeTextField}
                                        name='rememberMe'
                                    />
                                }
                                label="로그인 상태 유지"
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                      fontFamily: 'IBM Plex Sans KR, sans-serif', // 폰트 설정
                                      fontSize: '14px', // 폰트 크기 설정
                                      color: 'black', // 텍스트 색상 설정
                                    }
                                  }}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                type="submit" // type을 submit으로 설정
                                sx={{
                                    margin: '10px 0',
                                    backgroundColor: "#DDDDDD",
                                    height: "43px",
                                    fontSize: "18px",
                                    fontWeight: '900',
                                    color: '#444',
                                    fontFamily: 'IBM Plex Sans KR, sans-serif', // 폰트 설정
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: "#0A369D", // hover 시 배경색 변경
                                        color: 'white'
                                    }
                                }}
                                fullWidth
                            >
                                로그인
                            </Button>
                        </Grid>
                        <Grid className="joinFindContainer">
                            <a href={"/join"} className="joinFindButton">
                                <p style={{fontSize: '16px', fontWeight: '600'}}>회원가입</p>
                            </a>
                            <div className="vertical-line"></div>
                            <a href={"/find"} className="joinFindButton">
                                <p style={{fontSize: '16px', fontWeight: '600'}}>계정찾기</p>
                            </a>
                        </Grid>
                        <Grid container justifyContent="center" alignItems="center"
                              style={{marginTop: '40px', borderTop: '1px solid #777'}}>
                            <Typography style={{margin: '20px 0', color: '#777', fontWeight: '900'}}>
                                <p style={{fontSize: '16px', fontWeight: '600'}}>소셜로 로그인</p>
                            </Typography>
                        </Grid>
                        <Grid container justifyContent="center" alignItems="center">
                            <div className="circle" style={{cursor: 'pointer'}}>
                                <img src="/images/logo/kakao.png" alt="샘플 이미지" onClick={handleKakaoLogin}/>
                            </div>
                            <div className="circle" style={{cursor: 'pointer'}}>
                                <img src="/images/logo/naver.png" alt="샘플 이미지" onClick={handleNaverLogin}/>
                            </div>
                            <div className="circle" style={{cursor: 'pointer'}}>
                                <img src="/images/logo/google.png" alt="샘플 이미지" onClick={handleGoogleLogin}/>
                            </div>
                        </Grid>
                    </Container>
                </form>
            </LoginBlock>
        </CenteredContainer>


    )
        ;
};

export default Login;