import React, { useState } from 'react';
import '../../css/CategoryItemDetail.css';
import { Modal } from '@mui/material';
import CatItDetTab from './CatItDetTab';
import axios from 'axios';

const CatItDetInquiry = ({ auctionItem, qnAList }) => {
  const [inquiringModalOpen, setInquiringModalOpen] = useState(false);

  
  // 입력값 상태 관리
  const [inquiryType, setInquiryType] = useState('');
  const [inquiryTitle, setInquiryTitle] = useState('');
  const [inquiryContent, setInquiryContent] = useState('');

  const openInquiringModal = () => {
    setInquiringModalOpen(true);
  };

  const closeInquiringModal = () => {
    setInquiringModalOpen(false);
  };

  // 서버에 데이터를 전송하는 함수
  const handleSubmit = async () => {
    if (!inquiryType || !inquiryTitle || !inquiryContent) {
      alert('문의 유형, 제목, 내용을 빠짐없이 작성해주세요.');
      return;
    }
    const inquiryData = {
      qnaType: inquiryType,
      qnaTitle: inquiryTitle,
      qnaContent: inquiryContent
    };

    // console.log('inquiryType: ' + inquiryData.qnaType);
    // console.log('inquiryTitle: ' + inquiryData.qnaTitle);
    // console.log('inquiryContent: ' + inquiryData.qnaContent);

    // 백엔드로 데이터 전송
    axios.post(`http://localhost:8080/auctionDetail/category-item-detail/${auctionItem.auctionIndex}/inquiry`, inquiryData, {
      headers: {
        'Content-Type': 'application/json', // 요청의 콘텐츠 타입을 JSON으로 지정
      },
      withCredentials: true
    })
    .then((response) => {
      console.log('Success:', response.data); // 성공 시 서버로부터 응답 데이터 출력
      alert('문의가 완료되었습니다.');
      closeInquiringModal();
      window.location.reload();
    })
    .catch((error) => {
      alert("에러가 발생했습니다. 관리자에게 문의해 주세요.")
      console.error('Error:', error); // 오류 발생 시 오류 메시지 출력
    });
  };

  return (
    <div className="CID-item-inquiry" id="CID-item-inquiry">
      <CatItDetTab />      
      <table>
        <thead>
          <tr>
            <th>문의 번호</th>
            <th>제목</th>
            <th>등록자</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(qnAList) && qnAList.length > 0 ? (
            qnAList.map((record, index) => (
              <tr key={index}>
                <td>{qnAList.length - index}</td>
                <td>{record.qnaTitle}</td>
                <td>{record.nickname}</td>
                {/* <td>{(record.regDate).toLocaleString()}</td> */}
                <td>{new Intl.DateTimeFormat('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                            // hour: '2-digit',
                            // minute: '2-digit'
                          }).format(new Date(record.regDate))}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="CID-empty-message">
                등록된 내용이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button className="CID-inquiry-button" onClick={openInquiringModal}>
        문의하기
      </button>

      {/* 모달 창 */}
      <Modal
        open={inquiringModalOpen}
        onClose={closeInquiringModal}
        className="CID-inquiring-modal-content"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="CID-inquiring-modal-backdrop">
          <div className="CID-inquiring-modal-box">
            <h2 id="modal-title" className="CID-inquiring-modal-header">문의하기</h2>
            <p className="CID-inquiring-modal-subtext">
              * 문의 유형을 선택 후 문의 내용을 자세하게 작성해 주세요.
            </p>

            <div className="CID-inquiring-modal-body">
              <label htmlFor="inquiry-type">문의 유형</label>
              <select
                id="inquiry-type"
                className="CID-inquiring-modal-input"
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
              >
                <option value="">문의 유형 선택</option>
                <option value="기술 지원">상품 문의</option>
                <option value="일반 문의">기타 문의</option>
              </select>

              <label htmlFor="inquiry-title">문의 제목</label>
              <input
                type="text"
                id="inquiry-title"
                className="CID-inquiring-modal-input"
                placeholder="제목은 최대 50자까지 입력 가능합니다."
                value={inquiryTitle}
                onChange={(e) => setInquiryTitle(e.target.value)}
                maxLength={50}
              />

              <label htmlFor="inquiry-content">문의 내용</label>
              <textarea
                id="inquiry-content"
                className="CID-inquiring-modal-input"
                rows="5"
                placeholder="문의 내용을 입력해 주세요."
                value={inquiryContent}
                onChange={(e) => setInquiryContent(e.target.value)}
              />
            </div>

            <div className="CID-inquiring-modal-footer">
              <button
                className="CID-inquiring-modal-submit-button"
                onClick={handleSubmit}
              >
                문의하기
              </button>
              <button
                className="CID-inquiring-modal-close-button"
                onClick={closeInquiringModal}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CatItDetInquiry;
