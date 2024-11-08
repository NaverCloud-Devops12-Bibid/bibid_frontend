import React, {useCallback, useState} from 'react';
import { Box, Checkbox, FormControlLabel, Modal, Typography } from "@mui/material";
import DemoPaper from '@mui/material/Paper';
import styled from "styled-components";
import ModalContent from "./CheckBoxModalContent";

const CheckBoxBlock = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 1.25rem;
    width: 100rem;
`;

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxHeight: '80%', // 최대 높이 설정
    overflowY: 'auto', // 스크롤 가능하도록 설정
};

const CheckBoxComponent = ({checked, setChecked, onCheckedChange}) => {
    const boxes = [
        { label: "[필수] BIBID 이용약관 동의" },
        { label: "[필수] 전자금융거래 이용약관 동의" },
        { label: "[필수] 개인정보 수집 및 이용 동의" },
        { label: "[필수] 개인정보 제3자 제공 동의" },
        { label: "[선택] 마케팅 목적의 개인정보 수집 및 이용 동의" },
        { label: "[선택] 광고성 정보 수신 동의" },
    ];

    const [openModals, setOpenModals] = useState(Array(boxes.length).fill(false)); // 모달 상태 배열

    const handleOpen = (index) => {
        const newOpenModals = [...openModals];
        newOpenModals[index] = true;
        setOpenModals(newOpenModals);
    };

    const handleClose = (index) => {
        const newOpenModals = [...openModals];
        newOpenModals[index] = false;
        setOpenModals(newOpenModals);
    };

    const handleChange1 = () => {
        const allChecked = checked.every(item => item);
        const newChecked = checked.map(() => !allChecked); // 모든 체크박스의 상태 반전
        setChecked(newChecked);
        const checkedIndices = newChecked.map((item, idx) => item ? idx : -1).filter(index => index !== -1);
        onCheckedChange(checkedIndices); // 체크된 인덱스 전달
    };

    const handleChange = (index) => {
        const newChecked = [...checked];
        newChecked[index] = !newChecked[index]; // 개별 체크박스 상태 토글
        setChecked(newChecked);
        const checkedIndices = newChecked.map((item, idx) => item ? idx : -1).filter(index => index !== -1);
        onCheckedChange(checkedIndices); // 체크된 인덱스 전달
    };

    return (
        <CheckBoxBlock>
            <DemoPaper variant="outlined" sx={{ width: '50%' }}>
                <FormControlLabel
                    sx={{ marginLeft: '0.625rem', marginTop: '1rem', }}
                    label={
                        <Typography
                          sx={{
                            fontFamily: 'IBM Plex Sans KR, sans-serif', // 폰트 설정
                          }}
                        >
                          모두 확인하였으며 동의합니다.
                        </Typography>
                      }
                    control={
                        <Checkbox
                            checked={checked.every((item) => item)}
                            indeterminate={checked.some((item) => item) && !checked.every((item) => item)}
                            onChange={handleChange1}
                        />
                    }
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <FormControlLabel
                            sx={{ marginLeft: '0.625rem' }}
                            label="[필수] 만 14세 이상입니다."
                            control={<Checkbox checked={checked[0]} onChange={() => handleChange(0)} />}
                        />
                    </Box>

                    {boxes.map((box, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <FormControlLabel
                                sx={{ marginLeft: '0.625rem', '& .MuiFormControlLabel-label': { fontFamily: 'IBM Plex Sans KR, sans-serif' }  }}
                                label={box.label}
                                control={<Checkbox checked={checked[index + 1]} onChange={() => handleChange(index + 1)} />} // +1 for boxes
                            />
                            <img
                                src="/images/Vector.svg"
                                alt="Arrow"
                                style={{ height: '0.9rem', marginRight: '1.2rem', cursor: 'pointer' }}
                                onClick={() => handleOpen(index)} // 클릭 시 해당 인덱스의 모달 열기
                            />
                        </Box>
                    ))}

                    {boxes.map((box, index) => (
                        <Modal
                            key={index}
                            open={openModals[index]} // 현재 모달이 열려야 할 인덱스와 비교
                            onClose={() => handleClose(index)} // 모달 닫기
                        >
                            <Box sx={modalStyle}>
                                <ModalContent title={box.label} index={index} sx={{'& .MuiFormControlLabel-label': { fontFamily: 'IBM Plex Sans KR, sans-serif'}}} /> {/* index를 전달 */}
                            </Box>
                        </Modal>
                    ))}
                </Box>
            </DemoPaper>
        </CheckBoxBlock>
    );
};

export default CheckBoxComponent;
