import React, { useState } from 'react';
import '../../css/CategoryItemDetail.css';
import { Modal } from '@mui/material';
import CatItDetTab from './CatItDetTab';

const CatItDetInquiry = () => {
  const [activeTab, setActiveTab] = useState('inquiry'); // 독립적인 activeTab 상태
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
    const data = {
      type: inquiryType,
      title: inquiryTitle,
      content: inquiryContent,
    };

    console.log('inquiryType: '+ data.type);
    console.log('inquiryTitle: '+ inquiryTitle);
    console.log('inquiryContent: '+ inquiryContent);

    try {
      const response = await fetch(process.env.REACT_APP_FRONT_SERVER + `:3000/CategoryItemDetail/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        alert('문의가 성공적으로 접수되었습니다.');
        closeInquiringModal();
      } else {
        alert('문의 접수에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('문의 접수 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    setInquiringModalOpen(false); // 모달 닫기
  };

  return (
    <div className="CID-item-inquiry" id="CID-item-inquiry">
      <CatItDetTab activeTab={activeTab} setActiveTab={() => setActiveTab('inquiry')}/>      
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>등록자</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="4" className="CID-empty-message">
              등록된 내용이 없습니다.
            </td>
          </tr>
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
              <div>
                <button
                  className="CID-inquiring-modal-submit-button"
                  onClick={handleSubmit}
                >
                  문의하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CatItDetInquiry;
