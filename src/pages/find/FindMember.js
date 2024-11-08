import React, {useCallback, useEffect, useState} from 'react';
import {
    Button,
    Container,
    Divider,
    Grid,
    InputAdornment,
    List, ListItem, ListItemText,
    Menu,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";
import '../../css/Login.css';
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchMemberId, findIdByEmail, findMember, verificationCodeCheck} from "../../apis/member/memberApis";

const FindBlock = styled.div`
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
    margin: 10%;
`

const HeaderTitle = styled.div`
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
`

const FindMember = () => {

        const navi = useNavigate();
        const dispatch = useDispatch();

        const [findForm, setFindForm] = useState({
            email: ''
        });
        const [codeForm, setCodeForm] = useState({
            verificationCode: ''
        });
        const [emailError, setEmailError] = useState('');
        const [isButtonVisible, setIsButtonVisible] = useState(false);
        const [verificationButtonVisible, setVerificationButtonVisible] = useState(false);
        const [mailCodeCheck, setMailCodeCheck] = useState(true);
        const [emailCheck, setEmailCheck] = useState(false);
        const [viewButton, setViewButton] = useState(false);
        const [isPasswordFind, setIsPasswordFind] = useState(false);

        const changeTextField = useCallback((e) => {
            setFindForm(prevForm => {
                const updatedForm = {
                    ...prevForm,
                    [e.target.name]: e.target.value
                };

                const email = updatedForm.email;
                validateEmail(email);

                return updatedForm;
            });

            setCodeForm({
                ...codeForm,
                [e.target.name]: e.target.value
            });

            if (mailCodeCheck) {
                document.querySelector("#emailInput").style.display = 'block';
            }

        }, [findForm, codeForm, mailCodeCheck]);

        const handleFind = useCallback((e) => {
            e.preventDefault();

            alert("인증번호가 발송되었습니다.");

            dispatch(findMember(findForm));

            setVerificationButtonVisible(true);

            setMailCodeCheck(false);

            setIsButtonVisible(false);

            setEmailCheck(true);

        }, [findForm, dispatch]);

        const emailRegex = /^(?=.*@)(?=.*\.).+$/;

        const validateEmail = (email) => {
            if (email.trim() === '') {
                setEmailError('이메일 주소를 입력해주세요.');
                setIsButtonVisible(false);
                return false;
            } else if (!emailRegex.test(email)) {
                setEmailError('올바른 이메일 형식이 아닙니다.');
                setIsButtonVisible(false);
                return false;
            } else {
                setEmailError('');
                if (!viewButton) {
                    setIsButtonVisible(true);
                    setViewButton(true);
                }
                return true;
            }
        };

        const handleVerification = useCallback(async (e) => {
            e.preventDefault();

            try {
                const result = await dispatch(verificationCodeCheck(codeForm));

                const response = await dispatch(findIdByEmail(findForm));

                if (result.payload) {
                    if (response.payload.item == null) // db에 이메일이 없을 때
                    {
                        alert("가입되지 않은 회원입니다. 회원가입을 진행해 주세요.");
                        navi("/login");
                    } else
                    {
                        alert(`사용자가 가입한 아이디는 '${response.payload.item}'입니다. 비밀번호를 새로 설정하고 싶으면 버튼을 클릭해주세요.`);
                        setVerificationButtonVisible(false);
                        setIsPasswordFind(true);
                    }
                } else {
                    alert("인증번호가 틀렸습니다. 다시 입력해주세요.");
                }
            } catch (error) {
                console.error("데이터를 가져오는 중 오류 발생:", error);
            }

        }, [codeForm, dispatch]);

        const instructions = [
            "가입여부 확인이 필요한 이메일을 입력해서 인증번호를 전송해주세요.",
            "입력한 이메일로 발송된 인증번호를 확인해서 인증을 완료해주세요.",
            "이메일가입자는 인증 후 새 비밀번호를 설정할 수 있습니다.",
            "소셜가입자는 인증 후 어떤 소셜 서비스로 연결되었는지 확인할 수 있습니다.",
            "회원탈퇴한 이메일은 탈퇴일로부터 30일 동안은 재가입이 불가능합니다."
        ];

        const handleFindPasswd = (e) => {
            e.preventDefault();

            navi("/ModifyPasswd");
        };

        return (
            <CenteredContainer>
                <FindBlock>
                    <HeaderTitle>계정 찾기</HeaderTitle>
                    <Container sx={{mt: 5, width: '100%'}}>
                        <form onSubmit={handleFind}>
                            <Grid item xs={12} textAlign='right' style={{marginBottom: "10px"}}>
                                <TextField
                                    label="이메일"
                                    name="email"
                                    required
                                    value={findForm.email}
                                    onChange={changeTextField}
                                    error={!!emailError}
                                    id='emailInput'
                                    disabled={emailCheck}
                                    fullWidth
                                />
                            </Grid>
                            {emailError && (
                                <Typography
                                    component='p'
                                    variant='string'
                                    style={{color: 'red', marginTop: '0.5rem', marginLeft: '1.05rem'}}
                                >
                                    {emailError}
                                </Typography>
                            )}
                            {isButtonVisible && (
                                <Button
                                    name="transport-button"
                                    variant="contained"
                                    type="submit"
                                    sx={{
                                        height: "43px",
                                        fontSize: "18px",
                                        backgroundColor: '#D9D9D9', 
                                        color: 'black', 
                                        fontWeight: 'bold', 
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                        backgroundColor: "#0A369D", // hover 시 배경색 변경
                                        color: 'white'
                                        }
                                    }}
                                    fullWidth
                                    id='emailButton'
                                    disabled={!mailCodeCheck}
                                >
                                    인증번호 전송
                                </Button>
                            )}
                        </form>
                    </Container>
                    <Container sx={{width: '100%'}}>
                        {verificationButtonVisible && (
                            <form onSubmit={handleVerification}>
                                <Grid item xs={12} style={{marginTop: '10px'}}>
                                    <Divider/>
                                </Grid>
                                <Grid item xs={12} style={{display: 'flex', alignItems: 'center', marginTop: '10px'}}>
                                    <TextField
                                        label="인증번호"
                                        name="verificationCode"
                                        required
                                        fullWidth
                                        value={codeForm.verificationCode}
                                        onChange={changeTextField}
                                        style={{flex: 1}}
                                    />
                                </Grid>
                                <Button
                                    name="transport-button"
                                    variant="contained"
                                    type="submit"
                                    sx={{
                                        margin: '10px 0',
                                        height: "43px",
                                        fontSize: "18px",
                                        backgroundColor: '#D9D9D9', 
                                        color: 'black', 
                                        fontWeight: 'bold', 
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                        backgroundColor: "#0A369D", // hover 시 배경색 변경
                                        color: 'white'
                                        }
                                    }}
                                    fullWidth
                                >
                                    인증번호 확인
                                </Button>
                            </form>
                        )}
                        <List>
                            {instructions.map((instruction, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={`• ${instruction}`} sx={{marginLeft: '8px'}}/>
                                </ListItem>
                            ))}
                        </List>
                        {isPasswordFind && (
                            <Button
                                name="transport-button"
                                variant="contained"
                                type="submit"
                                style={{
                                    backgroundColor: "#2196F3",
                                    height: "43px",
                                    fontSize: "18px"
                                }}
                                fullWidth
                                onClick={handleFindPasswd}
                            >
                                비밀번호 재설정
                            </Button>
                        )}
                    </Container>
                </FindBlock>
            </CenteredContainer>
        );
    }
;

export default FindMember;