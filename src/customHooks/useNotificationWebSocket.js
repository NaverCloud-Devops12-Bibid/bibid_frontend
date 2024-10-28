import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const useNotificationWebSocket = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const notificationSocket = new SockJS('http://localhost:8080/ws-notifications');
    const notificationClient  = new Client({
      webSocketFactory: () => notificationSocket,
      onConnect: () => {
        console.log("Notification WebSocket 연결됨");

        // 알림 구독 경로 설정
        notificationClient .subscribe('/topic/notifications', (message) => {
          const newNotification = JSON.parse(message.body);
          console.log("알림 수신:", newNotification);
          setNotifications((prev) => [...prev, newNotification]); // 새로운 알림 추가
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
  }, []);

  return { notifications, setNotifications };
};

export default useNotificationWebSocket;
