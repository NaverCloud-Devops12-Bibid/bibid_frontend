import React, { createContext } from 'react';
import useNotificationWebSocket from '../customHooks/useNotificationWebSocket';

// NotificationContext 생성
export const NotificationContext = createContext();

// NotificationProvider 컴포넌트
export const NotificationProvider = ({ children }) => {
    const { notifications, setNotifications } = useNotificationWebSocket();

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};
