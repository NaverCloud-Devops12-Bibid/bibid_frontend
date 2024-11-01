import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../slices/notification/notificationSlice';

const useNotificationWebSocket = () => {
  const [notifications, setNotifications] = useState([]);
  const memberIndex = useSelector((state) => state.memberSlice.memberIndex);
  const dispatch = useDispatch();

  useEffect(() => {
    const notificationSocket = new SockJS(`${process.env.REACT_APP_BACK_SERVER}/ws-notifications`);
    const notificationClient  = new Client({
      webSocketFactory: () => notificationSocket,
      onConnect: () => {
        console.log("Notification WebSocket 연결됨");

        // 유저별 구독 경로 설정
        const subscriptionPath = `/topic/notifications/${memberIndex}`;
        notificationClient.subscribe(subscriptionPath, (message) => {
          const newNotification = JSON.parse(message.body);
          console.log("알림 수신:", newNotification);
          setNotifications((prev) => [...prev, newNotification]); // 새로운 알림 추가
          dispatch(addNotification(newNotification)); // Redux 상태에 추가
        });
      },
      onStompError: (error) => {
        console.error("Notification WebSocket error:", error);
      },
    });

    notificationClient .activate();

    return () => {
      notificationClient .deactivate();
      console.log("Notification WebSocket 연결 해제됨");
    };
  }, [notifications, dispatch]);

  return { notifications, setNotifications };
};

export default useNotificationWebSocket;
