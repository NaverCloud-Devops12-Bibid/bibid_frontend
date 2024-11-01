import styled from "styled-components";
import React, {useCallback, useState} from "react";
import Circle from "../../components/etc2_join/Circle";
import ButtonComponent from "../../components/etc2_join/ButtonComponent";
import {useNavigate} from "react-router-dom";
import {Button, Container, Grid, InputAdornment, Menu, MenuItem, TextField, Typography} from "@mui/material";
import {Visibility, VisibilityOff} from '@mui/icons-material';
import {ChakraProvider, Button as ChakraButton, useDisclosure as CharkraUseDisclosure} from "@chakra-ui/react";
import SearchAddressModal from "../../components/etc2_join/SearchAddressModal";
import axios from "axios";
import {useDispatch} from "react-redux";
import {join} from "../../apis/etc2_memberapis/memberApis"



const JoinBlock = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px; /* 상하 여백 추가 */
`;

const JoinTwo = () => {
    const [joinForm, setJoinForm] = useState({
        memberId: '',
        name: '',
        memberPw: '',
        memberPwCheck: '',
        nickname: '',
        email: '',
        memberPnum: '',
        memberAddress: '',
        addressDetail: ''
    });

    const [memberIdChk, setMemberIdChk] = useState(false);
    const [memberPwValidate, setMemberPwValidate] = useState(false);
    const [memberPwChk, setMemberPwChk] = useState(false);
    const [nicknameChk, setNicknameChk] = useState(false);
    const [showHelperText, setShowHelperText] = useState(true);
    const [showMemberPw, setShowMemberPw] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const dispatch = useDispatch();
    const navi = useNavigate();

    const changeTextField = useCallback((e) => {
                const {name, value} = e.target;

                setJoinForm((prevForm) => ({
                    ...prevForm,
                    [name]: value
                }));

                // 비밀번호 입력 시 helperText 숨기기
                if (name === 'memberPw' && value) {
                    setShowHelperText(false);
                } else if (name === 'memberPw' && !value) {
                    setShowHelperText(true);
                }

                if (e.target.name === 'memberId') {
                    setMemberIdChk(false);
                    document.querySelector("#memberId-check-btn").removeAttribute('disabled');
                    return;
                }

                if (e.target.name === 'nickname') {
                    setNicknameChk(false);
                    document.querySelector("#nickname-check-btn").removeAttribute('disabled');
                    return;
                }

                if (e.target.name === 'memberPw') {
                    if (e.target.value === joinForm.memberPwCheck) {
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
                    if (e.target.value === joinForm.memberPw) {
                        setMemberPwChk(true);
                        document.querySelector("#memberPw-check-success").style.display = 'block';
                        document.querySelector("#memberPw-check-fail").style.display = 'none';
                    } else {
                        setMemberPwChk(false);
                        document.querySelector("#memberPw-check-success").style.display = 'none';
                        document.querySelector("#memberPw-check-fail").style.display = 'block';
                    }
                }

                // 휴대전화 포맷팅
                if (name === 'memberPnum') {
                    // 숫자만 추출
                    const cleanedValue = value.replace(/\D/g, '');

                    // 포맷에 맞게 수정
                    let formattedValue = '';
                    if (cleanedValue.length < 3) {
                        formattedValue = cleanedValue;
                    } else if (cleanedValue.length < 7) {
                        formattedValue = `${cleanedValue.slice(0, 3)}-${cleanedValue.slice(3)}`;
                    } else {
                        formattedValue = `${cleanedValue.slice(0, 3)}-${cleanedValue.slice(3, 7)}-${cleanedValue.slice(7, 11)}`;
                    }

                    setJoinForm((prevForm) => ({
                        ...prevForm,
                        [name]: formattedValue,
                        memberPnum: cleanedValue, // 실제 저장할 전화번호 (DB에 저장할 값)
                    }));
                    return;
                }

            }, [joinForm]
        )
    ;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectDomain = (domain) => {
        if (domain) {
            setJoinForm((prevForm) => ({
                ...prevForm,
                email: `${prevForm.email.split('@')[0]}@${domain}`
            }));
        } else {
            setJoinForm((prevForm) => ({
                ...prevForm,
                email: ''
            }));
        }
        handleClose();
    };



    const toggleShowMemberPw = () => {
        setShowMemberPw((prev) => !prev);
    };


    const memberIdCheck = useCallback(async () => {
        try {
            if (joinForm.memberId === '') {
                alert('아이디를 입력하세요.');
                document.querySelector('#memberId').focus();
                return;
            }

            const response = await axios.post(`${process.env.REACT_APP_BACK_SERVER}/members/memberId-check`, {
                memberId: joinForm.memberId
            });

            if (response.data.item.memberIdCheckMsg === 'invalid memberId') {
                alert('중복된 아이디입니다. 다른 아이디로 변경해주세요.');
                document.querySelector('#memberId').focus();
                return;
            } else {
                if (window.confirm(`${joinForm.memberId}은 사용가능한 아이디입니다. 사용하시겠습니까?`)) {
                    document.querySelector('#memberId-check-btn').setAttribute('disabled', true);
                    setMemberIdChk(true);
                    return;
                }
            }
        } catch (e) {
            console.log(e);
            alert("에러가 발생했습니다.");
        }
    }, [joinForm.memberId]);

    const nicknameCheck = useCallback(async () => {
        try {
            if (joinForm.nickname === '') {
                alert('닉네임을 입력하세요.');
                document.querySelector('#nickname').focus();
                return;
            }

            const response = await axios.post(`${process.env.REACT_APP_BACK_SERVER}/members/nickname-check`, {
                nickname: joinForm.nickname
            });

            if (response.data.item.nicknameCheckMsg === 'invalid nickname') {
                alert('중복된 닉네임입니다. 다른 닉네임을 사용하세요.');
                document.querySelector('#nickname').focus();
                return;
            } else {
                if (window.confirm(`${joinForm.nickname}은 사용가능한 닉네임입니다. 사용하시겠습니까?`)) {
                    document.querySelector('#nickname-check-btn').setAttribute('disabled', true);
                    setNicknameChk(true);
                    return;
                }
            }
        } catch (e) {
            console.log(e);
            alert('에러가 발생했습니다.');
        }
    }, [joinForm.nickname]);

    const handleJoin = useCallback((e) => {
        e.preventDefault();

        if (joinForm.name === '') {
            alert('이름을 입력하세요.');
            return;
        }

        if (!memberIdChk) {
            alert('아이디 중복확인을 진행하세요.');
            return;
        }

        if (!memberPwValidate) {
            alert('비밀번호는 특수문자, 숫자, 영문자 조합의 9자리 이상으로 지정하세요.');
            return;
        }

        if (!memberPwChk) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!nicknameChk) {
            alert('닉네임 중복확인을 진행하세요.');
            return;
        }

        if (joinForm.memberPnum === '') {
            alert('휴대전화를 입력하세요.');
            return;
        } else if (!validatePhoneNumber()) {
            alert('휴대전화 번호는 010으로 시작하고, 11자리인 번호만 가능합니다.');
            return;
        }

        if (joinForm.email === '') {
            alert('이메일 주소를 입력하세요.');
            return;
        }

        if (joinForm.memberAddress === '') {
            alert('주소를 입력하세요.');
            return;
        }

        dispatch(join(joinForm));
        return true;

    }, [joinForm, memberIdChk, memberPwChk, memberPwValidate, nicknameChk, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const isJoined = handleJoin(e);
        if (isJoined) {
            navi('/join/three');
        }
    };

    const handlePrev = () => {
        navi('/join'); // 이전 페이지로 이동
    };

    const validateMemberPw = useCallback(() => {
        return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*+=-]).{9,}$/.test(joinForm.memberPw);
    }, [joinForm.memberPw]);

    const validatePhoneNumber = useCallback(() => {
        return /^010\d{8}$/.test(joinForm.memberPnum);
    }, [joinForm.memberPnum]);

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


// ㅁ 주소창
    const {
        isOpen: isSearchAddressOpen,
        onOpen: onSearchAddressOpen,
        onClose: onSearchAddressClose,
    } = CharkraUseDisclosure();

    const [inputAddressValue, setInputAddressValue] = useState('');
    const [detailAddressValue, setDetailAddressValue] = useState(''); // 상세주소 상태 추가
    const [showDetailAddressInput, setShowDetailAddressInput] = useState(false);

    const onCompletePost = (data) => {

        const fullAddress = data.address; // 선택한 주소
        setInputAddressValue(fullAddress); // 상태 업데이트
        setDetailAddressValue(''); // 상세주소 초기화
        onSearchAddressClose(); // 모달 닫기
        setShowDetailAddressInput(true); // 상세주소 입력란 표시

        // joinForm 업데이트
        setJoinForm((prevForm) => ({
            ...prevForm,
            memberAddress: fullAddress
        }));
    };

    // 상세주소 입력 시 joinForm 업데이트
    const handleDetailAddressChange = (e) => {
        setDetailAddressValue(e.target.value);
        setJoinForm((prevForm) => ({
            ...prevForm,
            addressDetail: `${e.target.value}`.trim()
        }));
    };


    return (
        <JoinBlock>
            <Circle activeStep={1}
                    style={{position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)'}}/>
            <Container maxWidth="sm" sx={{mt: 5}}>
                <Typography variant="h4" align="center" gutterBottom>
                    기본정보 입력
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="이름"
                                name="name"
                                value={joinForm.name}
                                fullWidth
                                required
                                onChange={changeTextField} // 수정된 핸들러 사용
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="아이디"
                                name="memberId"
                                id="memberId"
                                value={joinForm.memberId}
                                fullWidth
                                required
                                onChange={changeTextField}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button
                                                name='memberId-check-btn'
                                                id='memberId-check-btn'
                                                color='primary'
                                                type='button'
                                                onClick={memberIdCheck}
                                                disabled={memberIdChk}
                                            >
                                                중복확인
                                            </Button>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="비밀번호"
                                name="memberPw"
                                value={joinForm.memberPw}
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
                        <Grid item xs={12}>
                            <TextField
                                label="닉네임"
                                name="nickname"
                                id="nickname"
                                value={joinForm.nickname}
                                fullWidth
                                required
                                onChange={changeTextField}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button
                                                name='nickname-check-btn'
                                                id='nickname-check-btn'
                                                color='primary'
                                                type='button'
                                                onClick={nicknameCheck}
                                                disabled={nicknameChk}
                                            >
                                                중복확인
                                            </Button>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="휴대전화"
                                name="memberPnum" // 맞춤
                                fullWidth
                                required
                                value={joinForm.memberPnum} // 상태를 사용하여 값 설정
                                onChange={changeTextField} // 수정된 핸들러 사용
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="이메일"
                                name="email"
                                fullWidth
                                required
                                value={joinForm.email} // 상태를 사용하여 값 설정
                                onChange={changeTextField}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button onClick={handleClick}>
                                                도메인 선택
                                            </Button>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => handleSelectDomain("naver.com")}>naver.com</MenuItem>
                                <MenuItem onClick={() => handleSelectDomain("nate.com")}>nate.com</MenuItem>
                                <MenuItem onClick={() => handleSelectDomain("gmail.com")}>gmail.com</MenuItem>
                                <MenuItem onClick={() => handleSelectDomain("daum.net")}>daum.net</MenuItem>
                                <MenuItem onClick={() => handleSelectDomain("")}>직접 입력</MenuItem>
                            </Menu>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="주소"
                                name="memberAddress"
                                fullWidth
                                required
                                value={inputAddressValue}
                                readonly
                                InputProps={{
                                    endAdornment: (
                                        <div>
                                            <InputAdornment position="end">
                                                <Button onClick={onSearchAddressOpen}>
                                                    주소 검색
                                                </Button>
                                            </InputAdornment>

                                            <ChakraProvider>
                                                {isSearchAddressOpen && (
                                                    <SearchAddressModal
                                                        isOpen={isSearchAddressOpen}
                                                        onClose={onSearchAddressClose}
                                                        onCompletePost={onCompletePost}
                                                    />
                                                )}


                                            </ChakraProvider>
                                        </div>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {showDetailAddressInput && (
                                <Grid item xs={12}>
                                    <TextField
                                        label="상세주소 입력"
                                        name="detailAddress"
                                        value={detailAddressValue}
                                        fullWidth
                                        required
                                        onChange={handleDetailAddressChange}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                    <ButtonComponent prev={'제출'} next={'이전'} onSubmit={handleSubmit} onPrev={handlePrev}/>
                </form>
            </Container>
        </JoinBlock>
    )
        ;
}

export default JoinTwo;