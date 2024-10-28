import React, {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위해 추가
import alarmIcon from '../../images/alarm.svg';
import alarmActiveIcon from '../../images/alarm_active_Icon.svg';
import '../../css/Layout/Alarm.css';
import { NotificationContext } from '../../context/NotificationContext';

const Alarm = () => {
  const [showNotifications, setShowNotifications] = useState(false);  // 알림창 보이기 상태
  const [selectedTab, setSelectedTab] = useState('전체');  // 기본 탭은 '전체'
  const navigate = useNavigate();  // 페이지 이동 함수


  // NotificationContext에서 알림 데이터 가져오기
  const { notifications } = useContext(NotificationContext);

  // 알림 버튼 클릭 시 알림 목록 보이기 상태 변경
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  // 알림 목록이 있으면 active 상태로 아이콘을 변경
  const currentIcon = notifications.length > 0 ? alarmActiveIcon : alarmIcon;

  // 탭 선택 시 스타일 변경
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  // 알림창 외부를 클릭했을 때 알림창을 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.ALnotificationBox') && !event.target.closest('.HDnavbarAlarm')) {
        setShowNotifications(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [showNotifications]);

  // 알림 항목 클릭 시 해당 페이지로 이동
  const handleItemClick = (link) => {
    navigate(link);  // 해당 링크로 페이지 이동
  };

  return (
    <div className="HDnavbarAlarmWrapper">
      <div className="HDnavbarAlarm" onClick={handleNotificationClick}>
        <img src={currentIcon} alt="alarm"></img>
      </div>

      {/* 알림창 표시 */}
      {showNotifications && (
        <div className="ALnotificationBox">
          <div className='ALnotificationHeader'>
            <h2>알림</h2>
          </div>
          <div className='ALnotificationContents'>
            <div className="ALnotificationTabs">
            {['전체', '충전', '환전', '구매내역', '판매내역'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={selectedTab === tab ? 'activeTab' : ''}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="ALnotificationList">
              {notifications.map((notification, index) => (
                <div className="ALnotificationItem" key={index} onClick={() => handleItemClick(notification.link)}>
                  <p className="ALnotificationTitle">{notification.alertTitle}</p>
                  <p>{notification.alertContent}</p>
                  <p>{notification.alertDate}</p>
                </div>
                ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Alarm;