import React from 'react';
import { styled, Container, Select, MenuItem, Button, Typography, Grid2} from '@mui/material';

const StyledMenuProps = {
    MenuListProps: {
      sx: { padding: 0 },
    },
    PaperProps: {   
      sx: {
        maxHeight: '300px',
        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
        '&::-webkit-scrollbar-thumb': { backgroundColor: '#888' },
        '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
      },
    },
  };
  
  const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
    height: '3rem',
    fontSize: '16px',
    fontWeight: 'bold',
    '&:hover': { backgroundColor: '#7B7B7B' },
  }));
  
  const categories = ["의류, 잡화", "취미, 수집", "도서", "예술품", "전자제품", "사진", "골동품"];
  
  const categoryData = {
    "의류, 잡화": ["남성 의류", "여성 의류", "아동복", "가방", "신발", "액세서리", "스포츠웨어", "기타"],
    "취미, 수집": ["피규어", "모형, 프라모델", "보드게임", "우표, 동전", "빈티지 상품", "악기", "기타"],
    "도서": ["소설", "비문학", "자기계발", "어린이 도서", "학습서", "만화", "기타"],
    "예술품": ["회화", "조각품", "사진", "도자기", "미디어 아트", "서예", "기타"],
    "전자제품": ["스마트폰", "노트북", "TV", "카메라", "오디오", "가전제품", "기타"],
    "사진": ["풍경 사진", "인물 사진", "상업 사진", "예술 사진", "다큐멘터리 사진", "기타"],
    "골동품": ["가구", "장식품", "보석", "기타"]
  };

const RegistrationStep1 = ({ formData, setFormData, nextStep}) => {
  

    const handleSubmit = (e) => {
      e.preventDefault();
      nextStep();
    };

  return (

    <Container maxWidth="lg">

      <form onSubmit={handleSubmit}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', my: 4 }}>1. 카테고리 선택</Typography>

          <Grid2 container sx={{ mb: 4 }}>
            <Grid2 size={2} 
                    sx={{height: '50px',
                    backgroundColor: '#777777',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    textAlign: 'center',
                    lineHeight: '50px',
                    borderTopLeftRadius: '10px',
                    borderBottomLeftRadius: '10px',}}>
                  선택한 카테고리 경로
            </Grid2>
            <Grid2 size={10}
                  sx={{
                    height: '50px',
                    backgroundColor: '#D9D9D9',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    lineHeight: '50px',
                    paddingLeft:'20px',
                    borderTopRightRadius: '10px',
                    borderBottomRightRadius: '10px'}}>
                 {[formData.auctionType, formData.category, formData.subcategory]
                  .filter(Boolean)
                  .join(' > ')}
            </Grid2>
          </Grid2>

            <Select
              value={formData.auctionType}
              onChange={(e) => setFormData({ ...formData, auctionType: e.target.value })}
              MenuProps={StyledMenuProps}
              displayEmpty
              renderValue={(selected) => selected || <Typography sx={{ color: '#777777', fontWeight: 'bold' }}>-경매 종류 선택-</Typography>}
              sx={{ width: '200px', mr: 2, fontWeight: 'bold' }}
              required
            >
              <CustomMenuItem value="실시간 경매">실시간 경매</CustomMenuItem>
              <CustomMenuItem value="블라인드 경매">블라인드 경매</CustomMenuItem>
              <CustomMenuItem value="일반 경매">일반 경매</CustomMenuItem>
            </Select>

            <Select
             value={formData.category}
             onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: ''})}
              MenuProps={StyledMenuProps}
              displayEmpty
              renderValue={(selected) => selected || <Typography sx={{ color: '#777777', fontWeight: 'bold' }}>카테고리 선택</Typography>}
              sx={{ width: '200px', mr: 2, fontWeight: 'bold' }}
              required
            >
              {/* map을 사용해 카테고리 배열을 동적으로 렌더링 */}
                {categories.map((cat, index) => (
                  <CustomMenuItem key={index} value={cat}>
                    {cat}
                  </CustomMenuItem>
                ))}
            </Select>

            <Select
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              MenuProps={StyledMenuProps}
              displayEmpty
              renderValue={(selected) =>
                selected || <Typography sx={{ color: "#777777", fontWeight: "bold" }}>세부 카테고리 선택</Typography>
              }
              sx={{ width: "200px", mr: 2, fontWeight: "bold" }}
              required
            >
              {categoryData[formData.category]?.map((subcat, index) => (
                <CustomMenuItem  key={index} value={subcat}>
                  {subcat}
                </CustomMenuItem >
              ))}
          </Select>

          {/* Displaying Fees */}
          <Typography sx={{ color: 'black', fontSize: '1rem', fontWeight: 'bold', textAlign: 'center', mt: 40 }}>
            현재 적용된 판매 수수료: <span style={{ color: 'red' }}>9.9%</span> (부가세 포함)
          </Typography>

          {/* Next Button */}
          <Grid2 container justifyContent="center" sx={{ mt: 2 }}>
            <Button
              variant="contained"
              sx={{ width: '8rem', backgroundColor: '#D9D9D9', color: 'black', fontWeight: 'bold', fontSize: '1rem' , marginBottom: '2rem'}}
              type="submit"
            >
              다음단계
            </Button>
          </Grid2>
        </form>

    </Container>
  )
}

export default RegistrationStep1