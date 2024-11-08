import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../slices/notification/notificationSlice';
import { fetchMember } from '../apis/member/memberApis';

const useNotificationWebSocket = () => {
  const [notifications, setNotifications] = useState([]);
  const memberIndex = useSelector((state) => state.memberSlice.memberIndex);
  const dispatch = useDispatch();

  useEffect(() => {
    const notificationSocket = new SockJS(`${process.env.REACT_APP_BACK_SERVER}/ws-notifications`, null, {
      withCredentials: true, // 쿠키를 전달할 수 있도록 설정
    });
    const notificationClient  = new Client({
      webSocketFactory: () => notificationSocket,
      onConnect: () => {

        // 유저별 구독 경로 설정
        const subscriptionPath = `/topic/notifications/${memberIndex}`;
        notificationClient.subscribe(subscriptionPath, (message) => {
          const newNotification = JSON.parse(message.body);
          setNotifications((prev) => [...prev, newNotification]); // 새로운 알림 추가
          dispatch(addNotification(newNotification)); // Redux 상태에 추가

          if (newNotification.notificationType === 'HIGHER_BID') {
            dispatch(fetchMember()); 
          }

          if (newNotification.notificationType === 'AUCTION_WIN') {
            dispatch(fetchMember()); 
          }
        });
      },
      onStompError: (error) => {
        console.error("Notification WebSocket error:", error);
      },
    });

    notificationClient .activate();

    return () => {
      notificationClient .deactivate();
    };
  }, [notifications, dispatch]);

  return { notifications, setNotifications };
};

export default useNotificationWebSocket;
