import React, {useState, useCallback, useEffect} from 'react';
import {
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Grid,
    Icon,
    InputAdornment,
    TextField,
    Typography
} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {googleJwtToken, login} from '../../apis/etc2_memberapis/memberApis';
import {useNavigate} from 'react-router-dom';
import styled from "styled-components";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import '../../css/Login.css';


const LoginBlock = styled.div`
    display: flex;
    width: 25rem;
    border-radius: 10px;
    background-color: #bfbfbf;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
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
        memberPw: ''
    });
    const [showMemberPw, setShowMemberPw] = useState(false);


    const dispatch = useDispatch();
    const navi = useNavigate();

    const changeTextField = useCallback((e) => {
        setLoginForm({
            ...loginForm,
            [e.target.name]: e.target.value
        });
    }, [loginForm]);

    const setCookie = (name, value, days) => {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = `; expires=${date.toUTCString()}`;
        }
        document.cookie = `${name}=${value || ''}${expires}; path=/`;
    };

    const handleLogin = useCallback((e) => {
        e.preventDefault();

        dispatch(login(loginForm)).then((action) => {
                if (login.fulfilled.match(action)) { // 액션 타입 확인을 위해 match 사용
                    const token = action.payload.token;

                    if (rememberMe) {
                        setCookie('ACCESS_TOKEN', token, 7)
                    } else {
                        setCookie('ACCESS_TOKEN', token)
                    }
                    navi("/");
                } else {
                    console.error('로그인 실패');
                }
            }
        );

    }, [loginForm, dispatch, navi]);

    const toggleShowMemberPw = () => {
        setShowMemberPw((prev) => !prev);
    };

    const [rememberMe, setRememberMe] = useState(false);

    const kakao_api_key = '29e81fa9fda262c573f312af9934fa5c' //REST API KEY
    const kakao_redirect_uri = 'http://localhost:3000/auth/kakao/callback' //Redirect URI
    // oauth 요청 URL
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao_api_key}&redirect_uri=${kakao_redirect_uri}&response_type=code`


    const naver_api_key = 'wa3QkzrBALL4WACeB12Z' //REST API KEY
    const naver_redirect_uri = 'http://localhost:3000/auth/google/callback' //Redirect URI
    const state = 1234;
    const naverURL = `https://nid.naver.com/oauth2.0/authorize?client_id=${naver_api_key}&response_type=code&redirect_uri=${naver_redirect_uri}&state=${state}`

    const google_api_key = '255369569867-roag3v486bjk47771oeu1o9js0dbgdvh.apps.googleusercontent.com' //REST API KEY
    const google_redirect_uri = 'http://localhost:3000/auth/google/callback' //Redirect URI
    // const state = 1234;
    const googleURL = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${google_api_key}&` +
        `redirect_uri=${google_redirect_uri}&` +
        `response_type=token&` +
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
                        <HeaderTitle>로그인</HeaderTitle>
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
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                    />
                                }
                                label="로그인 상태 유지"
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                type="submit" // type을 submit으로 설정
                                style={{
                                    margin: '10px 0',
                                    backgroundColor: "#2196F3",
                                    height: "43px",
                                    fontSize: "18px"
                                }}
                                fullWidth
                            >
                                로그인
                            </Button>
                        </Grid>
                        <Grid className="joinFindContainer">
                            <a href={"/join"} className="joinFindButton">회원가입</a>
                            <div className="vertical-line"></div>
                            <a href={"/find"} className="joinFindButton">계정찾기</a>
                        </Grid>
                        <Grid container justifyContent="center" alignItems="center"
                              style={{marginTop: '40px', borderTop: '1px solid #FFFFFF'}}>
                            <Typography style={{margin: '20px 0', color: '#FFF'}}>
                                소셜로 로그인
                            </Typography>
                        </Grid>
                        <Grid container justifyContent="center" alignItems="center">
                            <div className="circle">
                                <img src="/images/logo/kakao.png" alt="샘플 이미지" onClick={handleKakaoLogin}/>
                            </div>
                            <div className="circle">
                                <img src="/images/logo/naver.png" alt="샘플 이미지" onClick={handleNaverLogin}/>
                            </div>
                            <div className="circle">
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