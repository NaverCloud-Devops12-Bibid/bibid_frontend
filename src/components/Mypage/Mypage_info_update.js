import React, { useCallback, useEffect, useState } from 'react'
import profileImageUrl from '../../images/profile_img.png';
import axios from 'axios';
import { Box, Button, InputAdornment, TextField } from '@mui/material';
import {ChakraProvider, useDisclosure as CharkraUseDisclosure} from "@chakra-ui/react";
import SearchAddressModal from "../../components/etc2_join/SearchAddressModal";
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Mypage_info_update = () => {

	const bucketName = process.env.REACT_APP_BUCKET_NAME;

	const [joinForm, setJoinForm] = useState({
		memberIndex: '',
		profileImage: '',
		name: '',
		memberId: '',
		nickname: '',
		memberPw: '',
		passwordCheck: '',
		etc1_mobile_phone_num1: '',
		etc1_mobile_phone_num2: '',
		etc1_mobile_phone_num3: '',
		memberPnum: '',
		email: '',
		memberAddress: '',
		addressDetail: ''
	});

	const [uploadProfiles, setUploadProfiles] = useState([]);

    const [passwordChk, setPasswordChk] = useState(false);
	const [passwordValidate, setPasswordValidate] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [phoneValidate, setPhoneValidate] = useState(false);
	const [emailValidate, setEmailValidate] = useState(false);

	const getMember = useCallback(async () => {
		try {
			const response = await axios.get(`${process.env.REACT_APP_BACK_SERVER}/mypage`);

			console.log(response.data.item);
			if(response.data.item.email && response.data.item.email !== ''){
				setEmailValidate(true);
			}
			setJoinForm((prevForm) => ({
				...prevForm,
				memberIndex: response.data.item.memberIndex,
				profileImage: response.data.item.profileImage,
				name: response.data.item.name,
				memberId: response.data.item.memberId,
				nickname: response.data.item.nickname,
				memberPnum: response.data.item.memberPnum,
				email: response.data.item.email,
				memberAddress: response.data.item.memberAddress,
				addressDetail: response.data.item.addressDetail
			}));

			if(response.data.item.memberPnum && response.data.item.memberPnum.length === 10){
				setJoinForm((prevForm) => ({
					...prevForm,
					etc1_mobile_phone_num1: response.data.item.memberPnum.substring(0,3),
					etc1_mobile_phone_num2: response.data.item.memberPnum.substring(3,6),
					etc1_mobile_phone_num3: response.data.item.memberPnum.substring(6,)
				}));
			}
			if(response.data.item.memberPnum && response.data.item.memberPnum.length === 11) {
				setJoinForm((prevForm) => ({
					...prevForm,
					etc1_mobile_phone_num1: response.data.item.memberPnum.substring(0,3),
					etc1_mobile_phone_num2: response.data.item.memberPnum.substring(3,7),
					etc1_mobile_phone_num3: response.data.item.memberPnum.substring(7,)
				}));
			}
			// console.log(joinForm);
		} catch(e){
			console.log(e);
		}
	});

	useEffect(() => {
		getMember();
	}, []);

	
	// 주소검색 모달창
	const {
		isOpen: isSearchAddressOpen,
		onOpen: onSearchAddressOpen,
		onClose: onSearchAddressClose,
	} = CharkraUseDisclosure();

	const onCompletePost = (data) => {
		setJoinForm((prevForm) => ({
			...prevForm,
			memberAddress: data.address
		}));
		onSearchAddressClose();
	};

	const changeProfileImage = () => {
		console.log('기존 프로필 URL : ' + profileImageUrl);
		document.querySelector(`#uploadProfileImg`).click();
	}

	const changeProfileImageFile = (e) => {
		const fileList = Array.prototype.slice.call(e.target.files);

		if(fileList !== undefined || fileList.length !== 0){
			// uploadProfiles.push(fileList[0]);
			// 새 파일로 상태 업데이트
			setUploadProfiles((prev) => [...prev, fileList[0]]);

			console.log(uploadProfiles);
			// 속성 추가 전
			// console.log(fileList[0]);

			fileList[0]['filestatus'] = 'U';
			fileList[0]['newfilename'] = fileList[0].name;

			// 속성 추가 후 => 속성 추가 전의 데이터에 filestatus와 newfilename이 세팅이 되어있지?
			// console.log(fileList[0]);
			
			const reader = new FileReader();

			reader.onload = (ev) => {
				const img = document.querySelector('#profileImg');

				if(fileList[0].name.toLowerCase().match(/(.*?)\.(jpg|png|jpeg|gif|svg|bmp)$/)){
					img.src = ev.target.result;
				} else {
					img.src = '../../images/profile_img.png';
				}
			}

			reader.readAsDataURL(fileList[0]);

		}
		
	}

	const changeTextField = useCallback((e) => {
		const {name, value} = e.target;

		setJoinForm((prevForm) => ({
			...prevForm,
			[name]: value
		}));		
		
		if(name === 'memberPw' && value !== ''){
			if(!passwordPatternCheck(value)){
				setPasswordChk(false);
				document.querySelector('#password_validation_message').style.color = 'red';
				return;
			}
			document.querySelector('#password_validation_message').style.color = 'black';
			setPasswordChk(true);

			let checkMsgTag = document.querySelector('#etc1_password_compare_check');
			if(value !== document.querySelector('#passwordCheck').value){
				setPasswordValidate(false);
				checkMsgTag.style.display = 'block';
				checkMsgTag.textContent = '비밀번호와 일치하지 않습니다.';
				checkMsgTag.style.color = 'red';
				return;
			}
			setPasswordValidate(true);
			checkMsgTag.style.display = 'none';
		}

		if(name === 'passwordCheck' && value !== ''){
			if(!passwordPatternCheck(value)){
				setPasswordChk(false);
				return;
			}
			document.querySelector('#password_validation_message').style.color = 'black';
			setPasswordChk(true);

			let msgTag = document.querySelector('#etc1_password_compare_check');
			if(value !== document.querySelector('#memberPw').value){
				setPasswordValidate(false);
				msgTag.style.display = 'block';
				msgTag.textContent = '비밀번호와 일치하지 않습니다.';
				msgTag.style.color = 'red';
				return;
			}
			setPasswordValidate(true);
			msgTag.style.display = 'none';
		}

		let mobilephoneTag = document.querySelector('#etc1_mobile_validation_msg');
		if(name === 'etc1_mobile_phone_num1' && !phoneNumCheck1(value)){
			setPhoneValidate(false);
			mobilephoneTag.style.display = 'block';
			mobilephoneTag.textContent = '휴대전화 첫 번째 번호는 010, 011, 016, 017, 018, 019 중 하나만 가능합니다.';
			mobilephoneTag.style.color = 'red';
			return;
		}

		mobilephoneTag.style.display = 'none';
		if(name === 'etc1_mobile_phone_num2' && !phoneNumCheck2(value)){
			setPhoneValidate(false);
			mobilephoneTag.style.display = 'block';
			mobilephoneTag.textContent = '휴대전화 두 번째 번호는 3자리 혹은 4자리 숫자만 가능합니다.';
			mobilephoneTag.style.color = 'red';
			return;
		}

		mobilephoneTag.style.display = 'none';
		if(name === 'etc1_mobile_phone_num3' && !phoneNumCheck3(value)){
			setPhoneValidate(false);
			mobilephoneTag.style.display = 'block';
			mobilephoneTag.textContent = '휴대전화 세 번째 번호는 4자리 숫자만 가능합니다.';
			mobilephoneTag.style.color = 'red';
			return;
		}
		
		mobilephoneTag.style.display = 'none';
		setPhoneValidate(true);

		if(name === 'email'){
			if(!emailPatternCheck(value)){
				document.getElementById('etc1_email_validation_msg').style.display = 'block';
				setEmailValidate(false);
				return;
			}
			document.getElementById('etc1_email_validation_msg').style.display = 'none';
			setEmailValidate(true);
		}
		
		if (name === 'address_detail') {
			setJoinForm((prevForm) => ({
				...prevForm,
				addressDetail: value
			}));
		}
		// console.log(joinForm);

	}, [joinForm]);

	const phoneNumCheck1 = (phoneNum1) => {
		return /^01([0|1|6|7|8|9])$/.test(phoneNum1);
	}

	const phoneNumCheck2 = (phoneNum2) => {
		return /^([0-9]{3,4})$/.test(phoneNum2);
	}

	const phoneNumCheck3 = (phoneNum3) => {
		return /^([0-9]{4})$/.test(phoneNum3);
	}
	
	const passwordPatternCheck = (password) => {
		return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*+=-]).{9,}$/.test(password);
	}

	const showhidePasswordMessage = () => {
		this.style.textContent = '비밀번호와 일치하지 않습니다.';
		this.style.display = 'block';
	}

	const emailPatternCheck = (email) => {
		return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
	}

	const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

	const modifyProfile = useCallback(async (formData) => {
		try {
			const response = await axios.patch(`${process.env.REACT_APP_BACK_SERVER}/mypage/updateProfile`, formData);
			joinForm.password = '';

			if(response.data && response.statusCode === 200){
				console.log(response.data);
			}

			window.location.reload();
		} catch(e){
			console.log(e);
		}

	}, []);


	const handleModify = useCallback((e) => {
		e.preventDefault();

		if(!passwordChk){
			alert('비밀번호를 확인해 주세요.');
			return;
		}

		if(!passwordValidate){
			alert('비밀번호 확인을 확인해 주세요.');
			return;
		}

		if(!phoneValidate){
			alert('휴대전화를 확인해 주세요.');
			return;
		}

		if(!emailValidate){
			alert('이메일을 확인해 주세요.');
			return;
		}

		// console.log("emailValue : " + emailValue);
		// joinForm.email = emailValue;
		// console.log('joinForm.etc1_mobile_phone_num1 : ' + joinForm.etc1_mobile_phone_num1);
		// console.log('joinForm.etc1_mobile_phone_num2 : ' + joinForm.etc1_mobile_phone_num2);
		// console.log('joinForm.etc1_mobile_phone_num3 : ' + joinForm.etc1_mobile_phone_num3);
		// console.log('inputAddressValue : ' + inputAddressValue);
		// console.log('inputAddressValue 2: ' + inputAddressValue2);
		const updatedPhoneNum = joinForm.etc1_mobile_phone_num1 + 
								joinForm.etc1_mobile_phone_num2 + 
								joinForm.etc1_mobile_phone_num3;

		delete joinForm.passwordCheck;
		delete joinForm.etc1_mobile_phone_num1;
		delete joinForm.etc1_mobile_phone_num2;
		delete joinForm.etc1_mobile_phone_num3;

		const sendFormData = new FormData();

		sendFormData.append("memberDto", new Blob([JSON.stringify({
			...joinForm,
			memberPnum: updatedPhoneNum,
		})], {
			type: 'application/json'
		}));

		uploadProfiles.forEach(file => {
			sendFormData.append('uploadProfiles', file);
		})

		console.log(joinForm);
		modifyProfile(sendFormData);
	}, [passwordChk, passwordValidate, phoneValidate, emailValidate, joinForm, uploadProfiles]);


    return (
		<div className='etc1_profile'>
			<h2 className='etc1_profile_title'>회원정보 수정</h2>
			<form onSubmit={handleModify} >
			<div className='etc1_profile-image'>
				<img src={joinForm.profileImage && joinForm.profileImage.filetype === 'image'
					? `https://kr.object.ncloudstorage.com/${bucketName}/${joinForm.profileImage.filepath}${joinForm.profileImage.newfilename}`
					: profileImageUrl
				 } 
					 alt='Profile Image'
					 id='profileImg'
					 name='profileImg'></img>
			</div>
			<div>
				<input type='file'
					   style={{display: 'none'}}
					   id='uploadProfileImg'
					   onChange={(e) => changeProfileImageFile(e)}
				></input>
				<button type='button' className='etc1_change_profile_image'
						onClick={changeProfileImage}>프로필 이미지 변경
				</button>
			</div>
			<div className='etc1_validation_box'>
				<strong>*</strong><span className='etc1_validation_msg'>표시는 필수 항목입니다.</span>
			</div>
			<table className='etc1_info'>
				<tbody>
					<tr className='etc1_name'>
						<th>이름</th>
						<td>{joinForm.name}</td>
					</tr>
					<tr className='etc1_user_id'>
						<th>아이디</th>
						<td>{joinForm.memberId}</td>
					</tr>
					<tr className='etc1_password'>
						<th>새 비밀번호<strong>*</strong></th>
						<td style={{display: 'flex'}}>
							{/* <input type='password' name='user_pw' id='user_pw' /> */}
							<TextField
								name='memberPw'
								id='memberPw'
								type={showPassword ? "text" : "password"} // 비밀번호 가시성 토글
								value={joinForm.memberPw}
								onChange={changeTextField}
								InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button onClick={toggleShowPassword}>
                                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                                            </Button>
                                        </InputAdornment>
                                    )
                                }}
								sx={
										{ 
											"& .MuiInputBase-root": { marginTop: '2%'},
											"& .MuiInputBase-input": { fontSize: 14, height: '1.5rem', padding: '0.5rem'}
										}
								}
							></TextField>
							<Box
								id='password_validation_message'
								sx={{alignContent: 'center', marginLeft: '2%'}}>
								※ 영문자, 숫자, 특수문자 포함해서 9자 이상 작성하세요.
							</Box>
							{/* <span> ※영문자, 숫자, 특수문자 합쳐서 8 ~ 16자</span> */}
						</td>
					</tr>
					<tr className='etc1_password_check'>
						<th>새 비밀번호 확인<strong>*</strong></th>
						<td style={{display: 'flex'}}>
							{/* <input type='password' id='etc1_password_check'/> */}
							<TextField
								id='passwordCheck'
								name='passwordCheck'
								type={showPassword ? "text" : "password"} // 비밀번호 가시성 토글
								value={joinForm.passwordCheck}
								onChange={changeTextField}
								sx={
									{ 
										"& .MuiInputBase-root": { marginTop: '1.5%'},
										"& .MuiInputBase-input": { fontSize: 14, height: '1.5rem', padding: '0.5rem'}
									}
								}
							></TextField>
							<span
								name='etc1_password_compare_check'
								id='etc1_password_compare_check'
								onChange={showhidePasswordMessage}
								style={{ display: 'none', alignContent: 'center', marginLeft: '2%'}}>
								
							</span>
						</td>
					</tr>
					<tr className='etc1_mobile_phone'>
						<th>휴대전화<strong>*</strong></th>
						<td style={{display: 'flex'}}>
							<TextField
								name='etc1_mobile_phone_num1'
								id='etc1_mobile_phone_num1'
								value={joinForm.etc1_mobile_phone_num1}
								onChange={changeTextField}
								sx={
									{ 
										"& .MuiInputBase-root": { marginTop: '2%'},
										"& .MuiInputBase-input": { fontSize: 14, height: '1.5rem', padding: '0.5rem'}
									}
								}
							></TextField>
							<Box
								sx={{alignContent: 'center', marginLeft: '1%', marginRight: '1%'}}>
									-
							</Box>
							<TextField
								name='etc1_mobile_phone_num2'
								id='etc1_mobile_phone_num2'
								value={joinForm.etc1_mobile_phone_num2}
								onChange={changeTextField}
								sx={
									{ 
										"& .MuiInputBase-root": { marginTop: '2%'},
										"& .MuiInputBase-input": { fontSize: 14, height: '1.5rem', padding: '0.5rem'}
									}
								}
							></TextField>
							<Box
								sx={{alignContent: 'center', marginLeft: '1%', marginRight: '1%'}}>
									-
							</Box><TextField
								name='etc1_mobile_phone_num3'
								id='etc1_mobile_phone_num3'
								value={joinForm.etc1_mobile_phone_num3}
								onChange={changeTextField}
								sx={
									{ 
										"& .MuiInputBase-root": { marginTop: '2%'},
										"& .MuiInputBase-input": { fontSize: 14, height: '1.5rem', padding: '0.5rem'}
									}
								}
							></TextField>
						</td>
					</tr>
					<tr className='etc1_mobile_phone_msg'>
						<td colSpan={2}>
							<span id='etc1_mobile_validation_msg'
								  style={{ display: 'none', alignContent: 'center', marginLeft: '2%'}}>

							</span>
						</td>
					</tr>
					<tr className='etc1_email'>
						<th>이메일<strong>*</strong></th>
						<td style={{display: 'flex'}}>
							<TextField
                                name="email"
								id="email"
								size='small'
								value={joinForm.email}
                                onChange={changeTextField}
                            />
							<span id='etc1_email_validation_msg'
								  style={{ display: 'none', alignContent: 'center', marginLeft: '2%', fontSize: '15px', color: 'red'}}>
									이메일 형식이 아닙니다.
							</span>
						</td>
					</tr>
					<tr className='etc1_address'>
						<th>주소<strong>*</strong></th>
						<td className='etc1_address_detail_1'>
							{/* <input name='etc1_address_detail_search' id='etc1_address_detail_search' />
							<button className='etc1_address_search_button'>주소 검색</button> */}
							<TextField
									name="address"
									id="address"
									size='small'
									required
									value={joinForm.memberAddress}
									sx={{ marginTop: '0.5%' }}
									InputProps={{
										endAdornment: (
											<div>
                                            <InputAdornment position="end">
                                                <Button onClick={onSearchAddressOpen}>
                                                    주소 검색
                                                </Button>
                                            </InputAdornment>

                                            <ChakraProvider resetCSS={false}>
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
						</td>
						<td className='etc1_address_detail_2'>
							{/* <input name='etc1_address_detail_search2' id='etc1_address_detail_search2' /> */}
							<TextField
									id="address_detail"
									name="address_detail"
									size='small'
									fullWidth
									value={joinForm.addressDetail}
									onChange={changeTextField}
									sx={{ marginTop: '0.5%' }}
								/>
						</td>
					</tr>
				</tbody>
			</table>
			<div className='etc1_button_roundary'>
				<button type="submit" id='etc1_update_button'>저장</button>
				<button id='etc1_cancel_button'>취소</button>
			</div>
			</form>
		</div>
		
    );
};

export default Mypage_info_update;