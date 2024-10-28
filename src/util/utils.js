// 남은 시간을 시간, 분, 초로 변환하는 함수
export const formatTimeDifference = (timeDiff) => {
    const seconds = Math.floor((timeDiff / 1000) % 60);
    const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
    return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
  };
  
// 시간이 undefined거나 null일 때 기본 처리 함수
export const getFormattedRemainingTime = (remainingTime) => {

  if (remainingTime == null) return '시간 계산 중...';
  if (remainingTime < 0) return '종료';
  
  return formatTimeDifference(remainingTime);
};

// 유틸리티 함수
export const formatDateTime = (dateStr, format = 'YYYY.MM.DD') => {
const date = new Date(dateStr);
return format === 'YYYY.MM.DD'
    ? ' ' + date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
    : date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
};

export const formatAuctionTimeRange = (start, end) => {
const startTime = formatDateTime(start, 'HH:mm');
const endTime = formatDateTime(end, 'HH:mm');
return `${startTime} ~ ${endTime}`;
};
  