import React, {useState} from 'react';
import { TextareaAutosize, Container, Select, MenuItem, TextField, Button, Typography, Grid2, Box } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import styled from 'styled-components';
import ThumbnailUpload from './ThumbnailUpload.js';
import AdditionalImagesUpload from './AdditionalImagesUpload.js';
import '../../css/Category.css';

const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
    height: '3rem',
    fontSize: '16px',
    fontWeight: 'bold',
    '&:hover': { backgroundColor: '#7B7B7B' },
}));

const bidIncrements = [1000, 5000, 10000];

const RegistrationStep2 = ({ formData, setFormData, nextStep, prevStep }) => {
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.thumbnail) {
      alert('썸네일 이미지를 업로드해 주세요.');
      return;
  }
    nextStep(); // 다음 단계로 이동
  };

  const [errors, setErrors] = useState({
    startingLocalDateTime: false,
    endingLocalDateTime: false,
  });

    // 유효성 검사 함수
  const validateRequired = (field, value) => {
      setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: !value,
      }));
  };

  // 시작일 변경 핸들러
  const handleStartDateChange = (newValue) => {
    const formattedDate = newValue ? dayjs(newValue).format('YYYY-MM-DDTHH:mm:ss') : '';
     setFormData((prevFormData) => ({
    ...prevFormData,
    startingLocalDateTime: formattedDate,
    endingLocalDateTime: formData.auctionType === '실시간 경매' 
      ? dayjs(newValue).add(30, 'minute').format('YYYY-MM-DDTHH:mm:ss') 
      : prevFormData.endingLocalDateTime // 실시간 경매가 아니면 기존 값 유지
  }));
    validateRequired('startingLocalDateTime', formattedDate);
  };

  // 종료일 변경 핸들러
  const handleEndDateChange = (newValue) => {
    const formattedDate = newValue ? dayjs(newValue).format('YYYY-MM-DDTHH:mm:ss') : '';
    setFormData({ ...formData, endingLocalDateTime: formattedDate });
    validateRequired('endingLocalDateTime', formattedDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg">
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', my: 4 }}>2-1. 물품 설정</Typography>

          <Grid2 container>
            <Grid2 size={2.5} 
              sx={{textAlign:'center', 
              backgroundColor:'#E7E9FF', 
              height:'65px',
              lineHeight:'65px',
              fontWeight:'bold',
              border : '1px solid #7B7B7B'}}>
              물품 제목*
            </Grid2>
            <Grid2 size={9.5}
              sx={{
                display:'flex',
                alignItems:'center',
                height:'65px',
                border : '1px solid #7B7B7B',
                paddingLeft: '10px'}}>
              <TextField
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                variant="outlined"
                placeholder="물품 제목을 입력해주세요."
                size="small"
                sx={{ width:'50%', '& .MuiOutlinedInput-root': {fontWeight:'bold'}}}
                required
              />
            </Grid2>
          </Grid2>

          <Grid2 container>
            <Grid2 size={2.5} 
              sx={{textAlign:'center', 
              backgroundColor:'#E7E9FF', 
              fontWeight:'bold',
              border : '1px solid #7B7B7B',
              display:'flex',
              alignItems:'center',
              justifyContent:'center'}}>
              이미지 등록*
            </Grid2>

            <Grid2 size={9.5} sx={{ display: 'flex', flexDirection: 'column', height: 'auto', border: '1px solid #777777' }}>
              {/* 썸네일 이미지 업로드 컴포넌트 */}
              <ThumbnailUpload formData={formData} setFormData={setFormData}/>

              {/* 추가 이미지 업로드 컴포넌트 */}
              <AdditionalImagesUpload formData={formData} setFormData={setFormData}/>
            </Grid2>
          </Grid2>

          <Grid2 container>
            <Grid2 size={2.5} 
              sx={{textAlign:'center', 
              backgroundColor:'#E7E9FF', 
              height:'320px',
              lineHeight:'320px',
              fontWeight:'bold',
              border : '1px solid #7B7B7B'}}>
              물품 설명*
            </Grid2>
            <Grid2 size={9.5}
              sx={{
                display:'flex',
                alignItems:'center',
                height:'320px',
                border : '1px solid #7B7B7B',
                padding : '15px'}}>
               <TextareaAutosize
                    minRows={15}
                    value={formData.productDescription}
                    onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                    style={{ width: '100%', padding: '10px', fontSize: '16px', borderColor: '#ccc', borderRadius: '4px', resize: 'none' }}
                    placeholder="※ 직거래를 유도하는 문구, 개인정보(휴대폰, E-mail등)나 html 태그는 사용할 수 없습니다. 
                    <원티드 약관  15조 2항>’직거래 유도 문구 사용(연락처 및 이메일 포함) 

                    1건 : 경고 후 문구가 삭제되며, 문구 삭제가 불가능할 경우 물품을 삭제합니다.
                    2건 : 회원 아이디(ID)사용을 임의 정지할 수 있습니다."
                    sx={{"& .MuiOutlinedInput-root": { color: 'black', fontWeight: 'bold' }}}
                    required
                    
                />
            </Grid2>
          </Grid2>

          <Typography variant="h5" sx={{ fontWeight: 'bold', my: 4 }}>2-2. 경매 설정</Typography>

          <Grid2 container>
            <Grid2 size={2.5} 
              sx={{textAlign:'center', 
              backgroundColor:'#E7E9FF', 
              height:'65px',
              lineHeight:'65px',
              fontWeight:'bold',
              border : '1px solid #7B7B7B'}}>
              경매 시작가*
            </Grid2>
            <Grid2 size={9.5}
              sx={{
                display:'flex',
                alignItems:'center',
                height:'65px',
                fontWeight:'bold',
                border : '1px solid #7B7B7B',
                padding : '15px'}}>
              <TextField
                variant="outlined"
                size="small"
                sx={{ width: '10rem', '& .MuiOutlinedInput-root': { fontWeight:'bold'} }} 
                value={formData.startingPrice}
                onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                required
              /> 
              <span style={{marginLeft : '5px'}}> 원 </span>
              <span style={{marginLeft : '40px'}}> **금액관련 주의사항 기재 필요 </span>
            </Grid2>
          </Grid2>

          <Grid2 container>
            <Grid2 size={2.5} 
              sx={{textAlign:'center', 
              backgroundColor:'#E7E9FF', 
              height:'80px',
              lineHeight:'80px',
              fontWeight:'bold',
              border : '1px solid #7B7B7B'}}>
              경매 기간*
            </Grid2>
            <Grid2 size={9.5}
              sx={{
                height:'80px',
                border : '1px solid #7B7B7B',
                paddingLeft:'1rem',
                display:'flex'
              }}>
              
              <Box sx={{display:'flex', flexDirection:'row',  alignItems:'center' , my:1}}>
                <span style={{marginRight:'0.6rem'}}>시작일:</span>
                <DateTimePicker
                  value={formData.startingLocalDateTime ? dayjs(formData.startingLocalDateTime) : null}
                  onChange={handleStartDateChange}
                  // minDateTime={dayjs().add(1, 'hour')} 
                  minDateTime={dayjs()} 
                  renderInput={(params) => (
                    <TextField
                        {...params}
                        error={errors.startingLocalDateTime}
                        helperText={errors.startingLocalDateTime ? '시작일을 선택해 주세요.' : ''}
                        required
                    />
                  )}
                  ampm={false}
                />
              </Box>

              <Box sx={{display: 'flex', flexDirection:'row',  alignItems:'center' , my:1, ml:1}}>
                {formData.auctionType !== '실시간 경매' ?
                  <>
                  <span style={{marginRight:'0.6rem'}}>종료일:</span>
                    <DateTimePicker
                      value={formData.endingLocalDateTime ? dayjs(formData.endingLocalDateTime) : null}
                      onChange={handleEndDateChange}
                      minDateTime={dayjs(formData.startingLocalDateTime).add(1, 'hour')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={errors.endingLocalDateTime}
                          helperText={errors.endingLocalDateTime ? '종료일을 선택해 주세요.' : ''}
                          required

                          disabled={formData.auctionType === '실시간 경매'}
                          style={{
                            display: formData.auctionType === '실시간 경매' ? 'none' : 'block'
                          }}
                        />
                      )}
                      ampm={false}
                    />
                    </> :
                    <p className='dateTimePickerAlert'>
                      ** 실시간 경매일 시, 종료시간이 시작시간으로 부터 30분 이후로 설정됩니다.
                    </p>
                  }
              </Box>

            </Grid2>
          </Grid2>

          <Grid2 container>
            <Grid2 size={2.5} 
              sx={{textAlign:'center', 
              backgroundColor:'#E7E9FF', 
              height:'65px',
              lineHeight:'65px',
              fontWeight:'bold',
              border : '1px solid #7B7B7B'}}>
              입찰 단위*
            </Grid2>
            <Grid2 size={9.5}
              sx={{
                display:'flex',
                alignItems:'center',
                height:'65px',
                fontWeight:'bold',
                border : '1px solid #7B7B7B',
                padding : '15px'}}>
              <Select
                value={formData.bidIncrement}
                onChange={(e) => setFormData({ ...formData, bidIncrement: e.target.value })}
                displayEmpty
                size="small"
                sx={{ width: '10rem', fontWeight: 'bold' }}
                required
              >
                {bidIncrements.map((bid, index) => (
                    <CustomMenuItem key={index} value={bid}>
                        {bid}
                    </CustomMenuItem>
                    ))}
                </Select>
            </Grid2>
          </Grid2>

          <Grid2 container justifyContent="space-between" alignItems="center" sx={{ mt: 10, mb : 10 }}>
            <Grid2>
              <Button
                variant="contained"
                sx={{ width: '8rem', backgroundColor: '#D9D9D9', color: 'black', fontWeight: 'bold', fontSize: '1rem' }}
                onClick={prevStep} // 이전 단계로 돌아가기
              >
                이전 단계
              </Button>
            </Grid2>

            <Grid2>
              <Button
                variant="contained"
                sx={{ width: '8rem', backgroundColor: '#D9D9D9', color: 'black', fontWeight: 'bold', fontSize: '1rem' }}
                type="submit"
              >
                다음단계
              </Button>
            </Grid2>
          </Grid2>
        </form>
      </Container>
    </LocalizationProvider>
  );
}

export default RegistrationStep2;
