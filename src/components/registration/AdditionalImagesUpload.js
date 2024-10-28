import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

const AdditionalImagesUpload = ({ formData, setFormData }) => {
    const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);

    useEffect(() => {
        // 페이지 로드 시 기존 이미지 미리보기 상태 복원
        if (formData.additionalImages) {
            const previews = formData.additionalImages.map((file) => URL.createObjectURL(file));
            setAdditionalImagePreviews(previews);
        }
    }, [formData.additionalImages]);

    const handleAdditionalImageChange = (event) => {
        const files = Array.from(event.target.files);

        if (formData.additionalImages && formData.additionalImages.length + files.length > 6) {
            alert('이미지는 최대 6개까지 업로드할 수 있습니다.');
            return;
        }

        const newFiles = [];
        const newPreviews = [];

        files.forEach((file) => {
            newPreviews.push(URL.createObjectURL(file));
            newFiles.push(file);
        });

        // 새 이미지를 추가하고 상태를 업데이트
        setAdditionalImagePreviews((prev) => [...prev, ...newPreviews]);
        setFormData({ ...formData, additionalImages: [...(formData.additionalImages || []), ...newFiles] });
    };

    const handleDeleteImage = (index) => {
        // 선택된 이미지를 삭제
        const newImages = formData.additionalImages.filter((_, imgIndex) => imgIndex !== index);
        setFormData({ ...formData, additionalImages: newImages });

        const newPreviews = additionalImagePreviews.filter((_, imgIndex) => imgIndex !== index);
        setAdditionalImagePreviews(newPreviews);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        handleAdditionalImageChange({ target: { files } });
    };

    return (
        <Box sx={{ width: '100%', padding: '15px', height: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Typography sx={{ minWidth: '15%', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    기타 이미지
                </Typography>
                <Box
                    sx={{
                        width: '75%',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)', // 3개의 열로 배치
                        gap: '10px', // 간격 조정
                    }}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()} // 드래그 시 기본 이벤트 방지
                >
                    {/* 이미지가 있을 경우 각각의 이미지 박스 표시 */}
                    {additionalImagePreviews.map((image, index) => (
                        <Box
                            key={index}
                            sx={{
                                height: '100px',
                                backgroundColor: '#e0e0e0',
                                border: '1px solid #ddd',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                position: 'relative',
                            }}
                        >
                            <img src={image} alt={`Additional ${index}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            <Button
                                onClick={() => handleDeleteImage(index)} // 삭제 기능
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    backgroundColor: '#2E2E2E',
                                    color: 'white',
                                    minWidth: '20px',
                                    maxHeight: '20px',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                }}
                            >
                                x
                            </Button>
                        </Box>
                    ))}

                    {/* 추가 이미지 업로드 버튼 (6개 미만일 때만 표시) */}
                    {formData.additionalImages?.length < 6 && (
                        <Box
                            sx={{
                                height: '100px',
                                backgroundColor: '#e0e0e0',
                                border: '1px dashed #ddd',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                color: '#777777',
                                fontSize: '1.125rem',
                            }}
                            onClick={() => document.getElementById('additionalInputNew').click()} // 클릭 시 새로운 이미지 업로드
                        >
                            <input
                                type="file"
                                id="additionalInputNew"
                                style={{ display: 'none' }}
                                multiple
                                onChange={handleAdditionalImageChange} // 새로운 이미지 추가 처리
                            />
                            추가 이미지
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default AdditionalImagesUpload;
