import React, {useCallback, useState} from 'react';
import {Button, Container, Grid, InputAdornment, TextField, Typography} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import styled from "styled-components";
import ButtonComponent from "../../components/join/ButtonComponent";
import {useNavigate} from "react-router-dom";
import {modifyPasswd} from "../../apis/member/memberApis";
import {useDispatch} from "react-redux";

const FindBlock = styled.div`
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
    margin: 10%;
`

const HeaderTitle = styled.div`
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
`

const ModifyPasswd = () => {

    const [passwdForm, setPasswdForm] = useState({
        memberPw: '',
        memberPwCheck: ''
    });
    const [memberPwValidate, setMemberPwValidate] = useState(false);
    const [memberPwChk, setMemberPwChk] = useState(false);
    const [showHelperText, setShowHelperText] = useState(true);
    const [showMemberPw, setShowMemberPw] = useState(false);
    const navi = useNavigate();
    const dispatch = useDispatch();

    const changeTextField = useCallback((e) => {
        const {name, value} = e.target;
        setPasswdForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));

        // 비밀번호 입력 시 helperText 숨기기
        if (name === 'memberPw' && value) {
            setShowHelperText(false);
        } else if (name === 'memberPw' && !value) {
            setShowHelperText(true);
        }

        if (e.target.name === 'memberPw') {
            if (e.target.value === passwdForm.memberPwCheck) {
                setMemberPwChk(true);
                document.querySelector("#memberPw-check-success").style.display = 'block';
                document.querySelector("#memberPw-check-fail").style.display = 'none';
            } else {
                setMemberPwChk(false);
                document.querySelector("#memberPw-check-success").style.display = 'none';
                document.querySelector("#memberPw-check-fail").style.display = 'block';
            }
        }

        if (e.target.name === 'memberPwCheck') {
            if (e.target.value === passwdForm.memberPw) {
                setMemberPwChk(true);
                document.querySelector("#memberPw-check-success").style.display = 'block';
                document.querySelector("#memberPw-check-fail").style.display = 'none';
            } else {
                setMemberPwChk(false);
                document.querySelector("#memberPw-check-success").style.display = 'none';
                document.querySelector("#memberPw-check-fail").style.display = 'block';
            }
        }

    }, [passwdForm]);

    const handleFindPasswd = useCallback((e) => {

        if (!memberPwValidate) {
            alert('비밀번호는 특수문자, 숫자, 영문자 조합의 9자리 이상으로 지정하세요.');
            return;
        }

        if (!memberPwChk) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

    }, [passwdForm, memberPwChk, memberPwValidate]);

    const validateMemberPw = useCallback(() => {
        return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*+=-]).{9,}$/.test(passwdForm.memberPw);
    }, [passwdForm.memberPw]);

    const memberPwBlur = useCallback(() => {
        if (validateMemberPw()) {
            setMemberPwValidate(true);
            document.querySelector('#memberPw-validation').style.display = 'none';
            return;
        }

        setMemberPwValidate(false);
        document.querySelector('#memberPw-validation').style.display = 'block';
        return;
    }, [validateMemberPw]);

    const toggleShowMemberPw = () => {
        setShowMemberPw((prev) => !prev);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const userConfirmed = window.confirm("변경하시겠습니까?");
        if(userConfirmed){
            alert('비밀번호 변경이 완료되었습니다.');
            dispatch(modifyPasswd(passwdForm));
            navi("/login");
        } else {
            return;
        }
    }

    const handlePrev = (e) => {
        e.preventDefault();

        navi("/login");
    }

    return (
        <CenteredContainer>
            <FindBlock>
                <HeaderTitle>계정 찾기</HeaderTitle>
                <Container sx={{mt: 5, width: '100%'}}>
                    <form onSubmit={handleFindPasswd}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="비밀번호"
                                    name="memberPw"
                                    value={passwdForm.memberPw}
                                    type={showMemberPw ? "text" : "password"} // 비밀번호 가시성 토글
                                    fullWidth
                                    required
                                    helperText={showHelperText ? "※ 영문자, 숫자, 특수문자 포함해서 9자 이상 작성하세요." : ""}
                                    onChange={changeTextField}
                                    onBlur={memberPwBlur}
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
                            <Typography
                                name='memberPw-validation'
                                id='memberPw-validation'
                                component='p'
                                variant='string'
                                style={{display: 'none', color: 'red', marginTop: '0.5rem', marginLeft: '1.05rem'}}>
                                비밀번호는 특수문자, 영문자, 숫자 조합의 9자리 이상으로 지정하세요.
                            </Typography>
                            <Grid item xs={12}>
                                <TextField
                                    label="비밀번호 확인"
                                    name="memberPwCheck"
                                    type={showMemberPw ? "text" : "password"} // 비밀번호 가시성 토글
                                    fullWidth
                                    required
                                    onChange={changeTextField} // 수정된 핸들러 사용
                                />
                            </Grid>
                            <Typography
                                name='memberPw-check-success'
                                id='memberPw-check-success'
                                component='p'
                                variant='string'
                                style={{display: 'none', color: 'green', marginTop: '0.5rem', marginLeft: '1.05rem'}}>
                                비밀번호가 일치합니다.
                            </Typography>
                            <Typography
                                name='memberPw-check-fail'
                                id='memberPw-check-fail'
                                component='p'
                                variant='string'
                                style={{display: 'none', color: 'red', marginTop: '0.5rem', marginLeft: '1.05rem'}}>
                                비밀번호가 일치하지 않습니다.
                            </Typography>
                        </Grid>
                        <ButtonComponent prev={'변경'} next={'취소'} onSubmit={handleSubmit} onPrev={handlePrev}/>
                    </form>
                </Container>
            </FindBlock>
        </CenteredContainer>
    );
};

export default ModifyPasswd;