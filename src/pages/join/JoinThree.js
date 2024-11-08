import {Container, Typography, Button} from '@mui/material';
import styled from "styled-components";
import Circle from "../../components/join/Circle";
import {useDispatch, useSelector} from "react-redux";
import {fetchMemberId} from "../../apis/member/memberApis";
import {useEffect, useState} from "react";
import joinOkIcon from "../../images/join_ok_icon.svg"

const JoinBlock = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 1200px;
    margin: 0 auto;
    height: 100vh;
    position: relative;
`;

const JoinThree = () => {

        const [activeStep, setActiveStep] = useState(2);
        const memberId = useSelector((state) => state.memberSlice.memberId);
        const dispatch = useDispatch();

        return (
            <JoinBlock>
                <Circle activeStep={activeStep}
                        style={{position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)'}}/>
                <Container maxWidth="sm" sx={{textAlign: 'center', mt: 5}}>
                    <Typography variant="h4" sx={{mt: 2, mb: 1, fontWeight: 900, marginBottom: '50px'}}>
                        회원가입 완료
                    </Typography>
                    <div style={{marginBottom: '50px'}}>
                        <img src={joinOkIcon} alt="회원가입 완료 아이콘" /> {/* 이미지 추가 */}
                    </div>
                    <Typography variant="body1" sx={{mb: 2, fontSize: '18px', fontWeight: '600'}}>
                        {memberId}님의 회원가입이 성공적으로 완료되었습니다.
                    </Typography>
                    <Typography variant="body2" sx={{mb: 4, fontSize: '16px', fontWeight: '600'}}>
                        * 회원가입 내역확인 및 수정은 <span style={{color: '#FF8A00'}}>마이페이지 &gt; 회원정보수정</span> 에서 가능합니다.
                    </Typography>
                    <Button variant="contained" color="primary" href="/login" 
                                    sx={{
                                    margin: '10px 0',
                                    backgroundColor: "#DDDDDD",
                                    height: "43px",
                                    fontSize: "18px",
                                    fontWeight: '900',
                                    color: '#444',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: "#0A369D", // hover 시 배경색 변경
                                        color: 'white'
                                    }
                                }}>
                        로그인
                    </Button>
                </Container>
            </JoinBlock>
        );
    }
;

export default JoinThree;