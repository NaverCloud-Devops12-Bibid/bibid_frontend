import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {setNotifications} from '../slices/notification/notificationSlice'
import axios from 'axios';
import useNotificationWebSocket from '../customHooks/useNotificationWebSocket';

// 알림 초기화 컴포넌트
const NotificationInitializer = () => {

    const memberIndex = useSelector(state => state.memberSlice.memberIndex);

    const dispatch = useDispatch();

    useNotificationWebSocket();

    useEffect(() => {
        const fetchInitialNotifications = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACK_SERVER}/auth/checkLogin`, {
                    withCredentials: true,
                });

                if (response.status === 200 && response.data.item === "ROLE_USER") {
                    try {
                        const response = await axios.get(`${process.env.REACT_APP_BACK_SERVER}/api/notifications/${memberIndex}`, {
                            withCredentials: true,
                        });
                        dispatch(setNotifications(response.data));
                    } catch (error) {
                        console.error("Failed to fetch notifications:", error);
                    }
                }
            } catch (error) {
                console.warn("로그인되지 않은 상태입니다.", error);
            }
        };

        fetchInitialNotifications();
    }, [dispatch, memberIndex]);

    return null;

};

export default NotificationInitializer;
